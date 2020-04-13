import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { BaseService } from '../_base.service';
import { MasterModel } from '../../models/master.model';
import { ResponseModel } from '../../models/response.model';
import { APIENDPOINT } from '../../config/configuration';
import { DescriptionDynamicModel } from '../../models/descriptiondynamic.model';
import { GeneralService } from '../general.service';

@Injectable({
  providedIn: 'root'
})
export class DescriptiondynamicService extends BaseService<DescriptionDynamicModel, MasterModel> {

  private apiURL: string;

  constructor(protected _http: HttpClient, uiServices: GeneralService) {
    super(_http, environment.apiGatewayURL);
    this.apiURL = environment.apiGatewayURL;
  }

  GetDescriptionDyn(iDynamic: DescriptionDynamicModel, token: string) {

    return new Promise(resolve => {        
      this.post(APIENDPOINT.getDescription, iDynamic, token)
      .subscribe(response => {
        if (response.IsSuccess) {
          resolve(response);
        } else {
          console.log('Error Controlado', response.Message);
          resolve(response);
        }
      }, error => {
        console.log('Error', error.error);
        resolve(null);
      });
    });
  }
}
