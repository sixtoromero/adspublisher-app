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

  constructor(private service: GeneralService) { }

  ngOnInit() {
    this.menuOpts = this.service.getMenuOpts();
    this.service.IsHideMenu = false;
  }

}
