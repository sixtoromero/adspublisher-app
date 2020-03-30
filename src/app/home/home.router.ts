import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'maps',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/maps/maps.module').then(m => m.MapsPageModule)
          }
        ]
      },
      {
        path: 'microempresas',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/microempresas/microempresas.module').then(
                m => m.MicroempresasPageModule
              )
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/notifications/notifications.module').then(
                m => m.NotificationsPageModule
              )
          }
        ]
      },
      {
        path: '',
        redirectTo: '/home/maps',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRouter {}
