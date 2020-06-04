import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuModel } from 'src/app/models/menu.model';
import { DataService } from '../../services/data/data.service';
import { GeneralService } from '../../services/general.service';
import { ClientesModel } from 'src/app/models/clientes.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  menuOpts: Observable<MenuModel[]>;
  cliente:ClientesModel;

  constructor(public service: GeneralService) { }

  async ngOnInit() {
    this.menuOpts = this.service.getMenuOpts();
    this.service.getStorage('IsHideMenu').then(val => {
      this.service.IsHideMenu = val as boolean;
    }).catch(e => {
      console.warn(JSON.stringify(e));
    });
    this.service.getStorage('InfoCliente').then(model => {
      this.cliente = model as ClientesModel;
    }).catch(e => {
      console.warn(JSON.stringify(e));
    });
  }

}
