import {Component, OnInit} from '@angular/core';
import {ServiceRequestContent, ServiceRequestVo} from "../../../models/ServiceRequestVo";
import {ActivatedRoute, Router} from "@angular/router";
import {SuperAdminService} from "../../../_services/super-admin.service";
import {ServiceRequestService} from "../../../_services/service-request.service";
import {DateTimeUtils} from "../../../_utils/dateTimeUtils";
import {Location} from "@angular/common";
import {ToastService} from "../../../_helpers/toast.service";
import {TokenStorageService} from "../../../_services/token-storage.service";
import {UserVo} from "../../../models/UserVo";
// import {SmsSubscriptionVo} from "../../../models/SmsSubscriptionVo";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  id: string;
  userVo: UserVo;
  // smsCount: number = 0;

  constructor(public activateRoute: ActivatedRoute,
              private superAdminService: SuperAdminService,
              private serviceRequestService: ServiceRequestService,
              public dateTimeUtils: DateTimeUtils,
              private location: Location,
              private toastService: ToastService,
              private router: Router,
              private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      this.loadDetail();
    });
  }

  loadDetail() {
    this.superAdminService.userById(this.id).subscribe({
      next: userVo => {
        console.log("userVo", userVo);
        this.userVo = userVo;
        if (this.userVo.errcode != 0) {
          this.toastService.showErrorToast("未发现用户");
        }
      },
      error: err => {
        this.toastService.showErrorToast("服务器出错");
      }
    });
  }

  // submitSms() {
  //   let superAdminVo = new SuperAdminVo();
  //   superAdminVo.userId=this.userVo.id;
  //   superAdminVo.count = this.smsCount;
  //   this.superAdminService.addSms(superAdminVo).subscribe({
  //     next: result => {
  //       console.log(result)
  //       if (result.errcode == 0) {
  //         this.toastService.showSuccessToast("操作成功！");
  //       }
  //     },
  //     error: err => {
  //       this.toastService.showErrorToast("购买短信包失败", "服务器出错");
  //     }
  //   })
  // }
}
