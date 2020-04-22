import { Component, OnInit } from '@angular/core';
import { PlanModel } from '../../models/plan.model';
import { GeneralService } from '../../services/general.service';
import { PlanesService } from '../../services/Planes/planes.service';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
import { GeneralModel } from '../../models/general.model';
import { FacturasService } from 'src/app/services/Facturas/facturas.service';
import { FacturasModel } from '../../models/facturas.model';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.page.html',
  styleUrls: ['./planes.page.scss'],
})
export class PlanesPage implements OnInit {

  liPlanes = new Array<PlanModel>();
  loading: any;
  IDPlan: number;
  iFactura = new FacturasModel();

  constructor(public gservice: GeneralService,
              public service: PlanesService,
              public fservice: FacturasService,
              private loadinCtrl: LoadingController,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) { }

  async ngOnInit() {
    this.gservice.avatar = await this.gservice.getStorage('avatar');
    this.IDPlan = await this.gservice.getStorage('IDPlan');
    this.getPlanes();
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

        console.log('LISTA', this.liPlanes);
      }
    }
  }

  async SetPlan(IDPlan: number, ValorPlan: number) {

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
            console.log('Cancelar');
          }
        },
        {
            text: 'Aceptar',
            handler: (blah) => {
              this.SetPlan(IDPlan, ValorPlan);
          }
        }
      ]
    });

    await alert.present();
  }

  /*
    NOTA: Importante se debe crear la página de historial de pago para efectuar el mismo. Validar como se va a pagar.
  */

}
