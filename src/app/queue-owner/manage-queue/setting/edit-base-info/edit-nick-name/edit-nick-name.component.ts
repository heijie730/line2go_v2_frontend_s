import { Component, OnInit } from '@angular/core';
import { QueueVo } from "../../../../../models/QueueVo";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "../../../../../_helpers/toast.service";
import { QueueService } from "../../../../../_services/queue.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-edit-nick-name',
  templateUrl: './edit-nick-name.component.html',
  styleUrls: ['./edit-nick-name.component.css']
})
export class EditNickNameComponent implements OnInit {
  queue: QueueVo;

  constructor(
    private activateRoute: ActivatedRoute,
    private toastService: ToastService,
    private queueService: QueueService
  ) { }

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

  editNickName(): void {
    if (this.queue.nickName == '') {
      this.toastService.showErrorToast("Nickname cannot be empty");
      return;
    }

    this.queueService.updateNickName(this.queue).subscribe({
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
