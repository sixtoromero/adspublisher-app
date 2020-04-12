import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PQRSModel } from '../../../models/pqrs.model';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { ParametrosService } from 'src/app/services/Parametros/parametros.service';
import { PQRSService } from '../../../services/pqrs/pqrs.service';
import { ParametrosModel } from '../../../models/parametros.model';

@Component({
  selector: 'app-createpqrs',
  templateUrl: './createpqrs.page.html',
  styleUrls: ['./createpqrs.page.scss'],
})
export class CreatepqrsPage implements OnInit {

  iPQRS = new PQRSModel();
  liParametros = new Array<ParametrosModel>();
  loading: any;  
  @Input() IDPQRS: number = 0;
  token: string;

  constructor(private modalCtrl: ModalController,
    private loadinCtrl: LoadingController,
    private alertCtrl: AlertController,
    public gservice: GeneralService,
    private pservice: ParametrosService,
    private service: PQRSService) { }

  async ngOnInit() {
    
    this.token = await this.gservice.getStorage('token');
    this.getInfoParametros();

  }

  async register(freg: NgForm) {
    let valid: any;
    if (freg.valid) {
      
      this.presentLoading('Por favor espere.');
      
      if (this.IDPQRS == 0) {
        this.iPQRS.IDPQRS = 0;
        valid = await this.service.register(this.iPQRS, this.token);
      } else {
        this.iPQRS.IDPQRS = this.IDPQRS;
        valid = await this.service.updatePQRS(this.iPQRS, this.token);
      }
      
      if (valid == true) {
        freg.reset();
        
        this.loading.dismiss();

        this.modalCtrl.dismiss({
          ModalProcess: true
        });
        //this.showAlert('Bienvenido. Se le ha notificado en su correo los pasos a seguir con el proceso.');
      } else {
        this.showAlert('Ha ocurrido un inconveniente por favor intente nuevamente.');
      }
      
      this.loading.dismiss();
    }
  }

  async getInfoParametros() {

    await this.presentLoading('Cargando lista de Tipos de Petición.');
    const result = await this.pservice.getInfoParametros(this.token, 1);
    
    this.liParametros = result as Array<ParametrosModel>;

    this.loading.dismiss();

    if (result == null) {
      this.showAlert("No se cargaron los registros, intente nuevamente");
    }

    console.log('Data', this.liParametros);
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

  close() {
    this.modalCtrl.dismiss();
  }

}
