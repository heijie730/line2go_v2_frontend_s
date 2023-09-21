import { Component, OnInit } from '@angular/core';
import { SignupVo } from "../../models/SignupVo";
import { AuthService } from "../../_services/auth.service";
import { TokenStorageService } from "../../_services/token-storage.service";
import { ToastService } from "../../_helpers/toast.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CodeTypeEnum } from "../../models/VerificationCodeVo";

@Component({
  selector: 'app-register-email',
  templateUrl: './register-email.component.html',
  styleUrls: ['./register-email.component.css']
})
export class RegisterEmailComponent implements OnInit {
  signupVo: SignupVo = new SignupVo();
  return: string = '';
  countDown: number = 0;
  countDownIntervalId: any = null;
  isSendingCode: boolean = false;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.return = params['return'];
      if (!this.return) {
        this.return = '/select-role';
      }
    });
    this.signupVo.codeType = CodeTypeEnum.REGISTRATION;
  }

  sendVerificationCode() {
    if (!this.signupVo.email) {
      this.toastService.showErrorToast("Email cannot be empty");
      return;
    }

    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.signupVo.email)) {
      this.toastService.showErrorToast("Please enter a valid email address");
      return;
    }

    this.isSendingCode = true;
    this.authService.sendEmailVerificationCode(this.signupVo).subscribe({
      next: jwtResponse => {
        console.log(jwtResponse);
        if (jwtResponse.errcode == 0) {
          this.toastService.showSuccessToast("Sent successfully");
          this.countDown = 60;
          this.countDownIntervalId = setInterval(() => {
            if (this.countDown > 0) {
              this.countDown--;
            } else {
              clearInterval(this.countDownIntervalId);
              this.isSendingCode = false;
            }
          }, 1000);
        } else {
          this.toastService.showErrorToast(jwtResponse.errmsg);
          this.isSendingCode = false;
        }
      },
      error: err => {
        this.toastService.showErrorToast("Failed to send verification code", "Server error");
        this.isSendingCode = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.signupVo.email) {
      this.toastService.showErrorToast("Email cannot be empty");
      return;
    }

    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.signupVo.email)) {
      this.toastService.showErrorToast("Please enter a valid email address");
      return;
    }

    if (!this.signupVo.password) {
      this.toastService.showErrorToast("Password cannot be empty");
      return;
    }

    if (!this.signupVo.confirmPassword) {
      this.toastService.showErrorToast("Confirm password cannot be empty");
      return;
    }

    if (this.signupVo.password != this.signupVo.confirmPassword) {
      this.toastService.showErrorToast("Passwords do not match");
      return;
    }

    if (!this.signupVo.verificationCode || this.signupVo.verificationCode.length != 4) {
      this.toastService.showErrorToast("Please enter a valid verification code");
      return;
    }

    this.authService.registerByEmail(this.signupVo).subscribe({
      next: jwtResponse => {
        console.log(jwtResponse);
        if (jwtResponse.errcode == 0) {
          this.tokenStorage.saveSessionInfo(jwtResponse);
          this.router.navigateByUrl(this.return);
          this.toastService.showSuccessToast("Registration successful");
        } else {
          this.toastService.showErrorToast(jwtResponse.errmsg);
        }
      },
      error: err => {
        this.toastService.showErrorToast("Registration failed", "Server error");
      }
    });
  }
}
