import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListpqrsPage } from './listpqrs.page';

const routes: Routes = [
  {
    path: '',
    component: ListpqrsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListpqrsPageRoutingModule {}
