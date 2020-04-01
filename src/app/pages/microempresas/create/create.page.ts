import { Component, OnInit } from '@angular/core';
import { MicroEmpresaModel } from '../../../models/microempresa.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  iMicroempresa = new MicroEmpresaModel();

  constructor() { }

  ngOnInit() {
  }

  async registro(freg: NgForm) {    
  }

}
