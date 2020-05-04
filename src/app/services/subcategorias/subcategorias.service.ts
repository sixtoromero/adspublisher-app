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
import { SubCategoriasModel } from 'src/app/models/subcategorias.model';

@Injectable({
    providedIn: 'root'
  })
  export class SubCategoriasService extends BaseService<SubCategoriasModel, MasterModel> {
    private apiURL: string;
    token: string = null;
    //iplan = new PlanModel();
    liSubCategoria = new Array<SubCategoriasModel>();

    constructor(protected http: HttpClient,
        private gservice: GeneralService,
        private storage: Storage) {
          super(http, environment.apiGatewayURL);
          this.apiURL = environment.apiGatewayURL;
    }

    GetSubCategorias(token: string, ID: number) {      

      return new Promise( resolve => {
        this.get(APIENDPOINT.getSubCategorias + '?ID=' + ID, true, token)
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
