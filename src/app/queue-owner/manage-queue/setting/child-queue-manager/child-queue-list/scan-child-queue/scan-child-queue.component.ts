import { Component, OnInit } from '@angular/core';
import { ToastService } from "../../../../../../_helpers/toast.service";
import { ActivatedRoute, Router } from "@angular/router";
import { QueueService } from "../../../../../../_services/queue.service";

@Component({
  selector: 'app-scan-child-queue',
  templateUrl: './scan-child-queue.component.html',
  styleUrls: ['./scan-child-queue.component.css']
})
export class ScanChildQueueComponent implements OnInit {

  queueId: string;

  constructor(private activateRoute: ActivatedRoute, private toastService: ToastService,
              private queueService: QueueService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      // this.queueService.findById(this.queueId).subscribe(
      //   {
      //     next: queueVo => {
      //       this.queueVo = queueVo;
      //       this.childQueues = this.queueVo.childQueueManager.childQueues;
      //       console.log("childQueues", this.childQueues)
      //     }
      //   }
      // )
    });
  }

  scanSuccess(value: string): void {
    console.log("scanSuccess", value);
    // this.router.navigate(['/login']);
    // window.location.href = value;
    let targetQueueId = value;
    this.router.navigate(['/leader/child-queue-scan-result', this.queueId, targetQueueId]);
  }

  autoStarted(): void {
    this.toastService.showAlertWithInfo("Please scan the child queue QR code.");
  }

}
