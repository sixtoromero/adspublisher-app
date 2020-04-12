import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListpqrsPageRoutingModule } from './listpqrs-routing.module';

import { ListpqrsPage } from './listpqrs.page';
import { CreatepqrsPageModule } from '../createpqrs/createpqrs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListpqrsPageRoutingModule,
    CreatepqrsPageModule
  ],
  declarations: [ListpqrsPage]
})
export class ListpqrsPageModule {}
