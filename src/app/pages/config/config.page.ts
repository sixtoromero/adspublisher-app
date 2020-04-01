import { Component, OnInit } from '@angular/core';
import { ClientesModel } from '../../models/clientes.model';
import { GeneralService } from '../../services/general.service';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

declare var window: any;

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  
  iCliente = new ClientesModel();
  position: boolean;
  

  constructor(public gservice: GeneralService,
              private modalCtrl: ModalController,
              private camera: Camera) {
  }

  async ngOnInit() {
    console.log('RESULTADO:', this.gservice.avatar);
    if (!this.gservice.avatar) {
      this.gservice.avatar = await this.gservice.getStorage('avatar');
    }
  }

  getGeolocation(){
    if (!this.position) {
      
    }
    console.log(this.position);
  }

  async registro(freg: NgForm) {
    
  }

  Salir() {
    //this.modalCtrl.dismiss();
  }

  camara() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      const img = window.Ionic.WebView.convertFileSrc( imageData );
      console.log(img);

    }, (err) => {
     // Handle error
    });
  }

}
