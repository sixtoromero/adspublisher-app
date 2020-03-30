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
import { MenuModel } from '../../models/menu.model';

@Injectable({
    providedIn: 'root'
  })
  export class DataService extends BaseService<MenuModel, MasterModel> {
    
    constructor(protected http: HttpClient) {
        super(http, environment.apiGatewayURL);
    }

    getMenuOpts() {
        return this.http.get<MenuModel[]>('/assets/data/menu.json');
    }

  }