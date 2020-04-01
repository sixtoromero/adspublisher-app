import { Component, OnInit } from '@angular/core';
import { ClientesModel } from 'src/app/models/clientes.model';
import { ClientesService } from '../../services/Clientes/clientes.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from '../../services/general.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  iClientes = new ClientesModel();
  iCliente = new ClientesModel();
  //loading: any;
  
  constructor(private service: ClientesService,
    private router: Router,
    private loadinCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private oGeneral: GeneralService) {
  }

  ngOnInit() {
    this.iClientes.Correo = 'sixto.jose@gmail.com';
    this.iClientes.Password = '51x70.j053';
  }

  async getLogin(freg: NgForm) {
    if (freg.valid) {

      //this.presentLoading('Por favor espere.');
      let loading = this.loadinCtrl.create({
        message: 'Por favor espere...'
      });
      (await loading).present();

      const result = await this.service.login(this.iClientes.Correo, this.iClientes.Password);
      (await loading).dismiss();
      console.log('DATA', result);
      if (result != null) {
        //navegar al tabs
        //this.navCtrl.navigateRoot(['home'], { animated: true});
        this.iCliente = result as ClientesModel;
        this.oGeneral.saveStorage('InfoCliente', this.iCliente);
        this.oGeneral.IsHideMenu = true;
        this.oGeneral.avatar = environment.imageURL + this.iCliente.Foto;

        console.log('avatar', this.oGeneral.avatar);
        this.oGeneral.saveStorage('avatar', this.oGeneral.avatar);

        this.router.navigate(['home']);
        //this.navCtrl.navigateRoot(['home']);
      } else {
        this.showAlert('Usuario o contraseña incorrectos.');
      }
    }
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
