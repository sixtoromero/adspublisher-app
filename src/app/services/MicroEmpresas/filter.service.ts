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
  export class FilterService extends BaseService<FilterModel, MasterModel> {
    private apiURL: string;
    token: string = null;
    liMicroEmpresa = new Array<MicroEmpresaModel>();

    constructor(protected http: HttpClient,
        private gservice: GeneralService,
        private storage: Storage) {
          super(http, environment.apiGatewayURL);
          this.apiURL = environment.apiGatewayURL;

    }

    getFilter(model: FilterModel, token: string) {
        return new Promise(resolve => {

          this.post(APIENDPOINT.getFilterMicroEmpresa, model, token)
          .subscribe(response => {
            if (response.IsSuccess) {
              resolve(response.Data);
            } else {
              console.log('Error Controlado', response.Message);
              resolve(null);
            }
          }, error => {
            console.log('Error', error.error);
            resolve(null);
          });
        });
    }


  }