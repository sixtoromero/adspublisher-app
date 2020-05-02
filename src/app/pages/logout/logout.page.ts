import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private loadinCtrl: LoadingController, private gservice: GeneralService, private router: Router) { }

  async ngOnInit() {
    
    let loading = this.loadinCtrl.create({
      message: 'Cerrando sesión, un momento por favor'
    });
    (await loading).present();
    this.gservice.clearStorage();
    (await loading).dismiss();

    this.router.navigate(['/login']);


  }

}
