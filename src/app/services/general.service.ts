import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuModel } from 'src/app/models/menu.model';

import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
  })
  export class GeneralService {
    public alertCtrl = new AlertController();
    MenuOpts: MenuModel[] ;

    loading: any;
    avatar: string;

    IsHideMenu: boolean;

    token: string;

    nombres: string;
    apellidos: string;
    correo: string;

    constructor(protected http: HttpClient,
        private loadinCtrl: LoadingController,
        private storage: Storage) { }


    getMenuOpts() {
        return this.http.get<MenuModel[]>('/assets/data/menu.json');
    }

    async saveStorage(namne: string, token: any) {
      this.token = token;
      await this.storage.set(namne, token);
    }

    async getStorage(name: string){
      return await this.storage.get(name);
    }

    async setStorage(name: string, value: any) {
      return await this.storage.set(name, value);
    }

    async clearStorage(){
      await this.storage.clear();
    }

  }