import { Component, OnInit, Input, DebugElement } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Marker } from '../../../models/marker.model';
import { MicroEmpresaModel } from '../../../models/microempresa.model';
import { MicroEmpresaService } from '../../../services/MicroEmpresas/microempresas.service';
import { GeneralService } from '../../../services/general.service';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { ClientesModel } from '../../../models/clientes.model';

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
  map = null;
  loading: any;
  geocoder = new google.maps.Geocoder();
  token: string;
  
  marker: Marker;
  miputavariable: string;

  constructor(private service: MicroEmpresaService,
        public gservice: GeneralService,
        private loadinCtrl: LoadingController,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController) { }

  async ngOnInit() {
    //console.log('IDClientes en Crear', this.IDCliente);
    
    this.token = await this.gservice.getStorage('token');
    
    this.iCliente = await this.gservice.getStorage('InfoCliente') as ClientesModel;
    this.iMicroempresa.IDCliente = this.iCliente.IDCliente;
    this.loadMap();

    if (this.IDMicroEmpresa > 0) {
      this.getMicroEmpresa();
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

    //console.log('RESULTADO GEOLOCALIZACIÓN', location);

  }

  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    // create LatLng object
    const myLatLng = {lat: 6.2511208, lng: -75.5761448};
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      //this.renderMarkers();
    });
  }

  renderMarkers() {
    this.marker.position = {lat: 4.658383846282959, lng: -74.09394073486328};
    this.marker.title = "PROBANDO ANDO";
    this.addMarker(this.marker);
  }

  addMarker(marker: Marker) {
    
    const contentString = 'La ubicación de la dirección ' + this.iMicroempresa.Direccion;

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    
    const mk = new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title
    });

    mk.addListener('click', function() {
      infowindow.open(this.map, mk);
    });
    return mk;
  }

  async registro(freg: NgForm) {
    let valid: any;
    if (freg.valid) {
      
      this.presentLoading('Por favor espere.');
      
      if (this.IDMicroEmpresa == 0) {
        this.iMicroempresa.IDMicroEmpresa = 0;
        valid = await this.service.register(this.iMicroempresa, this.token);
      } else {
        this.iMicroempresa.IDMicroEmpresa = this.IDMicroEmpresa;
        valid = await this.service.updatemicroempresa(this.iMicroempresa, this.token);
      }
      
      if (valid == true) {
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

    await this.presentLoading('Cargando Microempresa.');
    const result = await this.service.getMicroEmpresa(_token, this.IDMicroEmpresa);
    this.iMicroempresa = result as MicroEmpresaModel;

    this.loading.dismiss();

    if (result == null) {
      this.showAlert("No se cargaron los registros, intente nuevamente");
    } else {
      this.getCoords();
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
    
      let address = this.iMicroempresa.Direccion + " Medellín, Antioquia";

      var promise = new Promise(function(resolve, reject) {

      geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
          
          resultsMap.setCenter(results[0].geometry.location);

          var marker = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location
          });
  
          Latitud = results[0].geometry.location.lat();
          Longitud = results[0].geometry.location.lng();
          
          // console.log('Latitud', Latitud);
          // console.log('Longitud', Longitud);

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
}
