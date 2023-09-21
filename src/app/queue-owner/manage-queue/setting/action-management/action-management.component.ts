import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../_services/queue.service";
import {ToastService} from "../../../../_helpers/toast.service";
import {Location} from "@angular/common";
import {QueueVo} from "../../../../models/QueueVo";
import Swal from "sweetalert2";

@Component({
  selector: 'app-action-management',
  templateUrl: './action-management.component.html',
  styleUrls: ['./action-management.component.css']
})
export class ActionManagementComponent implements OnInit {
  queueId: string;
  queueVo: QueueVo;

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location,
              private router: Router) {
  }

  ngOnInit(): void {

    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      // Swal.showLoading();
      this.queueService.findById(this.queueId).subscribe(
        {
          next: queueVo => {
            // Swal.close();
            this.queueVo = queueVo;
          },error:err => {
            // Swal.close();
            this.toastService.showErrorToast("Operation failed", "Server error");
          }
        }
      )
    })
  }

}
