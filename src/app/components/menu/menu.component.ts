import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuModel } from 'src/app/models/menu.model';
import { DataService } from '../../services/data/data.service';
import { GeneralService } from '../../services/general.service';
import { ClientesModel } from 'src/app/models/clientes.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  menuOpts: Observable<MenuModel[]>;
  cliente = new ClientesModel();

  constructor(public service: GeneralService) { }

  async ngOnInit() {

    if (!this.service.avatar) {
      this.service.avatar = await this.service.getStorage('avatar');
    }

    this.menuOpts = this.service.getMenuOpts();
    this.service.getStorage('IsHideMenu').then(val => {
      this.service.IsHideMenu = val as boolean;
    }).catch(e => {
      console.warn(JSON.stringify(e));
    });
    this.service.getStorage('InfoCliente').then(model => {

      this.cliente = model as ClientesModel;

      this.service.avatar = this.cliente.Foto;
      this.service.nombres = this.cliente.Nombres;
      this.service.apellidos = this.cliente.Apellidos;
      this.service.correo = this.cliente.Correo;

      // this.service.setStorage('nombres', this.cliente.Nombres);
      // this.service.setStorage('apellidos', this.cliente.Apellidos);
      // this.service.setStorage('correo', this.cliente.Correo);

      this.service.avatar = environment.imageURL + this.cliente.Foto;
      this.service.saveStorage('avatar', this.service.avatar);
    }).catch(e => {
      console.warn(JSON.stringify(e));
    });
  }

}
