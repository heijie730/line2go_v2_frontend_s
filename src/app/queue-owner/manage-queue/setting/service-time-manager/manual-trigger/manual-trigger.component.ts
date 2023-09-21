import { Component, OnInit } from '@angular/core';
import {ManualTriggerServiceTimeItem, QueueVo, TagRules} from "../../../../../models/QueueVo";
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../_services/queue.service";
import {ToastService} from "../../../../../_helpers/toast.service";
import {Location} from "@angular/common";
import Swal from "sweetalert2";
import {Toast} from "bootstrap";

@Component({
  selector: 'app-manual-trigger',
  templateUrl: './manual-trigger.component.html',
  styleUrls: ['./manual-trigger.component.css']
})
export class ManualTriggerComponent implements OnInit {
  queueId: string;
  queueVo: QueueVo;
  manualTriggerServiceTimeItems: ManualTriggerServiceTimeItem[];

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location,
              private router: Router) {
  }

  ngOnInit(): void {
    Swal.showLoading()
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          Swal.close();
          console.log(queueVo);
          this.queueVo = queueVo;
          this.manualTriggerServiceTimeItems = this.queueVo.serviceTimeManager.manualTriggerItemList;
        },error:err => {
          Swal.close();
          this.toastService.showErrorToast("Operation failed", "Server error");
        }
      });
    })
  }

}
