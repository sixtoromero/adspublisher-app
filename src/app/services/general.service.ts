import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuModel } from 'src/app/models/menu.model';

@Injectable({
    providedIn: 'root'
  })
  export class GeneralService {
    public alertCtrl = new AlertController();
    MenuOpts: MenuModel[] ;

    loading: any;

    IsHideMenu: boolean;

    token: string;

    constructor(protected http: HttpClient,
        private loadinCtrl: LoadingController) { }


    getMenuOpts() {
        return this.http.get<MenuModel[]>('/assets/data/menu.json');
    }


  }