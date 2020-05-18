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
import { MicroEmpresaModel } from '../../models/microempresa.model';
import { FilterModel } from 'src/app/models/filter.model';

@Injectable({
    providedIn: 'root'
  })
  export class MicroEmpresaService extends BaseService<MicroEmpresaModel, MasterModel> {
    private apiURL: string;
    token: string = null;
    iMicroEmpresa = new MicroEmpresaModel();

    constructor(protected http: HttpClient,
        private gservice: GeneralService,        
        private storage: Storage) {
          super(http, environment.apiGatewayURL);
          this.apiURL = environment.apiGatewayURL;

    }

    register(model: MicroEmpresaModel, token: string) {
      return new Promise(resolve => {
        
        this.post(APIENDPOINT.InsertMicroEmpresa, model, token)
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

    updatemicroempresa(model: MicroEmpresaModel, token: string) {
      
      return new Promise(resolve => {
        
        this.post(APIENDPOINT.UpdateMicroEmpresa, model, token)
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

    deletemicroempresa(IDMicroEmpresa: number, token: string) {
      
      return new Promise(resolve => {
        
        this.delete(APIENDPOINT.DeleteMicroEmpresa, IDMicroEmpresa, token)
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

    getInfoMicroEmpresa(_token: string, IDCliente: number) {

      return new Promise( resolve => {

        this.get(APIENDPOINT.getInfoMicroEmpresa + "?IDCliente=" + IDCliente, true, _token)
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

    getMicroEmpresa(_token: string, IDMicroEmpresa: number) {

      return new Promise( resolve => {

        this.get(APIENDPOINT.getMicroEmpresa + "?IDMicroEmpresa=" + IDMicroEmpresa, true, _token)
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
