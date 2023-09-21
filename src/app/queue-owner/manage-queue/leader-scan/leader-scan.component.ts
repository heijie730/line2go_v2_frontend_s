import { Component, OnInit } from '@angular/core';
import { ToastService } from "../../../_helpers/toast.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-leader-scan',
  templateUrl: './leader-scan.component.html',
  styleUrls: ['./leader-scan.component.css']
})
export class LeaderScanComponent implements OnInit {

  constructor(private toastService: ToastService,
              private router: Router) {
  }

  ngOnInit(): void {

  }

  scanSuccess(value: string): void {
    console.log("scanSuccess", value);
    // this.router.navigate(['/login']);
    // window.location.href = value;
    let ticketId = value;
    this.router.navigate(['/member/scan-result', ticketId]);
  }

  autoStarted(): void {
    console.log("autoStarted...........");
    this.toastService.showAlertWithInfo("Please scan the queue ticket QR code");
  }
}
