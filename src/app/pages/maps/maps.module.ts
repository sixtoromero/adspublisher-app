import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapsPageRoutingModule } from './maps-routing.module';

import { MapsPage } from './maps.page';
import { FilterPage } from './filter/filter.page';
import { FilterPageModule } from './filter/filter.module';

@NgModule({
  entryComponents: [
    FilterPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapsPageRoutingModule,
    FilterPageModule
  ],
  declarations: [MapsPage]
})
export class MapsPageModule {}
