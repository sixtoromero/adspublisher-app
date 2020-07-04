import { Component, OnInit, Input, DebugElement } from '@angular/core';
import { NgForm } from '@angular/forms';
//import { Marker } from '../../../models/marker.model';
import { MicroEmpresaModel } from '../../../models/microempresa.model';
import { MicroEmpresaService } from '../../../services/MicroEmpresas/microempresas.service';
import { GeneralService } from '../../../services/general.service';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { ClientesModel } from '../../../models/clientes.model';
import { FacturasService } from 'src/app/services/Facturas/facturas.service';
import { FacturasModel } from 'src/app/models/facturas.model';
import { CategoriaModel } from 'src/app/models/categoria.mode';
import { CategoriasService } from 'src/app/services/categorias/categorias.service';
import { SubCategoriasService } from 'src/app/services/subcategorias/subcategorias.service';
import { SubCategoriaModel } from 'src/app/models/subcategoria.model';
import { DescriptionDynamicModel } from 'src/app/models/descriptiondynamic.model';
import { DescriptiondynamicService } from 'src/app/services/descriptiondynamic/descriptiondynamic.service';
import { CategoriasPorMicroEmpresasService } from 'src/app/services/categoriaspormicroempresas/categoriaspormicroempresas.service';
import { CategoriasPorMicroEmpresasModel } from 'src/app/models/categoriaspormicroempresas.model';
import { MarkerModel } from 'src/app/models/marker.model';

declare var google;

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  //@Input() IDCliente: number;
  @Input() IDMicroEmpresa: number = 0;

  iMicroempresa = new MicroEmpresaModel();
  iCliente = new ClientesModel();
  Nomenclatura: string;
  //IDCategoria: number;
  map = null;

  liCategorias = new Array<CategoriaModel>();
  liSubCategorias = new Array<SubCategoriaModel>();
  DescripcionCategoria: string;
  DescripcionSubCategoria: string[];

  liCaMicroEmpresa = new Array<CategoriasPorMicroEmpresasModel>();

  loading: any;

  geocoder = new google.maps.Geocoder();

  token: string;
  liFactura = new Array<FacturasModel>();

  marker: MarkerModel;
  miputavariable: string;

  constructor(private service: MicroEmpresaService,
        public gservice: GeneralService,
        private fservice: FacturasService,
        private cservice: CategoriasService,
        private sservice: SubCategoriasService,
        private dservice: DescriptiondynamicService,
        private cmservice: CategoriasPorMicroEmpresasService,
        private loadinCtrl: LoadingController,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController) { }

  async ngOnInit() {
    //console.log('IDClientes en Crear', this.IDCliente);
    //this.IDMicroEmpresa = 0;
    this.token = await this.gservice.getStorage('token');

    this.iCliente = await this.gservice.getStorage('InfoCliente') as ClientesModel;
    this.iMicroempresa.IDCliente = this.iCliente.IDCliente;

    if (this.IDMicroEmpresa > 0) {
      this.getCategorias().then(result => {
        this.getMicroEmpresa().then(() => {
          this.GetDescriptionDyn(this.iMicroempresa.IDCategoria).then(() => {
            this.getSubCategorias(this.iMicroempresa.IDCategoria).then(() => {
              this.GetCategoriasporMicroempresas(this.iMicroempresa.IDMicroEmpresa).then(() => {
                //this.iMicroempresa.SubCategorias.push(this.liCaMicroEmpresa);
                this.liCaMicroEmpresa.forEach(item => {
                  this.iMicroempresa.SubCategorias.push(item.IDSubCategoria);
                  //this.DescripcionSubCategoria.push(item.Descripcion);
                });
              });
            });
          });
        });
      });
    } else {

      this.getCategorias();
    }

    // if (this.IDMicroEmpresa > 0) {
    //   this.getMicroEmpresa().then(result => {
    //     //this.loading.dismiss();
    //     this.getCategorias().then(() => {
    //       this.GetDescriptionDyn(this.iMicroempresa.IDCategoria);
    //     });
    //   });
    // } else {

    //   this.getCategorias();      
    // }

    // this.iMicroempresa.Latitud = '21.15282000';
    // this.iMicroempresa.Longitud = '-7.0012451';

    //this.loadMap();

    // this.liFactura = await this.gservice.getStorage('Factura') as Array<FacturasModel>;

    // if (this.liFactura === null) {
    //   this.showAlert('Tiene un plan Inicial de 30 días de prueba, si requiere más beneficios observe nuestros planes');
    // } else {
    //   if (this.liFactura.length === 0) {
    //     this.showAlert('Tiene un plan Inicial de 30 días de prueba, si requiere más beneficios observe nuestros planes');
    //   }
    // }
  }


  async getPlan() {
    //Validando Planes.
    let token = await this.gservice.getStorage('token');
    await this.presentLoading('Cargando plan.');
    const fresult = await this.fservice.GetFacturasByCliente(token, this.iCliente.IDCliente);

    this.liFactura = fresult as Array<FacturasModel>;

    if (this.liFactura.length > 0) {
      this.gservice.setStorage('IDPlan', this.liFactura[0].IDPlan);
      this.gservice.setStorage('Factura', this.liFactura);
    } else {
      this.gservice.setStorage('IDPlan', 1);
      this.gservice.setStorage('Factura', null);
    }
  }

  async getCoords() {

    this.map = null;
    this.loadMap();

    this.geocodeAddress(this.geocoder, this.map).then(result => {

      let resp: string;
      resp = result as string;
      let localization = resp.split('|', 2);

      this.iMicroempresa.Latitud = localization[0];
      this.iMicroempresa.Longitud = localization[1];

      //console.log(result);

    }).catch(err => {
      console.log(err);
    });
  }

  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    // create LatLng object
    const myLatLng = {lat: 4.714527, lng: -74.0748661};
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
  }

  async registro(freg: NgForm) {
    let valid: any;
    if (freg.valid) {
      
      this.presentLoading('Por favor espere.');
      
      if (this.IDMicroEmpresa === 0) {
        this.iMicroempresa.IDMicroEmpresa = 0;
        valid = await this.service.register(this.iMicroempresa, this.token);
      } else {
        this.iMicroempresa.IDMicroEmpresa = this.IDMicroEmpresa;
        valid = await this.service.updatemicroempresa(this.iMicroempresa, this.token);
      }

      if (valid === true) {
        freg.reset();
        this.map = null;

        this.loadMap();

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

  async getMicroEmpresa() {
    
    let _token = await this.gservice.getStorage('token');

    //await this.presentLoading('Cargando Microempresa.');

    const result = await this.service.getMicroEmpresa(_token, this.IDMicroEmpresa);
    this.iMicroempresa = result as MicroEmpresaModel;
    
    //console.log('MicroEmpresa', this.iMicroempresa);

    //this.loading.dismiss();

    if (result == null) {
      this.showAlert('No se cargaron los registros, intente nuevamente');
    } else {
      /*NOTA: Se debe consultar las subcategorías para validar cual es su categoría. las subcategorías sirven para el otro combo*/
      //this.GetDescriptionDyn(this.iMicroempresa)
      this.getCoords();
    }
  }


  async GetDescripcionCategoria() {
    
    //await this.presentLoading('Cargando Microempresa.');
    await this.presentLoading('Espere un momento por favor.');

    this.getMicroEmpresa().then(result => {
      this.loading.dismiss();
      this.GetDescriptionDyn(this.iMicroempresa.IDCategoria);
    });

  }


  async getCategorias() {

    let token = await this.gservice.getStorage('token');

    //await this.presentLoading('Cargando Categorías.');
    const result = await this.cservice.GetCategorias(token);
    this.liCategorias = result as CategoriaModel[];
    //this.loading.dismiss();

    if (result == null) {
      this.showAlert('No se cargaron los registros de Categorías, intente nuevamente');
    }

  }

  async GetCategoriasporMicroempresas(ID: number) {

    let loading = this.loadinCtrl.create({
      message: 'espere un momento por favor.'
    });
    (await loading).present();

    let token = await this.gservice.getStorage('token');
    
    const result = await this.cmservice.GetCategoriasporMicroempresas(token, ID);

    this.liCaMicroEmpresa = result as CategoriasPorMicroEmpresasModel[];

    (await loading).dismiss();

    if (result == null) {
      this.showAlert('No se cargaron los registros de Categorías, intente nuevamente');
    }

  }

  async getSubCategorias(ID: number) {

    let token = await this.gservice.getStorage('token');

    let loading = this.loadinCtrl.create({
      message: 'Cargando Subcategorías'
    });
    (await loading).present();

    const result = await this.sservice.GetSubCategorias(token, ID);

    //console.log('SubCategorias', result);

    (await loading).dismiss();

    if (result == null) {
      //this.showAlert('No se cargaron las subcategorias, intente nuevamente');
    } else {
      this.liSubCategorias = result as SubCategoriaModel[];
    }
  }

  close() {
    this.modalCtrl.dismiss();
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

  geocodeAddress(geocoder, resultsMap) {

      let Latitud = 0;
      let Longitud = 0;
    
      let address = this.iMicroempresa.Direccion + ' Bogotá, Suba';

      var promise = new Promise(function(resolve, reject) {

      geocoder.geocode({ 'address': address}, function(results, status) {
        if (status === 'OK') {
          
          resultsMap.setCenter(results[0].geometry.location);

          var marker = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location
          });
  
          Latitud = results[0].geometry.location.lat();
          Longitud = results[0].geometry.location.lng();                  

          let localization: string;
          localization = Latitud.toString() + '|' + Longitud.toString();
          
          resolve(localization);
  
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
          reject('Geocode was not successful for the following reason: ' + status);
        }
      });
    });

    return promise;
    //var address = document.getElementById('address').value;

  }

  compareWith(item1, item2) {
     return item1.IDCategoria === item2.IDCategoria;
  }

  async GetDescriptionDyn(ID: number) {


    let iDescDyn = new DescriptionDynamicModel();

    iDescDyn.TableName = 'Categorias';
    iDescDyn.Filter = 'IDCategoria';
    iDescDyn.GetFieldName = 'Descripcion';
    iDescDyn.Value = ID;

    //await this.presentLoading('Espere un momento por favor.');
    const result = await this.dservice.GetDescriptionDyn(iDescDyn, this.token);
    
    //this.loading.dismiss();

    if (result == null) {
      this.showAlert('No se cargaron los registros, intente nuevamente');
    } else {
      this.DescripcionCategoria = result['Data'];
    }
  }
  
}
