import { Component, OnInit } from '@angular/core';
import { QueueVo } from "../../../../../../../models/QueueVo";
import { ActivatedRoute, Router } from "@angular/router";
import { QueueService } from "../../../../../../../_services/queue.service";
import { ToastService } from "../../../../../../../_helpers/toast.service";
import { Location, PlatformLocation } from "@angular/common";
import { ChildQueueVo } from "../../../../../../../models/ChildQueueVo";
import { DateTimeUtils } from "../../../../../../../_utils/dateTimeUtils";
import Swal from "sweetalert2";

@Component({
  selector: 'app-child-queue-scan-result',
  templateUrl: './child-queue-scan-result.component.html',
  styleUrls: ['./child-queue-scan-result.component.css']
})
export class ChildQueueScanResultComponent implements OnInit {
  queueId: string;
  targetQueueId: string;
  // queueVo: QueueVo;
  targetQueueVo: QueueVo;
  childQueueVo: ChildQueueVo = new ChildQueueVo();

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location, private platformLocation: PlatformLocation,
              private dateTimeUtils: DateTimeUtils,
              private router: Router) {
    // this.detectMobileBrowser();
  }

  ngOnInit(): void {
    Swal.showLoading();
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.targetQueueId = params['targetQueueId'];
      this.childQueueVo.queueId = this.queueId;
      this.childQueueVo.targetQueueId = this.targetQueueId;
      this.queueService.findById(this.targetQueueId).subscribe({
        next: targetQueueVo => {
          console.log(targetQueueVo);
          this.targetQueueVo = targetQueueVo;
          this.childQueueVo.targetQueueName = this.targetQueueVo.queueName;
          this.childQueueVo.remark = this.targetQueueVo.queueName;
          Swal.close();
        },
        error: err => {
          Swal.close();
          this.toastService.showErrorToast("Server error")
          console.log(err);
        }
      });
    });
  }

  submit() {
    if (this.targetQueueVo.childQueueManager.password) {
      if (!this.childQueueVo.password) {
        this.toastService.showErrorToast("Password is required");
        return;
      }
    }
    if (!this.childQueueVo.remark || this.childQueueVo.remark == '') {
      this.toastService.showErrorToast("Remark cannot be empty");
      return;
    }
    this.queueService.addChildQueue(this.childQueueVo).subscribe({
      next: childQueueVo => {
        console.log(childQueueVo);
        if (childQueueVo.errcode == 0) {
          this.toastService.showSuccessToast("Added successfully");
          this.router.navigate(['/leader/child-queue-list', this.queueId]);
        } else {
          this.toastService.showErrorToast(childQueueVo.errmsg);
        }
      },
      error: err => {
        this.toastService.showErrorToast("Server error");
        console.log(err);
      }
    });
  }
}
