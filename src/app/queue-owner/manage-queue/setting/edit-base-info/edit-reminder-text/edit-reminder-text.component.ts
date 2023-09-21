import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ToastService} from "../../../../../_helpers/toast.service";
import {AwsService} from "../../../../../_services/aws-service.service";
import {CustomUtils} from "../../../../../_utils/CustomUtils";
import {QueueService} from "../../../../../_services/queue.service";
import Swal from "sweetalert2";
import {QueueVo} from "../../../../../models/QueueVo";

@Component({
  selector: 'app-edit-reminder-text',
  templateUrl: './edit-reminder-text.component.html',
  styleUrls: ['./edit-reminder-text.component.css']
})
export class EditReminderTextComponent implements OnInit {
  queue: QueueVo;

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
          this.toastService.showErrorToast("Operation failed", "Server error");
        }
      });
    });
  }
  editReminderText(): void {
    this.queueService.updateReminderText(this.queue).subscribe({
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
