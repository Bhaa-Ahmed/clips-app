import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [AuthModalComponent, RegisterComponent, LoginComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule],
  exports: [AuthModalComponent],
})
export class UserModule {}
