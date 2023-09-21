import { Component, OnInit } from '@angular/core';
import {ToastService} from "../../_helpers/toast.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-member-scan',
  templateUrl: './member-scan.component.html',
  styleUrls: ['./member-scan.component.css']
})
export class MemberScanComponent implements OnInit {

  constructor(private toastService:ToastService,
              public router: Router) { }

  ngOnInit(): void {
  }
  scanSuccess(value: string): void {
    console.log("scanSuccess", value);
    // this.router.navigateByUrl(value);
    window.location.href = value;
  }
  autoStarted(): void {
    console.log("autoStarted...........");
    this.toastService.showAlertWithInfo("Please scan the QR code to get your ticket.");
  }

}
