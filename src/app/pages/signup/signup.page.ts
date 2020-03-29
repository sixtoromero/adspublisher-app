import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController } from '@ionic/angular';

import { ClientesModel } from '../../models/clientes.model';
import { ClientesService } from '../../services/Clientes/clientes.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  
  iClientes = new ClientesModel();
  loading: any;

  constructor(private service: ClientesService, 
              private loadinCtrl: LoadingController, 
              private alertCtrl: AlertController) { }

  async ngOnInit() {
  }  

  async registro(freg: NgForm) {
    if (freg.valid){
      
      this.presentLoading('Por favor espere.');
      
      const valid = await this.service.register(this.iClientes);
      
      if (valid == true) {
        freg.reset();
        this.showAlert('Bienvenido. Se le ha notificado en su correo los pasos a seguir con el proceso.');
      } else {
        this.showAlert('Ha ocurrido un inconveniente por favor intente nuevamente.');
      }
      this.loading.dismiss();
      
    }
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
