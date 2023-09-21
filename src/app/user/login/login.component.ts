import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import {TokenStorageService} from '../../_services/token-storage.service';
import {ActivatedRoute, Router} from "@angular/router";
import {LoginVo} from "./LoginVo";
import {ToastService} from "../../_helpers/toast.service";
import {UserService} from "../../_services/user.service";
import {GoogleLoginProvider, SocialAuthService} from '@abacritt/angularx-social-login';
import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginVo: LoginVo = new LoginVo();
  return: string = '';
  authUrl: string;
  // notPhone: boolean = false;
  notEmail: boolean = false;
  notVisitor: boolean = false;
  // phoneShowing: boolean = false;
  // emailShowing: boolean = true;
  notGoogle: boolean = false;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
              private toastService: ToastService,
              private route: ActivatedRoute, private router: Router,
              private userService: UserService,
              private socialAuthService: SocialAuthService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.return = params['return'];
      let url = this.router.url;
      // this.notPhone = url.includes("notPhone");
      this.notEmail = url.includes("notEmail");
      this.notVisitor = url.includes("notVisitor");

      this.notGoogle = url.includes("notGoogle");

      if (!this.return) {
        this.return = '/select-role';
      }
      if (this.tokenStorage.getToken()) {
        this.router.navigateByUrl(this.return);
      } else {
        if (this.onlyVisitor()) {
          this.toVisitor();
        }
        if (!this.notGoogle) {
          this.googleListener();
        }
      }
    });
  }

  onlyVisitor() {
    return this.notEmail && this.notGoogle && !this.notVisitor;
  }

  toVisitor() {
    let guestUser = this.tokenStorage.getGuestUser();
    if (guestUser) {
      let loginVo1 = new LoginVo();
      loginVo1.userId = guestUser.id;
      this.authService.signInByVisitor(loginVo1).subscribe({
        next: jwtResponse => {
          if (jwtResponse.errcode == 0) {
            this.tokenStorage.saveSessionInfo(jwtResponse);
            this.router.navigateByUrl(this.return);
            console.log("Guest login successful", jwtResponse);
          } else if (jwtResponse.errcode == 1029) {
            this.toastService.showConfirmAlert("The current guest ID does not exist. Do you want to register a new guest ID?", () => this.signUpByVisitor());
          } else {
            this.toastService.showErrorToast(jwtResponse.errmsg);
          }
        },
        error: err => {
          this.toastService.showErrorToast("Server error, login failed");
        }
      });
    } else {
      this.signUpByVisitor();
    }
  }

  signUpByVisitor() {
    this.authService.signUpByVisitor().subscribe({
      next: jwtResponse => {
        if (jwtResponse.errcode == 0) {
          this.tokenStorage.saveSessionInfo(jwtResponse);
          this.tokenStorage.saveGuestUser(jwtResponse);
          this.router.navigateByUrl(this.return);
          // this.toastService.showSuccessToast("Guest registration successful");
        } else {
          this.toastService.showErrorToast(jwtResponse.errmsg);
        }
      },
      error: err => {
        this.toastService.showErrorToast("Server error, login failed");
      }
    });
  }

  // phoneLogin(): void {
  //   this.authService.signInByPhone(this.loginVo).subscribe({
  //     next: jwtResponse => {
  //       if (jwtResponse.errcode == 0) {
  //         console.log(jwtResponse);
  //         let jwtResponseList = jwtResponse.jwtResponseList;
  //         if (jwtResponseList.length > 1) {
  //           this.tokenStorage.saveSessionInfoList(jwtResponseList);
  //           this.router.navigate(['/select-account'], {
  //             queryParams: {
  //               return: this.return
  //             }
  //           });
  //         } else {
  //           let firstJwtResponse = jwtResponseList[0];
  //           this.tokenStorage.saveSessionInfo(firstJwtResponse);
  //           this.router.navigate([this.return]);
  //         }
  //       } else {
  //         this.toastService.showErrorToast(jwtResponse.errmsg);
  //       }
  //     },
  //     error: err => {
  //       this.toastService.showErrorToast("Server error, login failed");
  //     }
  //   });
  // }

  googleListener() {
    console.log("googleListener``````````")
    this.socialAuthService.authState.subscribe((user) => {
      let loginVo1 = new LoginVo();
      loginVo1.email = user.email;
      loginVo1.idToken = user.idToken;
      console.log("googleSignIn``````````");
      Swal.showLoading();
      this.authService.googleSignIn(loginVo1).subscribe({
        next: jwtResponse => {
          Swal.close();
          if (jwtResponse.errcode == 0) {
            console.log(jwtResponse);
            let jwtResponseList = jwtResponse.jwtResponseList;
            if (jwtResponseList.length > 1) {
              this.tokenStorage.saveSessionInfoList(jwtResponseList);
              this.router.navigate(['/select-account'], {
                queryParams: {
                  return: this.return
                }
              });
            } else {
              let firstJwtResponse = jwtResponseList[0];
              this.tokenStorage.saveSessionInfo(firstJwtResponse);
              this.router.navigateByUrl(this.return);
            }
          } else {
            this.toastService.showErrorToast(jwtResponse.errmsg);
          }
        }, error: err => {
          Swal.close();
          console.log(err)
        }
      });
    }, error => {
      Swal.close();
      console.log(error)
    });
  }

  emailLogin(): void {
    this.authService.signInByEmail(this.loginVo).subscribe({
      next: jwtResponse => {
        if (jwtResponse.errcode == 0) {
          console.log(jwtResponse);
          let jwtResponseList = jwtResponse.jwtResponseList;
          if (jwtResponseList.length > 1) {
            this.tokenStorage.saveSessionInfoList(jwtResponseList);
            this.router.navigate(['/select-account'], {
              queryParams: {
                return: this.return
              }
            });
          } else {
            let firstJwtResponse = jwtResponseList[0];
            this.tokenStorage.saveSessionInfo(firstJwtResponse);
            this.router.navigateByUrl(this.return);
          }
        } else {
          this.toastService.showErrorToast(jwtResponse.errmsg);
        }
      },
      error: err => {
        this.toastService.showErrorToast("Server error, login failed");
      }
    });
  }
}
