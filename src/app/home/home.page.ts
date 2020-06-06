import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  Invitado: boolean;

  constructor(private menuCtrl: MenuController, private gservice: GeneralService) { }

  

  async ngOnInit() {
    //this.gservice.setStorage('Invitado', true);
    
    this.Invitado = await this.gservice.getStorage('Invitado');

  }

  toggleMenu() {
    if(!this.Invitado) {
      this.menuCtrl.toggle();
    }
  }

}
