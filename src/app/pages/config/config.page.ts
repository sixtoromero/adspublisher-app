import { Component, OnInit } from '@angular/core';
import { ClientesModel } from '../../models/clientes.model';
import { GeneralService } from '../../services/general.service';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ClientesService } from '../../services/Clientes/clientes.service';
import { FileUploadService } from '../../services/FileUpload/fileupload.service';
import { FileUploadAPIModel } from '../../models/fileuploadapi.model';

declare var window: any;

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  
  iCliente = new ClientesModel();
  position: boolean;
  image: string;
  token: string;
  

  constructor(public gservice: GeneralService,
              private service: ClientesService,
              private fileuservice: FileUploadService,
              private modalCtrl: ModalController,
              private camera: Camera) {
  }

  async ngOnInit() {
    console.log('RESULTADO:', this.gservice.avatar);
    if (!this.gservice.avatar) {
      this.gservice.avatar = await this.gservice.getStorage('avatar');
      this.iCliente = await this.gservice.getStorage('InfoCliente') as ClientesModel;
    }
1
    this.token = await this.gservice.getStorage('token');
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
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    this.procesarImagen(options);
  }

  libreria() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
      //sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
  }

  async procesarImagen(options: CameraOptions) {
    
    this.camera.getPicture(options)
      .then((imageData) => {
        this.image = 'data:image/jpeg;base64,' + imageData;
        let fileupload = new FileUploadAPIModel();
        fileupload.FileBase64 = this.image;
        this.gservice.avatar = this.image;
        console.log('IMAGEN', fileupload.FileBase64);
        this.fileuservice.subirImagen(fileupload, this.token )
              .then(resp => {
                console.log(resp);
              }).catch(err  => {
                console.log('PUTO ERROR', err);
              });
    }, (err) => {
     // Handle error
    });

    // this.camera.getPicture(options).then((imageData) => {
    //   // imageData is either a base64 encoded string or a file URI
    //   // If it's base64 (DATA_URL):
    //   const img = window.Ionic.WebView.convertFileSrc( imageData );
    //   let resp = this.service.subirImagen(imageData);
    //   //console.log(img);

    // }, (err) => {
    //  // Handle error
    // });
  }


}
