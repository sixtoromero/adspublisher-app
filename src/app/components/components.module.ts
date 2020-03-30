import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SlidesComponent } from './slides/slides.component';
import { StartButtonComponent } from './start-button/start-button.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SlidesComponent, 
    StartButtonComponent,
    MenuComponent
  ],
  exports: [
    SlidesComponent, 
    StartButtonComponent, 
    MenuComponent
  ],
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule,
    RouterModule
  ]
})
export class ComponentsModule { }