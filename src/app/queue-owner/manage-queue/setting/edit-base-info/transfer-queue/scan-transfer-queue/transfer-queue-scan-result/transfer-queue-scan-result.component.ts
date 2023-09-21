import {Component, OnInit} from '@angular/core';
import {QueueVo} from "../../../../../../../models/QueueVo";
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../../../_services/queue.service";
import {ToastService} from "../../../../../../../_helpers/toast.service";
import {Location, PlatformLocation} from "@angular/common";
import {DateTimeUtils} from "../../../../../../../_utils/dateTimeUtils";
import Swal from "sweetalert2";
import {CodeTypeEnum, VerificationCodeVo} from "../../../../../../../models/VerificationCodeVo";
import {data} from "autoprefixer";

@Component({
  selector: 'app-transfer-queue-scan-result',
  templateUrl: './transfer-queue-scan-result.component.html',
  styleUrls: ['./transfer-queue-scan-result.component.css']
})
export class TransferQueueScanResultComponent implements OnInit {
  targetQueueId: string;
  // queueVo: QueueVo;
  targetQueueVo: QueueVo;
  verificationCodeVo: VerificationCodeVo = new VerificationCodeVo();

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location, private platformLocation: PlatformLocation,
              private dateTimeUtils: DateTimeUtils,
              private router: Router) {
    // this.detectMobileBrowser();
  }

  ngOnInit(): void {
    Swal.showLoading();
    this.activateRoute.params.subscribe(params => {
      this.targetQueueId = params['targetQueueId'];
      this.verificationCodeVo.codeType = CodeTypeEnum.TRANSFER_QUEUE;
      this.queueService.findById(this.targetQueueId).subscribe({
        next: targetQueueVo => {
          console.log(targetQueueVo);
          this.targetQueueVo = targetQueueVo;
          this.verificationCodeVo.queueId = this.targetQueueVo.id;
          Swal.close();
        },
        error: err => {
          Swal.close();
          this.toastService.showErrorToast("Server error")
          console.log(err);
        }
      });
    });
  }

  toBack(): void {
    this.location.back()
  }

  submit() {
    Swal.showLoading();
    this.queueService.verifyTransferQueueCode(this.verificationCodeVo).subscribe({
      next: data => {
        Swal.close();
        if (data.errcode == 0) {
          this.toastService.showConfirmAlert("Transfer of queue successful. Do you want to navigate to this queue?", () => {
            this.router.navigate(['/leader/manage-queue', this.verificationCodeVo.queueId]);
          },false)
        } else {
          this.toastService.showErrorToast(data.errmsg);
        }
      },
      error: err => {
        Swal.close();
        this.toastService.showErrorToast("Server error")
      }
    })


  }
}
