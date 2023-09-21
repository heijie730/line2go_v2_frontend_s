import {Component, OnInit} from '@angular/core';
import {UserVo} from "../../../models/UserVo";
import {ActivatedRoute, Router} from "@angular/router";
import {SuperAdminService} from "../../../_services/super-admin.service";
import {ServiceRequestService} from "../../../_services/service-request.service";
import {DateTimeUtils} from "../../../_utils/dateTimeUtils";
import {Location} from "@angular/common";
import {ToastService} from "../../../_helpers/toast.service";
import {TokenStorageService} from "../../../_services/token-storage.service";
import {ParameterType, SystemParameterVo} from "../../../models/SystemParameterVo";
import {SystemParameterService} from "../../../_services/system-parameter.service";

@Component({
  selector: 'app-variable-detail',
  templateUrl: './variable-detail.component.html',
  styleUrls: ['./variable-detail.component.css']
})
export class VariableDetailComponent implements OnInit {
  type: ParameterType;
  systemParameterVo: SystemParameterVo= new SystemParameterVo();
  value: string = "123333";

  constructor(public activateRoute: ActivatedRoute,
              private superAdminService: SuperAdminService,
              private serviceRequestService: ServiceRequestService,
              private systemParameterService:SystemParameterService,
              public dateTimeUtils: DateTimeUtils,
              private location: Location,
              private toastService: ToastService,
              private router: Router,
              private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.type = params['type'];
      this.systemParameterVo.parameterType = this.type;
      this.loadParam();
    });
  }

  loadParam() {
    this.superAdminService.findLatestByType(this.type).subscribe({
      next: systemParameterVo => {
        console.log("systemParameterVo", systemParameterVo);
        if (systemParameterVo.errcode == 0) {
          this.systemParameterVo = systemParameterVo;
        }
      },
      error: err => {
        this.toastService.showErrorToast("服务器出错");
      }
    });
  }

  submit() {
    console.log(this.systemParameterVo);
    this.superAdminService.save(this.systemParameterVo).subscribe({
      next: queueVo => {
        console.log('Success', queueVo);
        this.toastService.showSuccessToast('更新成功');
      },
      error: err => {
        this.toastService.showErrorToast("操作失败", "服务器出错");
      }
    });
  }
}
