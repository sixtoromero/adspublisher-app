import { Component, OnInit, ViewChild } from '@angular/core';

import { HistorialRegistroModel } from 'src/app/models/historialregistro.model';
import { LoadingController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { HistorialVisitasService } from 'src/app/services/historialvisitas/historialvisitas.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  
  liHistorialVisitas = new Array<HistorialRegistroModel>();

  constructor(private loadinCtrl: LoadingController,
              private shistorial: HistorialVisitasService,
              private gservice: GeneralService) { }

  async ngOnInit() {
    
    let loading = this.loadinCtrl.create({
      message: 'Por favor espere...'
    });
    (await loading).present();

    let IDUsuario = await this.gservice.getStorage('IDUsuario');
    const token = await this.gservice.getStorage('token');

    const resp = await this.shistorial.GetHistorialByUsuario(token, IDUsuario);
    this.liHistorialVisitas = resp as HistorialRegistroModel[];

    (await loading).dismiss();

  }

  logRatingChange(rating: any){
    console.log('changed rating: ', rating);
  }

}
