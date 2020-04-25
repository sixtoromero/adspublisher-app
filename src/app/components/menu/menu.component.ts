import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuModel } from 'src/app/models/menu.model';
import { DataService } from '../../services/data/data.service';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  menuOpts: Observable<MenuModel[]>;

  constructor(public service: GeneralService) { }

  async ngOnInit() {
    
    this.menuOpts = this.service.getMenuOpts();
    const IsHideMenu = await this.service.getStorage('IsHideMenu');
    this.service.IsHideMenu = IsHideMenu;
  }

}
