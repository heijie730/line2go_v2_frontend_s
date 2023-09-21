import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ServiceRequestService } from "../../../_services/service-request.service";
import { DateTimeUtils } from "../../../_utils/dateTimeUtils";
import { Location } from "@angular/common";
import { ToastService } from "../../../_helpers/toast.service";
import { TokenStorageService } from "../../../_services/token-storage.service";
import { MarkNotificationVo } from "../../../models/MarkNotificationVo";
import { ServiceRequestContent, ServiceRequestVo } from "../../../models/ServiceRequestVo";

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
    this.serviceRequestService.findById(this.id).subscribe({
      next: serviceRequestVO => {
        console.log("serviceRequestVO", serviceRequestVO);
        this.serviceRequestVo = serviceRequestVO;
        if (this.serviceRequestVo.errcode != 0) {
          this.toastService.showErrorToast("Service request not found");
        } else {
          // this.serviceRequestService.markChecked(this.id,undefined,true).subscribe({
          //   next: serviceRequestVO => {
          //     console.log("Marked as checked", serviceRequestVO);
          //   }
          // })
        }
      },
      error: err => {
        this.toastService.showErrorToast("Server error");
      }
    });
  }

  onReply() {
    this.replyMessage = this.replyMessage.trim();
    if (this.replyMessage == '') {
      return;
    }
    let serviceRequestContent = new ServiceRequestContent();
    serviceRequestContent.contentRole = "USER";
    serviceRequestContent.dateTime = new Date();
    serviceRequestContent.content = this.replyMessage;
    this.serviceRequestVo.serviceRequestContents.push(serviceRequestContent);
    this.serviceRequestService.appendContent(this.serviceRequestVo).subscribe({
      next: serviceRequestVO => {
        console.log("serviceRequestVO", serviceRequestVO);
        if (serviceRequestVO.errcode == 0) {
          this.toastService.showSuccessToast("Reply sent successfully");
          // this.serviceRequestService.markChecked(this.id,false,true).subscribe({
          //   next: serviceRequestVO => {
          //     console.log("Marked as checked", serviceRequestVO);
          //   }
          // })
        } else {
          this.toastService.showErrorToast(serviceRequestVO.errmsg);
        }
      },
      error: err => {
        this.toastService.showErrorToast("Failed to reply to service request", "Server error");
      }
    });
    this.replyMessage = '';
  }

  toBack(): void {
    this.location.back()
  }
}
