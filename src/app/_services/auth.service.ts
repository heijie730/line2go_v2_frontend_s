import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";
import {JwtResponse} from "../models/JwtResponse";
import {map} from "rxjs/operators";
import {TicketVo} from "../models/TicketVo";
import {LoginVo} from "../user/login/LoginVo";
import {SignupVo} from "../models/SignupVo";
import {TokenStorageService} from "./token-storage.service";
import {TokenRefreshVo} from "../models/TokenRefreshVo";
import {Router} from "@angular/router";
import {Result} from "../models/Result";
import {ToastService} from "../_helpers/toast.service";
// const AUTH_API = 'http://localhost:8080/api/auth/';
const AUTH_API = environment.backendAddress + 'api/auth/';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient,
              private tokenService: TokenStorageService,
              private toastService: ToastService,
              private router: Router) {
  }


  // login(loginVo: LoginVo): Observable<JwtResponse> {
  //   return this.http.post(AUTH_API + 'sign-in', loginVo, httpOptions)
  //     .pipe(map(data => new JwtResponse().deserialize(data)));
  // }

  // signInByPhone(loginVo: LoginVo): Observable<JwtResponse> {
  //   return this.http.post(AUTH_API + 'sign-in-by-phone', loginVo, httpOptions)
  //     .pipe(map(data => new JwtResponse().deserialize(data)));
  // }

  signInByEmail(loginVo: LoginVo): Observable<JwtResponse> {
    return this.http.post(AUTH_API + 'sign-in-by-email', loginVo, httpOptions)
      .pipe(map(data => new JwtResponse().deserialize(data)));
  }

  signInByVisitor(loginVo: LoginVo): Observable<JwtResponse> {
    return this.http.post(AUTH_API + 'sign-in-by-visitor', loginVo, httpOptions)
      .pipe(map(data => new JwtResponse().deserialize(data)));
  }

  signUpByVisitor(): Observable<JwtResponse> {
    return this.http.post(AUTH_API + 'sign-up-by-visitor', null, httpOptions)
      .pipe(map(data => new JwtResponse().deserialize(data)));
  }

  googleSignIn(loginVo: LoginVo): Observable<JwtResponse> {
      return this.http.post(AUTH_API + 'google-sign-in', loginVo, httpOptions)
          .pipe(map(data => new JwtResponse().deserialize(data)));
  }

  // bindPhone(signupVo: SignupVo): Observable<JwtResponse> {
  //   return this.http.post(AUTH_API + 'bind-phone', signupVo, httpOptions)
  //     .pipe(map(data => new JwtResponse().deserialize(data)));
  // }

  bindEmail(signupVo: SignupVo): Observable<JwtResponse> {
    return this.http.post(AUTH_API + 'bind-email', signupVo, httpOptions)
      .pipe(map(data => new JwtResponse().deserialize(data)));
  }

  // passwordRecovery(signupVo: SignupVo): Observable<JwtResponse> {
  //   return this.http.post(AUTH_API + 'password-recovery', signupVo, httpOptions)
  //     .pipe(map(data => new JwtResponse().deserialize(data)));
  // }

  passwordRecoveryEmail(signupVo: SignupVo): Observable<JwtResponse> {
    return this.http.post(AUTH_API + 'password-recovery-email', signupVo, httpOptions)
      .pipe(map(data => new JwtResponse().deserialize(data)));
  }

  // registerByPhone(signupVo: SignupVo): Observable<JwtResponse> {
  //   return this.http.post(AUTH_API + 'sign-up-by-phone', signupVo, httpOptions)
  //     .pipe(map(data => new JwtResponse().deserialize(data)));
  // }

  registerByEmail(signupVo: SignupVo): Observable<JwtResponse> {
    return this.http.post(AUTH_API + 'sign-up-by-email', signupVo, httpOptions)
      .pipe(map(data => new JwtResponse().deserialize(data)));
  }

  // sendVerificationCode(signupVo: SignupVo): Observable<JwtResponse> {
  //   return this.http.post(AUTH_API + 'send-verification-code', signupVo, httpOptions)
  //     .pipe(map(data => new JwtResponse().deserialize(data)));
  // }

  sendEmailVerificationCode(signupVo: SignupVo): Observable<JwtResponse> {
    return this.http.post(AUTH_API + 'send-email-verification-code', signupVo, httpOptions)
      .pipe(map(data => new JwtResponse().deserialize(data)));
  }

  // register(signupVo: SignupVo): Observable<JwtResponse> {
  //   return this.http.post(AUTH_API + 'sign-up', signupVo, httpOptions)
  //     .pipe(map(data => new JwtResponse().deserialize(data)));
  // }

  // signOut(): Observable<Result> {
  //   return this.http.post(AUTH_API + 'sign-out', {}, httpOptions)
  //     .pipe(map(data => new Result().deserialize(data)));
  // }

  manualRefreshToken(successCallback?: () => void) {
    const refreshToken = this.tokenService.getRefreshToken();
    if (refreshToken) {
      let refreshVo = new TokenRefreshVo();
      refreshVo.refreshToken = refreshToken;
      this.refreshToken(refreshVo)
        // this.http.post(AUTH_API + 'refresh-token', refreshVo, httpOptions)
        //     .pipe(map(data => new JwtResponse().deserialize(data)))
        .subscribe({
          next: jwtResponse => {
            if (jwtResponse.errcode == 0) {
              this.tokenService.saveSessionInfo(jwtResponse);
              console.log("manualRefreshToken success", jwtResponse)
              // window.location.reload();
              if (successCallback) {
                successCallback();
              }
            } else {
              this.toastService.showErrorToast(jwtResponse.errmsg);
            }
          },
          error: err => {
            console.log(err);
            this.toastService.showErrorToast(err.error.errmsg);
          }
        });
    } else {
      this.tokenService.signOut();
      this.router.navigate(['/login'], {
        queryParams: {
          return: this.router.url
        }
      });
    }
  }


  //用于access token过期后刷新
  refreshToken(refreshVo: TokenRefreshVo) {
    return this.http.post(AUTH_API + 'refresh-token', refreshVo, httpOptions)
      .pipe(map(data => new JwtResponse().deserialize(data)));
  }
}
