import { Component, OnInit } from '@angular/core';
import {QueueVo} from "../../../../../models/QueueVo";
import {ActivatedRoute} from "@angular/router";
import {ToastService} from "../../../../../_helpers/toast.service";
import {QueueService} from "../../../../../_services/queue.service";
import Swal from "sweetalert2";
import * as momentTimezone from "moment-timezone";

@Component({
  selector: 'app-edit-queue-name',
  templateUrl: './edit-queue-name.component.html',
  styleUrls: ['./edit-queue-name.component.css']
})
export class EditQueueNameComponent implements OnInit {
  queue: QueueVo;
  timezones: string[] = momentTimezone.tz.names();

  constructor(
    private activateRoute: ActivatedRoute,
    private toastService: ToastService,
    private queueService: QueueService) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      let queueId = params['id'];
      Swal.showLoading();
      this.queueService.findById(queueId).subscribe({
        next: queueVO => {
          Swal.close()
          console.log('data', queueVO);
          this.queue = queueVO;
        },
        error: err => {
          Swal.close()
          console.log('Fail', err);
          this.toastService.showErrorToast("Server error")
        }
      });
    });
  }
  editQueueName(): void {
    if (this.queue.queueName == '') {
      this.toastService.showErrorToast("Queue Name cannot be empty");
      return;
    }
    if (this.queue.timeZone == '') {
      this.toastService.showErrorToast("Time Zone cannot be empty");
      return;
    }
    this.queueService.updateQueueName(this.queue).subscribe({
      next: result => {
        console.log('Success', result);
        this.toastService.showSuccessToast('Update successful');
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");

      }
    });
  }
}
