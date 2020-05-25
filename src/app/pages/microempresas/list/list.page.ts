import { Component, OnInit } from '@angular/core';
import { MicroEmpresaModel } from '../../../models/microempresa.model';
import { GeneralService } from '../../../services/general.service';
//import { Marker } from '../../../models/marker.model';
import { CreatePage } from '../create/create.page';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ClientesModel } from '../../../models/clientes.model';
import { MicroEmpresaService } from '../../../services/MicroEmpresas/microempresas.service';
import { FacturasModel } from 'src/app/models/facturas.model';
import { FacturasService } from 'src/app/services/Facturas/facturas.service';

declare var google;

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  iMicroEmpresa = new MicroEmpresaModel();
  liMicroEmpresa = new Array<MicroEmpresaModel>();
  IDCliente: number;
  iCliente = new ClientesModel();
  loading: any;
  IsActivate: boolean;
  liFactura = new Array<FacturasModel>();
  iFactura = new FacturasModel();

  constructor(public gservice: GeneralService,
              public service: MicroEmpresaService,
              private loadinCtrl: LoadingController,
              private modalCtrl: ModalController,
              public fservice: FacturasService,
              private alertCtrl: AlertController) { }

  async ngOnInit() {
    this.gservice.avatar = await this.gservice.getStorage('avatar');
    this.iCliente = await this.gservice.getStorage('InfoCliente') as ClientesModel;

    this.getInfoMicroEmpresa();

    this.liFactura = await this.gservice.getStorage('Factura') as Array<FacturasModel>;
    debugger;
    if (this.liFactura === null) {
      this.CrearPlanInicial().then(() => {
        this.showAlert('Tiene un plan Inicial de 30 días de prueba, si requiere más beneficios observe nuestros planes');
      });

    } else {
      if (this.liFactura.length === 0) {
        this.CrearPlanInicial().then(() => {
          this.showAlert('Tiene un plan Inicial de 30 días de prueba, si requiere más beneficios observe nuestros planes');
        });
      }
    }

  }
  
  async CrearPlanInicial() {
    let valid: any;
    
    let loading = this.loadinCtrl.create({
      message: 'Espere un momento por favor.'
    });
    (await loading).present();

    const token = await this.gservice.getStorage('token');
    const IDCliente = await this.gservice.getStorage('IDCliente');

    this.iFactura.IDPlan = 1;
    this.iFactura.Valor_Plan_Actual = 0;
    this.iFactura.IDCliente = IDCliente;

    valid = await this.fservice.updateFactura(this.iFactura, token);

    if (valid === true) {
      this.gservice.setStorage('IDPlan', 1);

      this.fservice.GetFacturasByCliente(token, IDCliente).then(fresult => {
        this.liFactura = fresult as Array<FacturasModel>;
        console.log('FACTURA', this.liFactura);
        if (this.liFactura != null) {
          if (this.liFactura.length > 0) {
            this.gservice.setStorage('Factura', this.liFactura);
          }
        }
      });

    }

    (await loading).dismiss();


  }

  async modalcreate() {

    const modal = await this.modalCtrl.create({
      component: CreatePage,
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
        this.getInfoMicroEmpresa();
      }
    }
  }

  async modalupdate(IDMicroempresa: number) {
    
    console.log('IDMicroempresa', IDMicroempresa);

    const modal = await this.modalCtrl.create({
      component: CreatePage,
      componentProps: {
        title: 'Actualizar Microempresa',
        IDMicroEmpresa: IDMicroempresa
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    
    if (data) {
      if (data["ModalProcess"]) {
        this.getInfoMicroEmpresa();
      }
    }
  }


  async getInfoMicroEmpresa() {

    let _token = await this.gservice.getStorage('token');

    await this.presentLoading('Cargando lista de Microempresas.');
    const result = await this.service.getInfoMicroEmpresa(_token, this.iCliente.IDCliente);

    this.loading.dismiss();

    if (result == null) {
      this.showAlert("No se cargaron los registros, intente nuevamente");
    } else {
      
      this.liMicroEmpresa = result as Array<MicroEmpresaModel>;

      if (this.liMicroEmpresa.length > 0) {
        switch(this.liMicroEmpresa[0].IDPlan) {
          case 1:
          case 2: {
             this.IsActivate = true;
             break;
          }
          case 3: {
            if (this.liMicroEmpresa.length === 3) {
              this.IsActivate = true;
            } else {
              this.IsActivate = false;
            }
            break;
         }
         case 4: {
          if (this.liMicroEmpresa.length === 5) {
            this.IsActivate = true;
          } else {
            this.IsActivate = false;
          }
          break;
       }
       }
      }
    }

    // else {
    //   if (this.liMicroEmpresa.length === 0) {
    //     this.gservice.setStorage('IDPlan', 1);
    //   } else {
    //     //Consultando Planes
    //   }
    // }
  }



  async DeleteMicroEmpresa(IDMicroEmpresa: number) {
    
    let _token = await this.gservice.getStorage('token');

    await this.presentLoading('Cargando lista de Microempresas.');
    const result = await this.service.deletemicroempresa(IDMicroEmpresa, _token);

    this.loading.dismiss();

    if (result == null) {
      this.showAlert('Ha ocurrido un error al eliminar el registro.');
    } else {
      this.getInfoMicroEmpresa();
    }
  }

  
  async presentAlert(IDMicroEmpresa: number) {
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
              //console.log('Botón OK');
              this.DeleteMicroEmpresa(IDMicroEmpresa);
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

  async showAlert(message: string) {

    const alert = await this.alertCtrl.create({
      header: 'ADS Publisher',
      message,
      buttons: ['Aceptar']
    });

    await alert.present();
  }
}
