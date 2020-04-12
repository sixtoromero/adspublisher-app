import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { CreatepqrsPage } from '../createpqrs/createpqrs.page';
import { GeneralService } from '../../../services/general.service';
import { PQRSService } from '../../../services/pqrs/pqrs.service';
import { ParametrosModel } from '../../../models/parametros.model';
import { ParametrosService } from '../../../services/Parametros/parametros.service';
import { PQRSModel } from '../../../models/pqrs.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-listpqrs',
  templateUrl: './listpqrs.page.html',
  styleUrls: ['./listpqrs.page.scss'],
})
export class ListpqrsPage implements OnInit {

  IDCliente: number;

  iPQRS = new PQRSModel();
  liParametros = new Array<ParametrosModel>();

  loading: any;

  constructor(private modalCtrl: ModalController,
              private loadinCtrl: LoadingController,
              private alertCtrl: AlertController,
              public gservice: GeneralService,
              public service: ParametrosService) { }

  ngOnInit() {
    //this.getInfoParametros();
  }

  async register(freg: NgForm) {
    
  }

  async modalcreate() {
    
    const modal = await this.modalCtrl.create({
      component: CreatepqrsPage,
      componentProps: {
        title: 'Crear Microempresa',
        model: this.IDCliente
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    
    console.log('DATA', data);

    if (data) {
      if (data["ModalProcess"]) {
        //this.getInfoMicroEmpresa();
      }
    }
  }

  async modalupdate(IDPQRS: number) {
    const modal = await this.modalCtrl.create({
      component: CreatepqrsPage,
      componentProps: {
        title: 'Actualizar PQRS',
        IDPQRS
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    
    if (data) {
      if (data["ModalProcess"]) {
        //this.getPQRS();
      }
    }
  }

  async presentAlert(IDPQRS: number) {
    const alert = await this.alertCtrl.create({
      header: 'ADS Publisher',
      subHeader: 'Eliminando registro',
      message: '¿Desea eliminar el registro seleccionado?',
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
              this.DeletePQRS(IDPQRS);
          }
        }
      ]
    });

    await alert.present();
  }

  async DeleteParametro(ID: number) {
    
    let _token = await this.gservice.getStorage('token');

    await this.presentLoading('Cargando lista de Microempresas.');
    const result = await this.service.DeleteParametros(ID, _token);

    this.loading.dismiss();

    if (result == null) {
      this.showAlert("Ha ocurrido un error al eliminar el registro.");
    } else {
      this.getInfoPQRS();
    }
  }

  async getInfoPQRS() {

  }

  async DeletePQRS(ID: number) {

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

}
