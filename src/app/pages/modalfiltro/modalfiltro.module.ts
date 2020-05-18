import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalfiltroPageRoutingModule } from './modalfiltro-routing.module';

import { ModalfiltroPage } from './modalfiltro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalfiltroPageRoutingModule
  ],
  declarations: [ModalfiltroPage]
})
export class ModalfiltroPageModule {}
