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
import { ParametrosModel } from '../../models/parametros.model';


@Injectable({
    providedIn: 'root'
  })
  export class ParametrosService extends BaseService<ParametrosModel, MasterModel> {
    private apiURL: string;
    token: string = null;
    iParametros = new ParametrosModel();

    constructor(protected http: HttpClient,
        private gservice: GeneralService,
        private storage: Storage) {
          super(http, environment.apiGatewayURL);
          this.apiURL = environment.apiGatewayURL;
    }

    register(model: ParametrosModel, token: string) {
      return new Promise(resolve => {
        
        this.post(APIENDPOINT.InsertParametros, model, token)
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

    updateParametros(model: ParametrosModel, token: string) {
      
      return new Promise(resolve => {
        
        this.post(APIENDPOINT.UpdateParametros, model, token)
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

    DeleteParametros(IDParametros: number, token: string) {
      
      return new Promise(resolve => {
        
        this.delete(APIENDPOINT.DeleteParametros, IDParametros, token)
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

    getInfoParametros(_token: string, ID: number) {

      return new Promise( resolve => {

        this.get(APIENDPOINT.GetallParametrosByID + "?ID=" + ID, true, _token)
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

    GetParametros(_token: string, ID: number) {

      return new Promise( resolve => {

        this.get(APIENDPOINT.GetParametrosByID + "?ID=" + ID, true, _token)
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