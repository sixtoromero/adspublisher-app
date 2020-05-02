import { Component, OnInit } from '@angular/core';
import { PlanModel } from '../../models/plan.model';
import { GeneralService } from '../../services/general.service';
import { PlanesService } from '../../services/Planes/planes.service';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
import { GeneralModel } from '../../models/general.model';
import { FacturasService } from 'src/app/services/Facturas/facturas.service';


import { FacturasModel } from '../../models/facturas.model';
import { Router } from '@angular/router';
import { HistorialPagosService } from 'src/app/services/historialpagos/historialpagos.service';
import { HistorialPagosModel } from 'src/app/models/historialpagos.model';
import { ClientesModel } from 'src/app/models/clientes.model';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.page.html',
  styleUrls: ['./planes.page.scss'],
})
export class PlanesPage implements OnInit {

  liPlanes = new Array<PlanModel>();
  loading: any;
  IDPlan: number;
  liFactura = new Array<FacturasModel>();
  iFactura = new FacturasModel();
  liHistorialPagos = new Array<HistorialPagosModel>();
  iCliente = new ClientesModel();
  IsPlan: boolean;
  token: string;

  constructor(public gservice: GeneralService,
              public service: PlanesService,
              public fservice: FacturasService,
              private hservice: HistorialPagosService,
              private router: Router,
              private loadinCtrl: LoadingController,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) { }

  async ngOnInit() {
    this.gservice.avatar = await this.gservice.getStorage('avatar');
    this.IDPlan = await this.gservice.getStorage('IDPlan');
    this.IsPlan = false;
    this.iCliente = await this.gservice.getStorage('InfoCliente') as ClientesModel;

    this.token = await this.gservice.getStorage('token');

    this.getHistorialPago();
    

  }

  async getPlanes() {
    
    const token = await this.gservice.getStorage('token');
    
    await this.presentLoading('Cargando lista de Planes.');
    const result = await this.service.GetPlanes(token);

    this.loading.dismiss();

    if (result == null) {
      this.showAlert("No se cargaron los registros, intente nuevamente");
    } else {
      this.liPlanes = result as Array<PlanModel>;
      if (this.liPlanes.length > 0) {
        let detalle: string[];
        let iDet: GeneralModel;

        this.liPlanes.forEach(item => {
          
          item.Seleccionado = false;
          
          if (item.IDPlan === this.IDPlan) {
            item.Seleccionado = true;
          }

          detalle = item.Detalle.split(',');
          item.ADetalle = new Array<GeneralModel>();
          detalle.forEach(i => {
            iDet = new GeneralModel();
            iDet.Value = i;
            iDet.Descripcion = i;
            item.ADetalle.push(iDet);
          });
        });
      }
    }
  }

  async SetPlan(IDPlan: number, ValorPlan: number, IsPayPal: boolean = false) {

    let valid: any;

    this.presentLoading('Por favor espere.');

    const token = await this.gservice.getStorage('token');
    const IDCliente = await this.gservice.getStorage('IDCliente');

    this.iFactura.IDPlan = IDPlan;
    this.iFactura.Valor_Plan_Actual = ValorPlan;
    this.iFactura.IDCliente = IDCliente;

    valid = await this.fservice.updateFactura(this.iFactura, token);

    if (valid === true) {
      
      this.loading.dismiss();
      
      this.gservice.setStorage('IDPlan', IDPlan);

      this.liPlanes.forEach(item => {
        
        if (item.IDPlan === IDPlan) {
          item.Seleccionado = true;
        } else {
          item.Seleccionado = false;
        }
      });

      this.fservice.GetFacturasByCliente(token, IDCliente).then(fresult => {
        this.liFactura = fresult as Array<FacturasModel>;
        console.log('FACTURA', this.liFactura);
        if (this.liFactura != null) {
          if (this.liFactura.length > 0) {
            this.gservice.setStorage('Factura', this.liFactura);

            if (IsPayPal) {
              this.router.navigate(['historialpagoslist']);
            }
          }
        }
      });
    } else {
      this.showAlert('Ha ocurrido un inconveniente por favor intente nuevamente.');
    }

    this.loading.dismiss();
  }

  async presentLoading(message: string) {
    
    this.loading = await this.loadinCtrl.create({
      message
    });

    return this.loading.present();

  }

  async showAlert(message: string) {

    const alert = await this.alertCtrl.create({
      header: 'ADS Publisher',
      message,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async presentAlert(Plan: string, IDPlan: number, ValorPlan: number) {
    const alert = await this.alertCtrl.create({
      header: 'ADS Publisher',
      subHeader: 'Métodos de Pago',
      message: 'Ha seleccionado el plan ' + Plan + '. Desea realizar el pago del mismo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Cancelar');
          }
        },
        {
            text: 'Aceptar',
            handler: (blah) => {
              this.SetPlan(IDPlan, ValorPlan, true);
          }
        }
      ]
    });

    await alert.present();
  }

  async getHistorialPago() {
    await this.presentLoading('Cargando historial de pagos.');
    const result = await this.hservice.getHistorialPago(this.token, this.iCliente.IDCliente);
    this.loading.dismiss();
    
    this.getPlanes();

    if (result == null) {
      //this.showAlert('No se cargaron los registros, intente nuevamente');
      this.IsPlan = false;
    } else {
      this.liHistorialPagos = result as Array<HistorialPagosModel>;
      if (this.liHistorialPagos.length > 0) {
        this.showAlert('Ya tiene un pago realizado con el plan ' + this.liHistorialPagos[0].Titulo);
        this.IsPlan = true;
      } else {
        this.IsPlan = false;
      }
    }
  }

}
