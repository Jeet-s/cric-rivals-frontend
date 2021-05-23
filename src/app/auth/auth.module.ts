import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPage } from './auth.page';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, FlexLayoutModule],
  declarations: [AuthPage],
})
export class AuthPageModule {}
