import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ContentChild, TemplateRef } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { FilterPage } from './filter/filter.page';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { MicroEmpresaModel } from '../../models/microempresa.model';
import { MarkerModel } from 'src/app/models/marker.model';
import { PositionModel } from 'src/app/models/position.model';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeocodeModel } from 'src/app/models/geocode.model';
import { RouteModel } from 'src/app/models/route.model';

declare var google;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {

  @ViewChild("map", { read: ElementRef, static: true  }) private mapElement: ElementRef;
  
  readonly WalkMode: number = 1;
  readonly CarMode: number = 2;

  map = null;
  mapRouteRenderer = null;
  markerInfoWindow = null;
  filtro: string;
  liMicroEmpresa = new Array<MicroEmpresaModel>();
  markers: MarkerModel[];
  routeInitFlag: boolean = true;
  currentLat: number;
  currentLng: number;
  targetLat: number;
  targetLng: number;
  
  constructor(gservice: GeneralService,
              private toastController: ToastController,
              private modalCtrl: ModalController,
              private geolocation: Geolocation,
              public alertCtrl: AlertController) { }
  
  ngOnInit(): void {
    this.filtro = 'filtro';
    this.getGeo();
    // Initializer Route components
    this.mapElement.nativeElement.addEventListener('click', () => {
      console.log("click - mapElement");
      var walkElement = document.getElementById("walk");
      var carElement = document.getElementById("car");
      console.log(walkElement);
      console.log(carElement);
      if (this.routeInitFlag && 
        walkElement !== undefined && walkElement !== null && 
        carElement !== undefined && carElement !== null) {
          this.routeInitFlag = false;
          walkElement.addEventListener('click', () => this.drawRoute(this.WalkMode));
          carElement.addEventListener('click', () => this.drawRoute(this.CarMode));   
      }
    });
  }

  //Método para pintar los marcadores según el filtro realizado por el usuario
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

  //Me permite capturar mi posición actual
  getGeo() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLat = resp.coords.latitude;
      this.currentLng =  resp.coords.longitude;
      this.loadMap(13, this.currentLat, this.currentLng);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  //Para presentar en la pantalla un alerta con opciones de Cancelar y Aceptar
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
    // Suba: 4.731198, -74.071963
    // Teusaquillo: 4.65838384628295, -74.09394073486328
    const myLatLng = {lat, lng};
    // create map
    this.map = new google.maps.Map(mapEle, { center: myLatLng, zoom });
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
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
        this.validateLocationAsToZone(lat, lng);
    });
  }
  
  geoArea(address: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
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

  //Se valida que la posición actual corresponda a localidad de suba.
  validateLocationAsToZone(lat: number, lng: number) {
    // Example:
    // https://maps.googleapis.com/maps/api/geocode/json?latlng=4.6775432,-74.1747025&key=AIzaSyArnxRnjhaHA94pbIuL_mjP-fZKBL0MD2E
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': {lat: lat, lng: lng}}, (results: GeocodeModel[], status: string) => {
      if (status === 'OK') {
        var isLocationValid = false;
        for (let r of results) {
          for (let address of r.address_components) {
            let lname = address.long_name.toLowerCase();
            if (lname.indexOf("suba") !== -1) {
              isLocationValid = true;
            }
          }
        }
        if (!isLocationValid) {
          this.showToastMessage('ADSPublisher', 'Usted no se encuentra en la zona de Suba');
        }
      } else {
        this.showToastMessage('ADSPublisher', 'Hubo un problema para detectar su localizacion: ' + status);
      }
    });
  }
  //Rendereizar el array de los marcadores a agregar en el mapa.
  renderMarkers() {
    this.markers.forEach(marker => {
      this.addMarker(marker);
    });    
  }

  //Método para pintar los marcadores modal
  buildDefaultMarker(title: string, message: string) {
    return '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">' + title + '</h1>'+
        '<div id="bodyContent">'+
          '<p>'+
          message +
          '</p> '+
        '</div>' +
      '</div>';
  }

  //Método para pintar los marcadores modal
  buildRouteMarker(title: string, message: string) {
    return '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">' + title + '</h1>'+
      '<div id="bodyContent">'+
        '<p>'+
        message +
        '</p> '+
        '<div class="maps-marker">'+
          '<b>¿Cómo llegar desde aquí?</b>'+
          '<div style="padding: 10px; display:flex; justify-content: space-between">' +
            '<div id="walk" #walk tappable style="width:45%; height:50px; background:#A89932; text-align:center">' +
              '<i style="margin-top: 20px" class="fas fa-walking"></i></div>'+
            '<div id="car" #car tappable style="width:45%; height:50px; background:#A89D54; text-align:center">' +
              '<i style="margin-top: 20px" class="fas fa-car"></i></div>'+
          '</div>'+
        '</div>' +
      '</div>' +
    '</div>';
  }

  //Agrega el marcardor en el mapa 
  addMarker(marker: MarkerModel) {
    
    const contentString = marker.title.toLowerCase().indexOf("ubica") !== -1 ? 
      this.buildDefaultMarker(marker.title, marker.descripcion) :
      this.buildRouteMarker(marker.title, marker.descripcion);

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    const mk = new google.maps.Marker({
      position: marker.position,
      map: this.map,
      icon: marker.icon,
      title: marker.title
    });

    mk.addListener('click', () => {
      if (this.markerInfoWindow) {
        this.markerInfoWindow.close();
      }
      infowindow.open(this.map, mk);
      this.markerInfoWindow = infowindow;
      this.targetLat = mk.position.lat();
      this.targetLng = mk.position.lng();
    });
    infowindow.addListener('closeclick', () => {
      this.routeInitFlag = true;
    });

   return mk;
  }

  // === ROUTES ===

  clearRoutes() {
    if (this.mapRouteRenderer != null) {
      this.mapRouteRenderer.setMap(null);
      this.mapRouteRenderer = null;
    }
  }

  drawRoute(mode: number) {
    this.clearRoutes();
    let ds = new google.maps.DirectionsService();
    this.mapRouteRenderer = new google.maps.DirectionsRenderer();
    this.mapRouteRenderer.setMap(this.map);
    let toastTitle = mode == this.WalkMode ? 'Caminando' : 'Vehículo' ;
    //console.log(`${this.currentLat},${this.currentLng}`);
    //console.log(`${this.targetLat},${this.targetLng}`);
    ds.route({
      origin:`${this.currentLat},${this.currentLng}`,
      destination:`${this.targetLat},${this.targetLng}`,
      travelMode: mode == this.WalkMode ? google.maps.TravelMode.WALKING : google.maps.TravelMode.DRIVING
    }, async (result, status) => {
      console.log(result);
      if (status == google.maps.DirectionsStatus.OK) {
        var routeText = '';
        let route = result as RouteModel;
        for (let it of route.routes) {
          for (let leg of it.legs) {
            routeText += `Distancia: ${leg.distance.text}\nTiempo: ${leg.duration.text}\n`;
          }  
        }
        this.mapRouteRenderer.setDirections(result);
        await this.showToastMessage(`RUTA (${toastTitle})`, routeText);
      } else {
        window.alert(`No se pudo calcular la ruta`);
      }
    });
  }

  async showToastMessage(title:string, text:string) {
    const toast = await this.toastController.create({
      header: title,
      message: text,
      position: 'top',
      buttons: [
         {
          text: 'OK',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    toast.present();
  }


}
