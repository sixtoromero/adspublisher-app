import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../_base.service';
import { ClientesModel } from 'src/app/models/clientes.model';
import { MasterModel } from 'src/app/models/master.model';
import { APIENDPOINT } from '../../config/configuration';
import { GeneralService } from '../general.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { debug } from 'util';
import { Storage } from '@ionic/storage';
import { FileModel } from 'src/app/models/file.model';
import { FileUploadAPIModel } from '../../models/fileuploadapi.model';

@Injectable({
    providedIn: 'root'
  })
  export class FileUploadService extends BaseService<FileUploadAPIModel, MasterModel> {
    private apiURL: string;
    token: string = null;
    iFile = new FileUploadAPIModel();

    constructor(protected http: HttpClient,
        public gservice: GeneralService,
        private storage: Storage){
                super(http, environment.apiGatewayURL);
                this.apiURL = environment.apiGatewayURL;
        }

        async subirImagen(file: FileUploadAPIModel, token: string) {
            
            console.log('modelo', file);

            return new Promise(resolve => {
              this.post(APIENDPOINT.fileUpload, file, token)
                .subscribe(response => {
                    if (response.IsSuccess) {
                    resolve(true);
                    } else {
                    console.log('Error Controlado', response.Message);
                    resolve(false);
                    }
                }, error => {
                    console.log('Error', error.error);
                    resolve(false);
                });
            });
            
          }
      
          async subirImagen_( img: string, IDCliente: string ) {
      
            // let filesUpload = new Array<FileModel>();
            // let file = new FileModel();
      
            this.apiURL = `${this._apiRoot}${APIENDPOINT.fileUpload}`;
      
            this.apiURL = `${this._apiRoot}${APIENDPOINT.fileUpload}`;
            console.log('URL', this.apiURL);
      
            //this.token = await this.gservice.getStorage('token');
            
            this.storage.get('token').then(token => {
      
      
      
              // console.log('TOKEN', token);
      
              // const options: FileUploadOptions = {
              //   fileKey: 'files',
              //   headers: {
              //     'x-token': token
              //   }
              // };
              
              // const fileTransfer: FileTransferObject = this.fileTransfer.create();
              
              // fileTransfer.upload(img, this.apiURL, options)
              //   .then(data => {
              //     console.log(data);
              //   }).catch(err => {
              //     console.log('Error en carga', err);
              //   });
            });
      
            // file.fileData = img;
            // file.fileExtension = 'jpg';
            // file.fileName = 'prueba';
      
            // filesUpload.push(file);
      
            // return new Promise(resolve => {
            //   this.saveMultipleFiles(APIENDPOINT.fileUpload, filesUpload)
            //   .subscribe(response => {
            //     if (response.IsSuccess) {
            //       resolve(true);
            //     } else {
            //       console.log('Error Controlado', response.Message);
            //       resolve(false);
            //     }
            //   }, error => {
            //     console.log('Error', error.error);
            //     resolve(false);
            //   });
            // });
          }
  }