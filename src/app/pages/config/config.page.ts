import { Component, OnInit } from '@angular/core';
import { ClientesModel } from '../../models/clientes.model';
import { GeneralService } from '../../services/general.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
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
  token: string;
  image:any='';
  imageData:any='';

  constructor(public gservice: GeneralService,
              private service: ClientesService,
              private fileuservice: FileUploadService,
              private modalCtrl: ModalController,
              private loadinCtrl: LoadingController,
              private alertCtrl: AlertController,
              private transfer: FileTransfer,
              private camera: Camera) {
  }

  async ngOnInit() {

    if (!this.gservice.avatar) {
      this.gservice.avatar = await this.gservice.getStorage('avatar');
    }

    this.iCliente = await this.gservice.getStorage('InfoCliente') as ClientesModel;
    this.token = await this.gservice.getStorage('token');

  }

  getGeolocation() {
    if (!this.position) {
      
    }
    //console.log(this.position);
  }

  async updateinfocliente() {
    let loading = this.loadinCtrl.create({
      message: 'Por favor espere'
    });
    (await loading).present();
    
    const valid = await this.service.updateinfo(this.iCliente);
    
    (await loading).dismiss();

    if (valid === true) {
      this.showAlert('Actualización completada');
    } else {
      this.showAlert('Ha ocurrido un inconveniente por favor intente nuevamente.');
    }
  }

  async showAlert(message: string) {

    const alert = await this.alertCtrl.create({
      header: 'ADS Publisher',
      message,
      buttons: ['Aceptar']
    });

    await alert.present();
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
        // Ref:
        // https://github.com/bharathirajatut/ionic4/blob/master/camera-image-upload-example-php/home/home.page.ts
        // ---------
        this.imageData = imageData;
        this.image = (<any>window).Ionic.WebView.convertFileSrc(imageData);
        const fileTransfer: FileTransferObject = this.transfer.create();
        let options: FileUploadOptions = {
          fileKey: 'files',
          fileName: `profile-${Date.now()}.jpg`,
          headers: {}
        };
        fileTransfer.upload(this.imageData, "http://adspublisher.io.ngrok.io/api/Clientes/FileUpload", options)
          .then((data) => {
            // success
            alert("success");
          }, (err) => {
            this.showAlert("Hubo un problema al subir la foto al servidor: " + JSON.stringify(err));
        });
    }, (err) => {
      this.showAlert("Hubo un problema con la cámara: " + JSON.stringify(err));
    });
  }


}
