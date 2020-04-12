import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatepqrsPage } from './createpqrs.page';

const routes: Routes = [
  {
    path: '',
    component: CreatepqrsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatepqrsPageRoutingModule {}
