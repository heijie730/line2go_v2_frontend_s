import { Component, OnInit } from '@angular/core';
import {QueueVo} from "../../../../models/QueueVo";
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../_services/queue.service";
import {ToastService} from "../../../../_helpers/toast.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-service-time-manager',
  templateUrl: './service-time-manager.component.html',
  styleUrls: ['./service-time-manager.component.css']
})
export class ServiceTimeManagerComponent implements OnInit {

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
      this.queueService.findById(this.queueId).subscribe(
        {
          next: queueVo => {
            this.queueVo = queueVo;
          }
        }
      )
    })
  }

}
