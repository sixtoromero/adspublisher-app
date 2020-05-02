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
import { FacturasModel } from '../../models/facturas.model';

@Injectable({
    providedIn: 'root'
  })
  export class FacturasService extends BaseService<FacturasModel, MasterModel> {
    private apiURL: string;
    token: string = null;
    ipqrs = new FacturasModel();

    constructor(protected http: HttpClient,
        private gservice: GeneralService,        
        private storage: Storage) {
          super(http, environment.apiGatewayURL);
          this.apiURL = environment.apiGatewayURL;
    }

    updateFactura(model: FacturasModel, token: string) {
      
      return new Promise(resolve => {
        
        this.post(APIENDPOINT.UpdateFactura, model, token)
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

    GetFacturasByCliente(token: string, IDCliente: number) {
        return new Promise( resolve => {
          this.get(APIENDPOINT.getFacturaByID + '?ID=' + IDCliente, true, token)
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

      GetFacturasByIDCliente(token: string, IDCliente: number) {
        return new Promise( resolve => {
          this.get(APIENDPOINT.getFacturaByIDCliente + '?ID=' + IDCliente, true, token)
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