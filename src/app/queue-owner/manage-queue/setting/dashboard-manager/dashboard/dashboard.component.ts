import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashboardEnum, DashboardTemplate, QueueVo } from "../../../../../models/QueueVo";
import { ActivatedRoute, Router } from "@angular/router";
import { QueueService } from "../../../../../_services/queue.service";
import { ToastService } from "../../../../../_helpers/toast.service";
import { Location } from "@angular/common";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  queueId: string;
  index: number;
  queueVo: QueueVo;
  templates: DashboardTemplate[] = [];
  currentTemplate: DashboardTemplate = new DashboardTemplate();
  isEdit: boolean = false;
  @ViewChild('headerElement', { static: true }) headerElement: ElementRef;
  dashboardEnum: DashboardEnum;

  constructor(
    private activateRoute: ActivatedRoute,
    private queueService: QueueService,
    private toastService: ToastService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.index = params['index'];
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          this.queueVo = queueVo;
          this.templates = this.queueVo.dashboardManager.dashboardTemplateList;
          this.currentTemplate = this.templates[this.index];
        }
      });
    });
    this.onChange();
  }

  onChange() {
    if (this.isEdit) {
      this.dashboardEnum = DashboardEnum.DASHBOARD_EDIT;
    } else {
      this.dashboardEnum = DashboardEnum.DASHBOARD_PRO;
    }
  }

  isHeaderVisible = true;

  onMouseDown(event: MouseEvent) {
    const element = this.headerElement.nativeElement;
    const rect = element.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (
      mouseX >= rect.left &&
      mouseX <= rect.right &&
      mouseY >= rect.top &&
      mouseY <= rect.bottom
    ) {
      this.isHeaderVisible = true;
    } else {
      this.isHeaderVisible = false;
    }
  }

  submit(): void {
    if (!this.currentTemplate.title || !this.currentTemplate.title.trim()) {
      this.toastService.showErrorToast("Name cannot be empty");
      return;
    }
    let length = this.templates.filter(x => x.title == this.currentTemplate.title).length;
    if (length > 1) {
      this.toastService.showErrorToast("Cannot duplicate existing names");
      return;
    }
    this.queueVo.id = this.queueId;
    this.queueVo.dashboardManager.dashboardTemplateList = this.templates;
    console.log(this.templates);
    this.queueService.updateDashboardManager(this.queueVo).subscribe({
      next: queueVo => {
        console.log('Success', queueVo);
        this.toastService.showSuccessToast('Operation successful');
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }
}
