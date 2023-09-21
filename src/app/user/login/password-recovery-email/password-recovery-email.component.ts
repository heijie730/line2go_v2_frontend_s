import { Component, OnInit } from '@angular/core';
import { SignupVo } from "../../../models/SignupVo";
import { AuthService } from "../../../_services/auth.service";
import { TokenStorageService } from "../../../_services/token-storage.service";
import { ToastService } from "../../../_helpers/toast.service";
import { ActivatedRoute, Router } from "@angular/router";
import {CodeTypeEnum} from "../../../models/VerificationCodeVo";

@Component({
  selector: 'app-password-recovery-email',
  templateUrl: './password-recovery-email.component.html',
  styleUrls: ['./password-recovery-email.component.css']
})
export class PasswordRecoveryEmailComponent implements OnInit {
  signupVo: SignupVo = new SignupVo();
  return: string = '';
  countDown: number = 0;
  countDownIntervalId: any = null;
  isSendingCode: boolean = false;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
              private toastService: ToastService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.signupVo.codeType = CodeTypeEnum.PASSWORD_RECOVERY;
  }

  sendVerificationCode() {
    // Before sending the verification code, you can perform some basic validation, such as checking if the email is empty or valid.
    if (!this.signupVo.email) {
      this.toastService.showErrorToast("Email cannot be empty");
      return;
    }
    // You can add more complex email validation, such as checking if the email format is correct.
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.signupVo.email)) {
      this.toastService.showErrorToast("Please enter a valid email");
      return;
    }
    // Send the verification code to the user's email.
    this.isSendingCode = true;  // Disable the "Send Verification Code" button
    this.authService.sendEmailVerificationCode(this.signupVo).subscribe({
      next: jwtResponse => {
        console.log(jwtResponse);
        if (jwtResponse.errcode == 0) {
          this.toastService.showSuccessToast("Sent successfully");
          // Start the countdown, the user can resend the code after 60 seconds
          this.countDown = 60;
          this.countDownIntervalId = setInterval(() => {
            if (this.countDown > 0) {
              this.countDown--;
            } else {
              clearInterval(this.countDownIntervalId);
              this.isSendingCode = false;  // Enable the "Send Verification Code" button
            }
          }, 1000);
        } else {
          this.toastService.showErrorToast(jwtResponse.errmsg);
          this.isSendingCode = false;  // Enable the "Send Verification Code" button
        }
      },
      error: err => {
        this.toastService.showErrorToast("Failed to send verification code", "Server error");
        this.isSendingCode = false;  // Enable the "Send Verification Code" button
      }
    });
  }

  onSubmit(): void {
    // Check if the email is empty or in an invalid format
    if (!this.signupVo.email) {
      this.toastService.showErrorToast("Email cannot be empty");
      return;
    }
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.signupVo.email)) {
      this.toastService.showErrorToast("Please enter a valid email");
      return;
    }
    // Check if the password is empty
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
    // Check if the verification code is empty or not of the correct length
    if (!this.signupVo.verificationCode || this.signupVo.verificationCode.length != 4) {
      this.toastService.showErrorToast("Please enter a valid verification code");
      return;
    }
    this.authService.passwordRecoveryEmail(this.signupVo).subscribe({
      next: jwtResponse => {
        console.log(jwtResponse);
        if (jwtResponse.errcode == 0) {
          this.router.navigate(['/login']);
          this.toastService.showSuccessToast("Operation successful");
        } else {
          this.toastService.showErrorToast(jwtResponse.errmsg);
        }
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }
}
