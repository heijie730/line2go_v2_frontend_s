import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../../../../../_helpers/toast.service";
import {QueueService} from "../../../../../../_services/queue.service";

@Component({
  selector: 'app-scan-transfer-queue',
  templateUrl: './scan-transfer-queue.component.html',
  styleUrls: ['./scan-transfer-queue.component.css']
})
export class ScanTransferQueueComponent implements OnInit {

  constructor(private activateRoute: ActivatedRoute,private toastService: ToastService,
              private queueService: QueueService,
              private router: Router) {
  }

  ngOnInit(): void {

  }

  scanSuccess(value: string): void {
    console.log("scanSuccess", value);
    window.location.href = value;
  }

  autoStarted(): void {
    this.toastService.showAlertWithInfo("Please scan the QR code to transfer queue.");
  }
}
