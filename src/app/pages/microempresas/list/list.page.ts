import { Component, OnInit } from '@angular/core';
import { MicroEmpresaModel } from '../../../models/microempresa.model';
import { GeneralService } from '../../../services/general.service';
import { Marker } from '../../../models/marker.model';
import { CreatePage } from '../create/create.page';
import { ModalController } from '@ionic/angular';

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
  
  map = null;
  markers: Marker[];

  constructor(public gservice: GeneralService,
              private modalCtrl: ModalController) { }

  async ngOnInit() {
    this.gservice.avatar = await this.gservice.getStorage('avatar');
  }

  async modalcreate() {
    const modal = await this.modalCtrl.create({
      component: CreatePage,
      componentProps: {
        title: 'Crear Referencia Personal',
        model: this.IDCliente
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

  }

  getInfoMicroEmpresa() {
    let marker: Marker;

    marker = {
        position: {
          lat: 4.658383846282959,
          lng: -74.09394073486328,
        },
        title: 'Parque Simón Bolivar'
      };

    this.markers.push(marker);

  }

  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    // create LatLng object
    const myLatLng = {lat: 4.658383846282959, lng: -74.09394073486328};
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      //this.renderMarkers();
      mapEle.classList.add('show-map');
      this.renderMarkers();
    });
  }

  renderMarkers() {
    this.markers.forEach(marker => {
      this.addMarker(marker);
    });
  }

  addMarker(marker: Marker){
    const mk = new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title
    });

    return mk;
  }

}
