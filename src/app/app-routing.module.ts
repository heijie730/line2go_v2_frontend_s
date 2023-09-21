import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
// import {RegisterComponent} from './user/register/register.component';
import {LoginComponent} from './user/login/login.component';

import {SelectAccountComponent} from "./user/login/select-account/select-account.component";
// import {PasswordRecoveryComponent} from "./user/login/password-recovery/password-recovery.component";
import {RegisterEmailComponent} from "./user/register-email/register-email.component";
import {
  PasswordRecoveryEmailComponent
} from "./user/login/password-recovery-email/password-recovery-email.component";

const routes: Routes = [
  //common
  {path: 'login', component: LoginComponent},
  {path: 'register-email', component: RegisterEmailComponent},
  {path: 'select-account', component: SelectAccountComponent},
  {path: 'password-recovery-email', component: PasswordRecoveryEmailComponent},
  //super-admin
  {path: 'super-admin',loadChildren: () => import('./super-admin/super-admin.module').then(m => m.SuperAdminModule)},
  //select-role
  {path: 'select-role',loadChildren: () => import('./user/select-role/select-role.module').then(m => m.SelectRoleModule)},
  //share
  {path: 'share',loadChildren: () => import('./share/share.module').then(m => m.ShareModule)},
  //service-requests
  {path: 'service-requests',loadChildren: () => import('./user/service-request/service-request.module').then(m => m.ServiceRequestModule)},
   //user-profile
  {path: 'user-profile',loadChildren: () => import('./user/user-profile/user-profile.module').then(m => m.UserProfileModule)},

  //advanced-options
  // {path: 'advanced-options',loadChildren: () => import('./user/advanced-options/advanced-options.module').then(m => m.AdvancedOptionsModule)},

  //leader
  {path: 'leader',loadChildren: () => import('./queue-owner/queue-owner.module').then(m => m.QueueOwnerModule)},

  //member
  {path: 'member',loadChildren: () => import('./member/member.module').then(m => m.MemberModule), data: { preload: true }},

  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
