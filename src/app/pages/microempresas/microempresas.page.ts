import { Component, OnInit } from '@angular/core';
import { MicroEmpresaModel } from '../../models/microempresa.model';

@Component({
  selector: 'app-microempresas',
  templateUrl: './microempresas.page.html',
  styleUrls: ['./microempresas.page.scss'],
})
export class MicroempresasPage implements OnInit {

  iMicroempresa = new MicroEmpresaModel();
  
  constructor() { }

  ngOnInit() {
  }

  async registro(freg: NgForm) {
    
  }

}
