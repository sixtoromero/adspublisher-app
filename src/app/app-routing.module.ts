import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'maps',
    loadChildren: () => import('./pages/maps/maps.module').then( m => m.MapsPageModule)
  },  
  {
    //path: 'createmicroempresa',
    path: 'list-microempresa',
    loadChildren: () => import('./pages/microempresas/list/list.module').then( m => m.ListPageModule)
  },  
  {
    //path: 'listmicroempresa',
    path: 'create-microempresa',
    loadChildren: () => import('./pages/microempresas/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'config',
    loadChildren: () => import('./pages/config/config.module').then( m => m.ConfigPageModule)
  },
  {
    path: 'createpqrs',
    loadChildren: () => import('./pages/pqrs/createpqrs/createpqrs.module').then( m => m.CreatepqrsPageModule)
  },
  {
    path: 'listpqrs',
    loadChildren: () => import('./pages/pqrs/listpqrs/listpqrs.module').then( m => m.ListpqrsPageModule)
  },
  {
    path: 'planes',
    loadChildren: () => import('./pages/planes/planes.module').then( m => m.PlanesPageModule)
  },
  {
    path: 'historialpagoslist',
    loadChildren: () => import('./pages/historialpagos/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'historialpagoscreate',
    loadChildren: () => import('./pages/historialpagos/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'logout',
    loadChildren: () => import('./pages/logout/logout.module').then( m => m.LogoutPageModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./pages/historialvisitas/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./pages/historialvisitas/list/list.module').then( m => m.ListPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
