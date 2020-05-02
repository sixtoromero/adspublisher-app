import { Component, OnInit, Input } from '@angular/core';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { PlanModel } from '../../../models/plan.model';
import { GeneralService } from '../../../services/general.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FacturasModel } from 'src/app/models/facturas.model';
import { HistorialPagosService } from '../../../services/historialpagos/historialpagos.service';
import { HistorialPagosModel } from '../../../models/historialpagos.model';
import { ClientesService } from '../../../services/Clientes/clientes.service';
import { ClientesModel } from '../../../models/clientes.model';
import { PlanesService } from '../../../services/Planes/planes.service';
import { GeneralModel } from '../../../models/general.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  constructor(private payPal: PayPal,
              private alertCtrl: AlertController,
              private loadinCtrl: LoadingController,
              private router: Router,
              private hservice: HistorialPagosService,
              private cservice: ClientesService,
              private pservice: PlanesService,
              private gservice: GeneralService) { }

  iPlan = new PlanModel();
  loading: any;
  liFactura = new Array<FacturasModel>();
  iHistorialPago = new HistorialPagosModel();
  iCliente = new ClientesModel();
  liHistorialPagos = new Array<HistorialPagosModel>();

  IsPayPal: boolean;


  token: string;
  
  paymentAmount: string = '17000';
  currency: string = 'USD';
  currencyIcon: string = '$';

  async ngOnInit() {

    this.IsPayPal = false;

    this.iCliente = await this.gservice.getStorage('InfoCliente') as ClientesModel;

    this.token = await this.gservice.getStorage('token');
    this.liFactura = await this.gservice.getStorage('Factura') as Array<FacturasModel>;

    if (this.liFactura != null) {
      if (this.liFactura.length > 0) {

        this.pservice.GetPlan(this.token, this.liFactura[0].IDPlan).then(presult => {
          let detalle: string[];
          let iDet: GeneralModel;

          this.iPlan = presult as PlanModel;

          detalle = this.iPlan.Detalle.split(',');
          this.iPlan.ADetalle = new Array<GeneralModel>();

          detalle.forEach(i => {
            iDet = new GeneralModel();
            iDet.Value = i;
            iDet.Descripcion = i;
            this.iPlan.ADetalle.push(iDet);
          });

          this.gservice.setStorage('MyPlan', this.iPlan);

          this.iHistorialPago.IDFactura = this.liFactura[0].IDFactura;
          this.iHistorialPago.Valor_Pago = this.iPlan.Precio;
          this.iHistorialPago.Estado = true;
          this.iHistorialPago.NroMeses  = this.iPlan.NroMeses;

          this.iCliente.IDFactura = this.liFactura[0].IDFactura;

          if (this.iPlan.IDPlan === 1) {
            this.presentAlert('Para gestionar el pago por favor seleccione un plan', true, 'planes');
          } else {
            this.getHistorialPago();
          }

        });
      }
    } else {
      this.presentAlert('Para gestionar el pago por favor seleccione un plan', true, 'planes');
    }
    //console.log('Historial Pago', this.iHistorialPago);

  }

  async payWithPaypal() {

    let valid: any;

    this.payPal.init({
      PayPalEnvironmentProduction: 'AViS202nQP2glu8nQRwqaZtX23CuSS2rF0ehZSr7WwmjwaVlKxgOxFh_XRXjqxouw2dheqw7YwFBLnFl',
      PayPalEnvironmentSandbox: 'AViS202nQP2glu8nQRwqaZtX23CuSS2rF0ehZSr7WwmjwaVlKxgOxFh_XRXjqxouw2dheqw7YwFBLnFl'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      //Ads-Publisher	
      //this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        const payment = new PayPalPayment(this.iPlan.Precio.toString(), this.currency, 'Descripción', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {

          if (res['response'].state === 'approved') {

            this.presentLoading('Registrando pago, por favor espere un momento.');
            this.hservice.insertHistorialPagos(this.iHistorialPago, this.token).then(hpagos => {              

              this.loading.dismiss();

              this.iCliente.IDPlan = this.iPlan.IDPlan;
              this.cservice.sendMail(this.iCliente, this.token).then(email => {
                if (hpagos === true) {
                  this.presentAlert('El Pago ha sido generado exitosamente.', true);
                } else {
                  this.presentAlert('El pago con Paypal fue exitoso, valide con su administrador el registro en la plataforma.', true);
                }
              });
            });
          } else {
            this.presentAlert('El pago no se generó por favor intente nuevamente.', false);
          }
        }, () => {
          // Error or render dialog closed without being successful
          this.presentAlert('Ha ocurrido un error inesperado en el pago del plan seleccionado', false);
        });
      }, () => {
        // Error in configuration
        this.presentAlert('Ha ocurrido un error inesperado en la configuración de paypal', false);
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
      this.presentAlert('Ha ocurrido un error inesperado, tal vez PayPal no sea compatible o algo más', false);
    });
  }

  async showAlert(message: string) {

    const alert = await this.alertCtrl.create({
      header: 'ADS Publisher',
      message,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async presentAlert(message: string, isPage: boolean, page: string = 'home') {
    const alert = await this.alertCtrl.create({
      header: 'ADS Publisher',
      subHeader: 'Resultado del Pago',
      message,
      buttons: [
        {
            text: 'Aceptar',
            handler: (blah) => {
              if (isPage) {
                this.router.navigate([page]);
              }
          }
        }
      ]
    });
    await alert.present();
  }

  async presentLoading(message: string) {
    
    this.loading = await this.loadinCtrl.create({
      message
    });

    return this.loading.present();

  }

  async getHistorialPago() {
    await this.presentLoading('Cargando historial de pagos.');
    const result = await this.hservice.getHistorialPago(this.token, this.iCliente.IDCliente);
    this.loading.dismiss();

    if (result == null) {
      this.showAlert('No se cargaron los registros, intente nuevamente');
    } else {
      this.liHistorialPagos = result as Array<HistorialPagosModel>;
      if (this.liHistorialPagos.length > 0) {
        this.IsPayPal = false;
      } else {
        if (this.iPlan.IDPlan === 1) {
          this.IsPayPal = false;
          this.presentAlert('Para gestionar el pago por favor seleccione un plan, ¿desea continuar con el proceso?', true, 'planes');
        } else {
          this.IsPayPal = true;
        }
      }
    }

  }

}
