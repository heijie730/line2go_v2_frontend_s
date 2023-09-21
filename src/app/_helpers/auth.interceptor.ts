import {HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {TokenStorageService} from '../_services/token-storage.service';
import {BehaviorSubject, delay, Observable, of, retry, retryWhen, switchMapTo, throwError} from 'rxjs';
import {AuthService} from "../_services/auth.service";

const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {Router} from "@angular/router";
import {TokenRefreshVo} from "../models/TokenRefreshVo";
import {ToastService} from "./toast.service";
import {QueueService} from "../_services/queue.service";
import {JwtResponse} from "../models/JwtResponse";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(private tokenService: TokenStorageService,
              private toastService: ToastService,
              private router: Router,
              private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.tokenService.getToken();
    // console.log("intercept token", token);
    if (token != null) {
      // authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
      authReq = this.addTokenHeader(req, token);
    }
    // return next.handle(authReq);

    return next.handle(authReq).pipe(catchError(error => {
      // console.log("进入intercept")

      if (error instanceof HttpErrorResponse) {
        // console.log(error.status);
        if (error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        if (error.status === 500) {
          return this.handle500Error(authReq, next);
        }
      }
      return throwError(error);
    }));
  }

  private handle500Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(
      retryWhen((errors) => errors.pipe(delay(1000), take(3))),
      catchError((error) => throwError(error))
    );
  }

  // private retryRequest(request: HttpRequest<any>, next: HttpHandler, retryCount: number = 3): Observable<HttpEvent<any>> {
  //   return next.handle(request).pipe(
  //     retry(retryCount),
  //     catchError((error: HttpErrorResponse) => {
  //       // If retry failed, throw the error to be handled by the caller
  //       console.log("retry failed",error)
  //       return throwError(error);
  //     })
  //   );
  // }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.tokenService.getRefreshToken();

      if (refreshToken) {
        let refreshVo = new TokenRefreshVo();
        refreshVo.refreshToken = refreshToken;
        return this.authService.refreshToken(refreshVo).pipe(
          switchMap((jwtResponse: JwtResponse) => {
            this.isRefreshing = false;

            // this.tokenService.saveToken(token.accessToken);
            this.tokenService.saveSessionInfo(jwtResponse);
            this.refreshTokenSubject.next(jwtResponse.accessToken);

            return next.handle(this.addTokenHeader(request, jwtResponse.accessToken));
          }),
          catchError((err) => {
            console.log(err.error)
            //如果服务端抛出异常，会触发这里。
            this.isRefreshing = false;
            if (err.error&&err.error.errcode==1001){
              this.tokenService.signOut();
              this.router.navigate(['/login'], {
                queryParams: {
                  return: this.router.url
                }
              });
            }
            // localStorage.setItem('redirectTo', this.router.url);
            // this.router.navigate(['/login']);
            return throwError(err);
          })
        );
      } else {
        // localStorage.setItem('redirectTo', this.router.url);
        // this.router.navigate(['/login']);
        this.router.navigate(['/login'], {
          queryParams: {
            return: this.router.url
          }
        });
      }

    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Spring Boot back-end */
    return request.clone({headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)});

    /* for Node.js Express back-end */
    // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
  }
}

export const authInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];
