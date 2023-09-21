import { Component, OnInit } from '@angular/core';
import { QueueVo } from "../../../../../../models/QueueVo";
import { ActivatedRoute, Router } from "@angular/router";
import { QueueService } from "../../../../../../_services/queue.service";
import { ToastService } from "../../../../../../_helpers/toast.service";
import { Location, PlatformLocation } from "@angular/common";
import { ChildQueueVo } from "../../../../../../models/ChildQueueVo";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-child-queue-qrcode',
  templateUrl: './child-queue-qrcode.component.html',
  styleUrls: ['./child-queue-qrcode.component.css']
})
export class ChildQueueQrcodeComponent implements OnInit {
  queueId: string;
  queueVo: QueueVo;
  childQueueVo: ChildQueueVo = new ChildQueueVo();

  constructor(
    private activateRoute: ActivatedRoute,
    private queueService: QueueService,
    private toastService: ToastService,
    private location: Location,
    private platformLocation: PlatformLocation,
    private modalService: NgbModal,
    private router: Router
  ) {
    // this.detectMobileBrowser();
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.loadQueue();
    });
  }

  loadQueue() {
    this.queueService.findById(this.queueId).subscribe({
      next: queueVo => {
        console.log(queueVo);
        this.queueVo = queueVo;
        this.childQueueVo.queueId = this.queueId;
      }
    });
  }

  open(content: any) {
    this.modalService.open(content);
  }

  deletePassword() {
    this.toastService.showConfirmAlert("Are you sure you want to delete the password?", () => {
      this.childQueueVo.password = '';
      this.updatePassword();
    });
  }

  submitPassword() {
    if (!this.childQueueVo.password) {
      this.toastService.showErrorToast("Password cannot be empty");
      return;
    }
    this.updatePassword();
  }

  updatePassword() {
    this.queueService.updateChildQueuePassword(this.childQueueVo).subscribe({
      next: queueVo => {
        console.log('Success', queueVo);
        this.toastService.showSuccessToast('Update successful');
        this.loadQueue();
        this.modalService.dismissAll();
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }
}
