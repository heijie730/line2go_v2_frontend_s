import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserProfileComponent} from "./user-profile.component";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {UserProfileRoutingModule} from "./user-profile-routing.module";
import { BindEmailComponent } from './bind-email/bind-email.component';



@NgModule({
  declarations: [  UserProfileComponent,
    BindEmailComponent,],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    UserProfileRoutingModule
  ]
})
export class UserProfileModule { }
