import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../../../../_helpers/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChildQueue, QueueVo } from '../../../../../../models/QueueVo';
import { QueueService } from '../../../../../../_services/queue.service';
import { Location } from '@angular/common';
import { DateTimeUtils } from '../../../../../../_utils/dateTimeUtils';

@Component({
  selector: 'app-save-child-queue',
  templateUrl: './save-child-queue.component.html',
  styleUrls: ['./save-child-queue.component.css']
})
export class SaveChildQueueComponent implements OnInit {
  queueId: string;
  queueVo: QueueVo;
  index: number;
  childQueue: ChildQueue;
  childQueues: ChildQueue[];

  constructor(
    private activateRoute: ActivatedRoute,
    private queueService: QueueService,
    private toastService: ToastService,
    public dateTimeUtils: DateTimeUtils,
    private location: Location,
    private router: Router
  ) {
    // this.detectMobileBrowser();
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.index = params['index'];
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          this.queueVo = queueVo;
          this.childQueues = this.queueVo.childQueueManager.childQueues;
          console.log(this.childQueues);
          this.childQueue = this.childQueues[this.index];
        }
      });
    });
  }

  delete(): void {
    this.toastService.showConfirmAlert('Are you sure you want to delete?', () => {
      this.childQueues.splice(this.index, 1);
      this.queueVo.childQueueManager.childQueues = this.childQueues;
      this.queueService.updateChildQueueManager(this.queueVo).subscribe({
        next: queueVo => {
          console.log('Success', queueVo);
          this.toastService.showSuccessToast('Deletion successful');
          this.router.navigate(['/leader/child-queue-list', this.queueId]);
        },
        error: err => {
          this.toastService.showErrorToast('Operation failed', 'Server error');
        }
      });
    });
  }

  submit() {
    if (!this.childQueue.remark || this.childQueue.remark === '') {
      this.toastService.showErrorToast('Remark cannot be empty');
      return;
    }
    this.queueService.updateChildQueueManager(this.queueVo).subscribe({
      next: queueVo => {
        console.log('Success', queueVo);
        this.toastService.showSuccessToast('Update successful');
      },
      error: err => {
        this.toastService.showErrorToast('Operation failed', 'Server error');
      }
    });
  }
}
