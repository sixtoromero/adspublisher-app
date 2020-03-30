import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MicroempresasPage } from './microempresas.page';

const routes: Routes = [
  {
    path: '',
    component: MicroempresasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MicroempresasPageRoutingModule {}
