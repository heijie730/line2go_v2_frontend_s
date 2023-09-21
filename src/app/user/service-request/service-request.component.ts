import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DateTimeUtils} from "../../_utils/dateTimeUtils";
import {Location} from "@angular/common";
import {ToastService} from "../../_helpers/toast.service";
import {TokenStorageService} from "../../_services/token-storage.service";
import {ServiceRequestService} from "../../_services/service-request.service";
import {ServiceRequestVo} from "../../models/ServiceRequestVo";
import Swal from "sweetalert2";

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.css']
})
export class ServiceRequestComponent implements OnInit {
  serviceRequestVos: ServiceRequestVo[] = [];
  page: number = 0;
  size: number = 10;

  constructor(public activateRoute: ActivatedRoute,
              private serviceRequestService: ServiceRequestService,
              public dateTimeUtils: DateTimeUtils,
              private location: Location,
              private toastService: ToastService,
              private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe(params => {
      let pageTmp = parseInt(params['page']);
      let sizeTmp = parseInt(params['size']);
      if (pageTmp >= 0) {
        this.page = pageTmp;
      }
      if (sizeTmp > 0) {
        this.size = sizeTmp;
      }
      Swal.showLoading();
      this.serviceRequestService.list(this.page, this.size).subscribe({
        next: serviceRequestVo => {
          Swal.close();
          console.log('Success serviceRequestVOS', serviceRequestVo);
          if (serviceRequestVo.errcode == 0) {
            this.serviceRequestVos = serviceRequestVo.serviceRequestVos;
          }
        },
        error: err => {
          Swal.close();
          this.toastService.showErrorToast("Failed to load service requests", "Server error");
        }
      })
    });
  }

  toBack(): void {
    this.location.back()
  }
}
