import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../_base.service';
import { ClientesModel } from 'src/app/models/clientes.model';
import { MasterModel } from 'src/app/models/master.model';
import { APIENDPOINT } from '../../config/configuration';

import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
  })
  export class ClientesService extends BaseService<ClientesModel, MasterModel>  {

    //private unsubscribe$ = new Subject<void>();
    private apiURL: string;
    token: string = null;

    constructor(protected http: HttpClient,
                private storage: Storage) {

      super(http, environment.apiGatewayURL);
      this.apiURL = environment.apiGatewayURL;

    }    

    login(email: string , password: string) {
      
      const cliente = new ClientesModel();
      
      cliente.Correo = email;
      cliente.Password = password;

      return new Promise(resolve => {
        this.post(APIENDPOINT.getLogin, cliente)
        .subscribe(response => {
          if (response.IsSuccess) {
            this.guardarToken(response.Data['Token']);
            //console.log('Respuesta', response);
            resolve(true);
          } else {
            console.log('Error Controlado', response.Message);
            this.token = null;
            this.storage.clear();
            resolve(false);

          }
        }, error => {
          console.log('Error', error.error);
          this.token = null;
          this.storage.clear();
          resolve(false);
        });
      });
    }

    async guardarToken(token: string) {
      this.token = token;
      await this.storage.set('token', token);
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