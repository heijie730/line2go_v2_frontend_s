import { Component, OnInit } from '@angular/core';
import { UserVo } from "../../../models/UserVo";
import { SignupVo } from "../../../models/SignupVo";
import { TokenStorageService } from "../../../_services/token-storage.service";
import { UserService } from "../../../_services/user.service";
import { AuthService } from "../../../_services/auth.service";
import { Router } from "@angular/router";
import { ToastService } from "../../../_helpers/toast.service";
import {CodeTypeEnum} from "../../../models/VerificationCodeVo";

@Component({
  selector: 'app-bind-email',
  templateUrl: './bind-email.component.html',
  styleUrls: ['./bind-email.component.css']
})
export class BindEmailComponent implements OnInit {
  userVo: UserVo;
  email: string | undefined;
  signupVo: SignupVo = new SignupVo();
  countDown: number = 0;
  countDownIntervalId: any = null;
  isSendingCode: boolean = false;

  constructor(
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    let user = this.tokenStorage.getUser();
    this.email = user?.email;
    this.signupVo.codeType = CodeTypeEnum.BIND_EMAIL;
    this.userService.userInfo().subscribe({
      next: (userVo) => {
        this.userVo = userVo;
      },
      error: (err) => {
        this.toastService.showErrorToast("Server Error");
      }
    });
  }

  sendVerificationCode() {
    if (!this.signupVo.email) {
      this.toastService.showErrorToast("Email can't be empty");
      return;
    }
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.signupVo.email)) {
      this.toastService.showErrorToast("Please enter a valid email");
      return;
    }
    this.isSendingCode = true;
    this.authService.sendEmailVerificationCode(this.signupVo).subscribe({
      next: (jwtResponse) => {
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
      error: (err) => {
        this.toastService.showErrorToast("Failed to send verification code", "Server Error");
        this.isSendingCode = false;
      }
    });
  }

  bindEmail(): void {
    if (!this.signupVo.email) {
      this.toastService.showErrorToast("Email can't be empty");
      return;
    }
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.signupVo.email)) {
      this.toastService.showErrorToast("Please enter a valid email");
      return;
    }
    if (!this.signupVo.password) {
      this.toastService.showErrorToast("Password can't be empty");
      return;
    }
    if (!this.signupVo.confirmPassword) {
      this.toastService.showErrorToast("Confirm Password can't be empty");
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
    this.authService.bindEmail(this.signupVo).subscribe({
      next: (jwtResponse) => {
        console.log(jwtResponse);
        if (jwtResponse.errcode == 0) {
          this.tokenStorage.saveSessionInfo(jwtResponse);
          this.toastService.showSuccessToast("Bound successfully");
          this.router.navigate(['user-profile']);
        } else {
          this.toastService.showErrorToast(jwtResponse.errmsg);
        }
      },
      error: (err) => {
        this.toastService.showErrorToast("Binding failed", "Server Error");
      }
    });
  }

  emailNotifyOnSwitch(event: any) {
    let checked = event.target.checked;
    this.userVo.emailNotify = checked;
    this.userService.updateEmailNotify(this.userVo).subscribe((data) => {
      if (data.errcode == 0) {
        if (checked) {
          this.toastService.showSuccessToast("Enabled");
        } else {
          this.toastService.showSuccessToast("Disabled");
        }
      }
    });
  }
}
