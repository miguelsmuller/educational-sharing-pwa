import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//import { AngularFireAuthModule } from '@angular/fire/auth';
import { IonicModule } from '@ionic/angular';

import { RegistroPage } from './registro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    //AngularFireAuthModule,
    RouterModule.forChild([
      {
        path: '',
        component: RegistroPage
      }
    ])
  ],
  declarations: [RegistroPage]
})
export class RegistroPageModule {}
