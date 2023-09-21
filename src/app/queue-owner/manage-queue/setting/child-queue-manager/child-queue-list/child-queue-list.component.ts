import {Component, OnInit} from '@angular/core';
import {ChildQueue, DashboardItem, QueueVo} from "../../../../../models/QueueVo";
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../_services/queue.service";
import {ToastService} from "../../../../../_helpers/toast.service";
import {Location} from "@angular/common";
import {DateTimeUtils} from "../../../../../_utils/dateTimeUtils";
import Swal from "sweetalert2";

@Component({
  selector: 'app-child-queue-list',
  templateUrl: './child-queue-list.component.html',
  styleUrls: ['./child-queue-list.component.css']
})
export class ChildQueueListComponent implements OnInit {
  queueId: string;
  queueVo: QueueVo;
  childQueues: ChildQueue[] = [];


  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location,
              public dateTimeUtils: DateTimeUtils,
              private router: Router) {
  }

  ngOnInit(): void {
    Swal.showLoading();
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.queueService.findById(this.queueId).subscribe(
        {
          next: queueVo => {
            Swal.close();
            this.queueVo = queueVo;
            this.childQueues = this.queueVo.childQueueManager.childQueues;
            console.log("childQueues", this.childQueues)
          },
          error: err => {
            Swal.close();
            this.toastService.showErrorToast('Operation failed', 'Server error');
          }
        }
      )
    })
  }
}
