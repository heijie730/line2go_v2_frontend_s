import {Component, OnInit} from '@angular/core';
import {ServiceRequestContent, ServiceRequestVo} from "../../../models/ServiceRequestVo";
import {ActivatedRoute, Router} from "@angular/router";
import {ServiceRequestService} from "../../../_services/service-request.service";
import {DateTimeUtils} from "../../../_utils/dateTimeUtils";
import {Location} from "@angular/common";
import {ToastService} from "../../../_helpers/toast.service";
import {TokenStorageService} from "../../../_services/token-storage.service";
import {SuperAdminService} from "../../../_services/super-admin.service";

@Component({
  selector: 'app-service-request-detail',
  templateUrl: './service-request-detail.component.html',
  styleUrls: ['./service-request-detail.component.css']
})
export class ServiceRequestDetailComponent implements OnInit {
  id: string;
  serviceRequestVo: ServiceRequestVo = new ServiceRequestVo();
  replyMessage = '';

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
    this.superAdminService.serviceRequestFindById(this.id).subscribe({
      next: serviceRequestVO => {
        console.log("serviceRequestVO", serviceRequestVO);
        this.serviceRequestVo = serviceRequestVO;
        if (this.serviceRequestVo.errcode != 0) {
          this.toastService.showErrorToast("未发现此工单");
        } else {
          // this.serviceRequestService.markChecked(this.id, true, undefined).subscribe({
          //   next: serviceRequestVO => {
          //     console.log("标记成功", serviceRequestVO);
          //   }
          // })
        }
      },
      error: err => {
        this.toastService.showErrorToast("服务器出错");
      }
    });
  }

  onReply() {
    this.replyMessage = this.replyMessage.trim();
    if (this.replyMessage == '') {
      return;
    }
    let serviceRequestContent = new ServiceRequestContent();
    serviceRequestContent.contentRole = "ADMIN";
    serviceRequestContent.dateTime = new Date();
    serviceRequestContent.content = this.replyMessage;
    this.serviceRequestVo.serviceRequestContents.push(serviceRequestContent);
    this.superAdminService.serviceRequestAppendContent(this.serviceRequestVo).subscribe({
      next: serviceRequestVO => {
        console.log("serviceRequestVO", serviceRequestVO);
        if (serviceRequestVO.errcode == 0) {
          this.toastService.showSuccessToast("发送成功");
          // this.serviceRequestService.markChecked(this.id,true,false).subscribe({
          //   next: serviceRequestVO => {
          //     console.log("标记成功", serviceRequestVO);
          //   }
          // })
        } else {
          this.toastService.showErrorToast(serviceRequestVO.errmsg);
        }
      },
      error: err => {
        this.toastService.showErrorToast("回复工单失败", "服务器出错");
      }
    });
    this.replyMessage = '';
  }

  toBack(): void {
    this.location.back()
  }

}
