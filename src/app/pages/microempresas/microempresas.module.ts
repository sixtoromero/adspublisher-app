import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MicroempresasPageRoutingModule } from './microempresas-routing.module';

import { MicroempresasPage } from './microempresas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MicroempresasPageRoutingModule
  ],
  declarations: [MicroempresasPage]
})
export class MicroempresasPageModule {}
