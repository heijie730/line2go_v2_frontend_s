import { Component, OnInit } from '@angular/core';
import {QueueVo} from "../../../../models/QueueVo";
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../_services/queue.service";
import {ToastService} from "../../../../_helpers/toast.service";
import {Location, PlatformLocation} from "@angular/common";

@Component({
  selector: 'app-child-queue-manager',
  templateUrl: './child-queue-manager.component.html',
  styleUrls: ['./child-queue-manager.component.css']
})
export class ChildQueueManagerComponent implements OnInit {
  queueId: string;
  queueVo: QueueVo;

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location,private platformLocation: PlatformLocation,
              private router: Router) {
    // this.detectMobileBrowser();
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          console.log(queueVo);
          this.queueVo = queueVo;
        }
      });
    });
  }

}
