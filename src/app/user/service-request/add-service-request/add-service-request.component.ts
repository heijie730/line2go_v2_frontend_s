import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ServiceRequestService } from "../../../_services/service-request.service";
import { DateTimeUtils } from "../../../_utils/dateTimeUtils";
import { Location } from "@angular/common";
import { ToastService } from "../../../_helpers/toast.service";
import { TokenStorageService } from "../../../_services/token-storage.service";
import { ServiceRequestContent, ServiceRequestVo } from "../../../models/ServiceRequestVo";

@Component({
  selector: 'app-add-service-request',
  templateUrl: './add-service-request.component.html',
  styleUrls: ['./add-service-request.component.css']
})
export class AddServiceRequestComponent implements OnInit {
  serviceRequestVO: ServiceRequestVo = new ServiceRequestVo();
  serviceRequestContent: ServiceRequestContent = new ServiceRequestContent();

  constructor(public activateRoute: ActivatedRoute,
              private serviceRequestService: ServiceRequestService,
              public dateTimeUtils: DateTimeUtils,
              private location: Location,
              private toastService: ToastService,
              private router: Router,
              private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (!this.serviceRequestVO.title) {
      this.toastService.showErrorToast("Title cannot be empty");
      return;
    }
    if (!this.serviceRequestVO.userName) {
      this.toastService.showErrorToast("Username cannot be empty");
      return;
    }
    if (!this.serviceRequestContent.content) {
      this.toastService.showErrorToast("Content cannot be empty");
      return;
    }
    this.serviceRequestContent.contentRole = "USER";
    this.serviceRequestContent.dateTime = new Date();
    this.serviceRequestVO.serviceRequestContents.push(this.serviceRequestContent);
    this.serviceRequestService.save(this.serviceRequestVO).subscribe({
      next: serviceRequestVO => {
        if (serviceRequestVO.errcode == 0) {
          console.log(serviceRequestVO);
          this.toastService.showSuccessToast("Submitted successfully");
          this.router.navigate(['/service-requests/detail', serviceRequestVO.id]);
        } else {
          this.toastService.showErrorToast(serviceRequestVO.errmsg);
        }
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }

  toBack(): void {
    this.location.back();
  }
}
