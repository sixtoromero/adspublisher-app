import { Component, OnInit } from '@angular/core';
//import { Marker, MarkerModel } from '../../models/marker.model';
import { GeneralService } from '../../services/general.service';
import { FilterPage } from './filter/filter.page';
import { ModalController, AlertController } from '@ionic/angular';
import { MicroEmpresaModel } from '../../models/microempresa.model';
import { MarkerModel } from 'src/app/models/marker.model';
import { PositionModel } from 'src/app/models/position.model';

import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {

  map = null;
  filtro: string;
  liMicroEmpresa = new Array<MicroEmpresaModel>();
  markers: MarkerModel[];

  constructor(gservice: GeneralService,
              private modalCtrl: ModalController,
              private geolocation: Geolocation,
              public alertCtrl: AlertController) { }

  ngOnInit() {
    this.filtro = 'filtro';
    this.getGeo();
  }

  async modalfilter() {
    const modal = await this.modalCtrl.create({
      component: FilterPage,
      componentProps: {
        title: 'Crear Cliente',
        modelinfotercero: null
      }
    });
    
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data["ModalProcess"]) {

      this.liMicroEmpresa = data["GetMicroEmpresa"] as MicroEmpresaModel[];      

      this.markers = new Array<MarkerModel>();

      this.liMicroEmpresa.forEach(item => {

        let imarker = new MarkerModel();
        imarker.position = new PositionModel();

        imarker.title = item.Nombre;
        imarker.descripcion = item.Descripcion;
        imarker.position.lat = +item.Latitud;
        imarker.position.lng = +item.Longitud;

        this.markers.push(imarker);

      });

      this.renderMarkers();

    }

  }

  getGeo() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loadMap(13, resp.coords.latitude, resp.coords.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'ADS Publisher',
      subHeader: 'Filtros',
      message: 'Seleccione el filtro Categoría/Subcategoría',
      inputs: [
        {
          name: 'title',
          label:'Categorías',
          value: '-1',
          placeholder: 'Title',
        },
        {
          name: 'password',
          placeholder: 'Password'
        },
      ],
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
              //this.SetPlan(IDPlan, ValorPlan, true);
          }
        }
      ]
    });

    await alert.present();
  }

  loadMap(zoom: number, lat: number, lng: number) {
    
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    // create LatLng object
    //const myLatLng = {lat: 4.658383846282959, lng: -74.09394073486328};
    const myLatLng = {lat, lng};
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom
    });    

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      //this.renderMarkers();
      mapEle.classList.add('show-map');
      //this.renderMarkers();

        this.markers = new Array<MarkerModel>();
        let imarker = new MarkerModel();

        imarker.position = new PositionModel();

        imarker.title = 'Mi ubicación';
        imarker.descripcion = 'Aquí estoy yo';
        imarker.position.lat = +lat;
        imarker.position.lng = +lng;
        imarker.icon = 'assets/images/location.png';

        this.markers.push(imarker);        

        this.renderMarkers();

        this.geoArea('Av Suba #28A - 68');

    });
  }

  geoArea(address: string) {
    
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
          var result = results[0]; // el primer resultado es el más relevante
          console.log('info-geo', result);
          
          console.log('Lat', result.geometry.location.lat);
          console.log('Lng', result.geometry.location.lng);

      } else {
         console.log('Google respondió:',status);
      }
    });
  }

  renderMarkers() {
    this.markers.forEach(marker => {
      this.addMarker(marker);
    });    

  }

  addMarker(marker: MarkerModel) {
    
    const contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">' + marker.title + '</h1>'+
      '<div id="bodyContent">'+
      '<p>'+
      marker.descripcion +
      '</p> '+
      '</div>' +
      '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    const mk = new google.maps.Marker({
      position: marker.position,
      map: this.map,
      icon: marker.icon,
      title: marker.title
    });

    mk.addListener('click', function() {
      infowindow.open(this.map, mk);
    });

    return mk;
  }

}
