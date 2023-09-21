import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
// import { RegisterComponent } from './user/register/register.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import {AppRoutingModule} from "./app-routing.module";
import {AuthGuardService} from "./_helpers/authGuard.service";
import { SelectAccountComponent } from './user/login/select-account/select-account.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import {ShareModule} from "./share/share.module";
import { PasswordRecoveryEmailComponent } from './user/login/password-recovery-email/password-recovery-email.component';
import {RegisterEmailComponent} from "./user/register-email/register-email.component";
import {GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from "@abacritt/angularx-social-login";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireMessagingModule} from "@angular/fire/compat/messaging";
import { NotifySwitchComponent } from './share/notify-switch/notify-switch.component';


@NgModule({
  declarations: [
    //common
    AppComponent,
    LoginComponent,
    SelectAccountComponent,
    SuperAdminComponent,
    RegisterEmailComponent,
    PasswordRecoveryEmailComponent
    //leader

    //member


  ],
  imports: [
    BrowserModule,
    // BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.enablePwa,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    // ShareModule,
    // ReactiveFormsModule,
    // QRCodeModule,
    // QuillModule.forRoot(),
    // ZXingScannerModule,
    // ScrollingModule
    SocialLoginModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
  ],
  providers: [authInterceptorProviders, AuthGuardService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              'xxxx.apps.googleusercontent.com',
              {
                oneTapEnabled: false
              }
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
  exports: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
