import { Component, OnInit, Input, DebugElement } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Marker } from '../../../models/marker.model';
import { MicroEmpresaModel } from '../../../models/microempresa.model';

declare var google;

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  @Input() IDCliente;
  iMicroempresa = new MicroEmpresaModel();
  Nomenclatura: string;
  map = null;
  geocoder = new google.maps.Geocoder();

  marker: Marker;
  miputavariable: string;

  constructor() { }

  ngOnInit() {
    console.log('IDClientes en Crear', this.IDCliente);
    this.loadMap();
  }

  async registro(freg: NgForm) {
    
  }
  
  async getCoords() {
    //const location = await this.geocodeAddress(this.geocoder, this.map);
    
    this.geocodeAddress(this.geocoder, this.map).then(result => {
      console.log(result);
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
          
          console.log('Latitud', Latitud);
          console.log('Longitud', Longitud);
  
          resolve(Latitud.toString() + '|' + Longitud.toString());
  
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
