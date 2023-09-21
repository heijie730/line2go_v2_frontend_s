import {Component, OnInit} from '@angular/core';
import {FcmToken, UserVo} from "../../models/UserVo";
import {UserService} from "../../_services/user.service";
import {AngularFireMessaging} from "@angular/fire/compat/messaging";
import {ToastService} from "../../_helpers/toast.service";
import {TokenStorageService} from "../../_services/token-storage.service";
import {isSupported} from "@angular/fire/messaging";
import Swal from "sweetalert2";
import {data} from "autoprefixer";
import {Title} from "@angular/platform-browser";
import {Platform} from "@angular/cdk/platform";
import {DeviceDetectorService} from "ngx-device-detector";

const {ClientJS} = require('clientjs');

@Component({
  selector: 'app-notify-switch',
  templateUrl: './notify-switch.component.html',
  styleUrls: ['./notify-switch.component.css']
})
export class NotifySwitchComponent implements OnInit {
  userVo: UserVo;
  supportBackground: boolean;
  // supportForeground: boolean;

  // supportEmail: boolean = true;
  fcmToken: FcmToken;

  constructor(private userService: UserService, private angularFireMessaging: AngularFireMessaging,
              private deviceService: DeviceDetectorService,
              private toastService: ToastService, private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    isSupported().then((x: any) => {
      console.log("isSupported", x);
      this.supportBackground = x;
    });
    // this.supportForeground = 'Notification' in window;
    this.userService.userInfo().subscribe(data => {
        this.userVo = data;
        console.log("userVo", this.userVo);
        let deviceInfo = this.deviceService.getDeviceInfo();
        console.log(deviceInfo)
        let browser = deviceInfo.browser;
        let client = new ClientJS(); // Create A New Client Object
        let fingerprint = client.getFingerprint(); // Calculate Device/Browser Fingerprint
        let fcmToken1 = this.userVo.fcmTokenMap.get(fingerprint+'');
      console.log("fingerprint",fingerprint)
      console.log("fcmToken1",fcmToken1)
        if (!fcmToken1) {
          this.fcmToken = new FcmToken();
          this.fcmToken.deviceName = browser;
          this.fcmToken.enable = false;
          this.fcmToken.fingerprint = fingerprint+'';
          this.fcmToken.createDateTime = new Date();
        } else {
          this.fcmToken = fcmToken1;
        }
      }
    );
  }

  emailNotifyOnSwitch(event: any) {
    let checked = event.target.checked;
    this.userVo.emailNotify = checked;
    Swal.showLoading();
    this.userService.updateEmailNotify(this.userVo).subscribe({
        next: data => {
          Swal.close();
          if (data.errcode == 0) {
            if (checked) {
              this.toastService.showSuccessToast("success", "Enable successfully");
            } else {
              this.toastService.showSuccessToast("success", "Disable successfully");
            }
          }
        }, error: err => {
          Swal.close();
          this.toastService.showErrorToast("Operation failed", "Server error");
        }
      }
    );
  }

  // fgNotifyOnSwitch(event: any) {
  //   let checked = event.target.checked;
  //   Swal.showLoading();
  //   if (checked) {
  //     this.angularFireMessaging.requestPermission.subscribe(permission => {
  //       if (permission == 'granted') {
  //         this.userVo.fgNotify = true;
  //       } else if (permission == 'denied') {
  //         this.userVo.fgNotify = false;
  //       } else {
  //         this.userVo.fgNotify = false;
  //       }
  //       this.userService.updateFgNotify(this.userVo).subscribe(data => {
  //         Swal.close();
  //         if (data.errcode == 0) {
  //           if (permission == 'granted') {
  //             this.toastService.showSuccessToast("success", "Enable successfully");
  //           } else if (permission == 'denied') {
  //             this.toastService.showErrorToast("error", "Not enable notification,please enable notification manually.");
  //           } else {
  //             this.toastService.showWarningToast("warn", "Not enable notification");
  //           }
  //           this.tokenStorageService.removeAccessToken();
  //         }
  //       });
  //     })
  //   } else {
  //     this.userVo.fgNotify = false;
  //     this.userService.updateFgNotify(this.userVo).subscribe(data => {
  //       Swal.close();
  //       if (data.errcode == 0) {
  //         this.toastService.showSuccessToast("success", "Disable successfully");
  //         this.tokenStorageService.removeAccessToken();
  //       }
  //     });
  //   }
  //
  //
  // }

  bgNotifyOnSwitch(event: any) {
    let checked = event.target.checked;
    this.fcmToken.enable = checked;
    this.userVo.fcmToken = this.fcmToken;
    console.log(this.fcmToken)
    if (checked) {
      this.angularFireMessaging.requestToken.subscribe(token => {
        console.log("token", token);
        Swal.showLoading();
        if (token) {
          this.fcmToken.token = token;
          this.userService.updateBgNotify(this.userVo).subscribe(data => {
            Swal.close();
            if (data.errcode == 0) {
              this.toastService.showSuccessToast("success", "Enable successfully");
            }
          });
        } else {
          this.fcmToken.enable = false;
          this.userService.updateBgNotify(this.userVo).subscribe(data => {
            Swal.close();
            if (data.errcode == 0) {
              this.toastService.showWarningToast("warn", "Please enable notification manually or reset notification permissions.");
            }
          });

        }
      });
    } else {
      Swal.showLoading();
      this.userService.updateBgNotify(this.userVo).subscribe(data => {
        Swal.close();
        if (data.errcode == 0) {
          this.toastService.showSuccessToast("success", "Disable successfully");
        }
      });
    }

  }

}
