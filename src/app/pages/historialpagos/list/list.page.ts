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
              private gservice: GeneralService) { }

  iPlan = new PlanModel();
  loading: any;
  liFactura = new Array<FacturasModel>();
  iHistorialPago = new HistorialPagosModel();
  iCliente = new ClientesModel();


  token: string;
  
  paymentAmount: string = '17000';
  currency: string = 'USD';
  currencyIcon: string = '$';

  async ngOnInit() {

    this.iCliente = await this.gservice.getStorage('InfoCliente') as ClientesModel;

    this.iPlan = await this.gservice.getStorage('MyPlan');
    //console.log('Plan', this.iPlan);
    
    this.token = await this.gservice.getStorage('token');
    this.liFactura = await this.gservice.getStorage('Factura') as Array<FacturasModel>;

    if (this.liFactura.length > 0) {

      this.iHistorialPago.IDFactura = this.liFactura[0].IDFactura;
      this.iHistorialPago.Valor_Pago = this.iPlan.Precio;
      this.iHistorialPago.Estado = true;
      this.iHistorialPago.NroMeses  = this.iPlan.NroMeses;

      this.iCliente.IDFactura = this.liFactura[0].IDFactura;
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

          // console.log('Respuesta total:', res);
          // console.log('Response:', res['response']);
          // console.log('status:', res['response'].state);

          if (res['response'].state === 'approved') {
            //insertHistorialPagos
            this.presentLoading('Registrando pago, por favor espere un momento.');
            this.hservice.insertHistorialPagos(this.iHistorialPago, this.token).then(hpagos => {
              console.log('Resultado Historial Pagos', hpagos);

              this.loading.dismiss();
              
              console.log('IDPlan: ', this.iPlan.IDPlan);

              //this.iCliente.IDMicroempresa = this.
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

          // Successfully paid

          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          // Error or render dialog closed without being successful
        });
      }, () => {
        // Error in configuration
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
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

  async presentAlert(message: string, isPage: boolean) {
    const alert = await this.alertCtrl.create({
      header: 'ADS Publisher',
      subHeader: 'Resultado del Pago',
      message,
      buttons: [
        {
            text: 'Aceptar',
            handler: (blah) => {
              if (isPage) {
                this.router.navigate(['home']);
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

}
