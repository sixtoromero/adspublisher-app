import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalfiltroPage } from './modalfiltro.page';

const routes: Routes = [
  {
    path: '',
    component: ModalfiltroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalfiltroPageRoutingModule {}
