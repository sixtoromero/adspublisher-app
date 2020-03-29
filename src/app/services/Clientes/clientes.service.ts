import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../_base.service';
import { ClientesModel } from 'src/app/models/clientes.model';
import { MasterModel } from 'src/app/models/master.model';
import { APIENDPOINT } from '../../config/configuration';

@Injectable({
    providedIn: 'root'
  })
  export class ClientesService extends BaseService<ClientesModel, MasterModel>  {

    //private unsubscribe$ = new Subject<void>();
    private apiURL: string;

    constructor(protected _http: HttpClient) {
      super(_http, environment.apiGatewayURL);
      this.apiURL = environment.apiGatewayURL;
    }

    getClientesByID(_token: string, IDCliente: number) {

      return new Promise( resolve => {
        
        this.get(APIENDPOINT.getClientesByID + "?IDCliente=" + IDCliente, true, _token)
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

    register(cli: ClientesModel) {
      return new Promise(resolve => {
        this.post(APIENDPOINT.Insert, cli)
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
  }