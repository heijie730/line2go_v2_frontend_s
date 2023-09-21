import { Component, OnInit } from '@angular/core';
import {ParameterType, SystemParameterVo} from "../../../models/SystemParameterVo";
import {DashboardItem, DashboardTemplate} from "../../../models/QueueVo";
import {ToastService} from "../../../_helpers/toast.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {SuperAdminService} from "../../../_services/super-admin.service";
import {SystemParameterService} from "../../../_services/system-parameter.service";

@Component({
  selector: 'app-queue-init-item',
  templateUrl: './queue-init-item.component.html',
  styleUrls: ['./queue-init-item.component.css']
})
export class QueueInitItemComponent implements OnInit {

  systemParameterVo: SystemParameterVo = new SystemParameterVo();
  dashboardItems: DashboardItem[] = [];
  parameterType: ParameterType = ParameterType.QUEUE_INIT_DASHBOARD_ITEM;

  constructor(private toastService: ToastService, private superAdminService:SuperAdminService,
              private systemParameterService:SystemParameterService,
              private clipboard: Clipboard,) {
  }

  ngOnInit(): void {
    this.superAdminService.findLatestByType(this.parameterType).subscribe({
      next: data => {
        if (data.errcode == 0) {
          this.systemParameterVo = data;
          this.dashboardItems = this.systemParameterVo.dashboardItems;
        }
      }
    })
  }

  get dashboardItemsJson() {
    return JSON.stringify(this.dashboardItems, null, 2);  // Convert to JSON string with pretty print
  }

  jsonCorrect: boolean = true;

  set dashboardItemsJson(v: string) {
    try {
      this.dashboardItems = JSON.parse(v);  // Parse JSON string to object
      this.jsonCorrect = true;
    } catch (e) {
      this.jsonCorrect = false;
      this.toastService.showErrorToast("格式错误！")
    }
  }

  copyJson() {
    this.clipboard.copy(this.dashboardItemsJson);
    this.toastService.showSuccessToast('复制成功');
  }

  submit(): void {
    if (!this.jsonCorrect) {
      this.toastService.showErrorToast("配置文件格式错误");
      return;
    }
    this.systemParameterVo.parameterType = this.parameterType;
    this.systemParameterVo.dashboardItems = this.dashboardItems;
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
