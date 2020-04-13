import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../_base.service';
import { MasterModel } from 'src/app/models/master.model';
import { APIENDPOINT } from '../../config/configuration';
import { GeneralService } from '../general.service';
import { Storage } from '@ionic/storage';
import { PQRSModel } from '../../models/pqrs.model';

@Injectable({
    providedIn: 'root'
  })
  export class PQRSService extends BaseService<PQRSModel, MasterModel> {
    private apiURL: string;
    token: string = null;
    ipqrs = new PQRSModel();

    constructor(protected http: HttpClient,
        private gservice: GeneralService,        
        private storage: Storage) {
          super(http, environment.apiGatewayURL);
          this.apiURL = environment.apiGatewayURL;
    }

    register(model: PQRSModel, token: string) {
      return new Promise(resolve => {

        this.post(APIENDPOINT.Insertpqrs, model, token)
        .subscribe(response => {
          if (response.IsSuccess) {
            resolve(true);
          } else {
            console.log('Error Controlado', response.Message);
            resolve(false);
          }
        }, error => {
          console.log('Error PQRS', error.error);
          resolve(false);
        });
      });
    }

    updatePQRS(model: PQRSModel, token: string) {
      
      return new Promise(resolve => {
        
        this.post(APIENDPOINT.Updatepqrs, model, token)
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

    DeletePQRS(IDpqrs: number, token: string) {
      
      return new Promise(resolve => {
        
        this.delete(APIENDPOINT.Deletepqrs, IDpqrs, token)
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

    getInfopqrs(_token: string, IDCliente: number) {

      return new Promise( resolve => {
        this.get(APIENDPOINT.GetallpqrsByID + "?ID=" + IDCliente, true, _token)
          .subscribe(resp => {
            if (resp.IsSuccess) {
              resolve(resp.Data);
            } else {
              resolve(null);
              console.log('Mostrar alerta de error');
            }
          }, error => {
            resolve(null);
            console.log('Mostrar alerta de error');
            return null;
          });
      });
    }

    GetPQRS(_token: string, IDPQRS: number) {

      return new Promise( resolve => {

        this.get(APIENDPOINT.GetpqrsByID + "?ID=" + IDPQRS, true, _token)
          .subscribe(resp => {
            if (resp.IsSuccess) {
              resolve(resp.Data);
            } else {
              resolve(null);
              console.log('Mostrar alerta de error');
            }
          }, error => {
            resolve(null);
            console.log('Mostrar alerta de error');
            return null;
          });
      });
    }
  }