import { Component, OnInit } from '@angular/core';
import { ClientesModel } from 'src/app/models/clientes.model';
import { ClientesService } from '../../services/Clientes/clientes.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from '../../services/general.service';
import { environment } from 'src/environments/environment';
import { FacturasService } from 'src/app/services/Facturas/facturas.service';
import { FacturasModel } from '../../models/facturas.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  iClientes = new ClientesModel();
  iCliente = new ClientesModel();
  loading: any;
  liFactura = new Array<FacturasModel>();
  
  constructor(private service: ClientesService,
    private fservice: FacturasService,
    private router: Router,
    private loadinCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private gservice: GeneralService) {
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
        
        this.gservice.saveStorage('InfoCliente', this.iCliente);
        this.gservice.saveStorage('IDCliente', this.iCliente.IDCliente);

        this.gservice.IsHideMenu = true;
        this.gservice.avatar = environment.imageURL + this.iCliente.Foto;

        console.log('avatar', this.gservice.avatar);
        this.gservice.saveStorage('avatar', this.gservice.avatar);
        
        this.getPlan();
        //this.navCtrl.navigateRoot(['home']);
      } else {
        this.showAlert('Usuario o contraseña incorrectos.');
      }
    }
  }

  async getPlan() {
    //Validando Planes.

    let token = await this.gservice.getStorage('token');
    //await this.presentLoading('Cargando plan.');
    //const fresult = await this.fservice.GetFacturasByCliente(token, this.iCliente.IDCliente);    
    this.fservice.GetFacturasByCliente(token, this.iCliente.IDCliente).then(fresult => {

      this.liFactura = fresult as Array<FacturasModel>;

      if (this.liFactura != null) {
        if (this.liFactura.length > 0) {
          this.gservice.setStorage('IDPlan', this.liFactura[0].IDPlan);
          this.gservice.setStorage('Factura', this.liFactura);
        } else {
          this.gservice.setStorage('IDPlan', 1);
          this.gservice.setStorage('Factura', null);
        }
      } else {
        this.gservice.setStorage('IDPlan', 1);
        this.gservice.setStorage('Factura', null);
      }

      this.router.navigate(['home']);

    });
    
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
