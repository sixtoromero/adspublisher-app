import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatepqrsPageRoutingModule } from './createpqrs-routing.module';

import { CreatepqrsPage } from './createpqrs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatepqrsPageRoutingModule
  ],
  declarations: [CreatepqrsPage]
})
export class CreatepqrsPageModule {}
