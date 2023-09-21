import {Component, OnInit} from '@angular/core';
import {QueueVo} from "../../../../../models/QueueVo";
import {ActivatedRoute} from "@angular/router";
import {ToastService} from "../../../../../_helpers/toast.service";
import {QueueService} from "../../../../../_services/queue.service";
import Swal from "sweetalert2";
import {data} from "autoprefixer";
import {VerificationCodeVo} from "../../../../../models/VerificationCodeVo";
import {CustomUtils} from "../../../../../_utils/CustomUtils";
import {DateTimeUtils} from "../../../../../_utils/dateTimeUtils";

@Component({
  selector: 'app-transfer-queue',
  templateUrl: './transfer-queue.component.html',
  styleUrls: ['./transfer-queue.component.css']
})
export class TransferQueueComponent implements OnInit {
  queueVo: QueueVo;
  queueId: string;
  verificationCodeVo: VerificationCodeVo;
  transferQueueUrl: string;
  countDown: number = 0;
  countDownIntervalId: any = null;

  constructor(
    private customUtils: CustomUtils,
    private activateRoute: ActivatedRoute,
    private toastService: ToastService,
    private dateTimeUtils: DateTimeUtils,
    private queueService: QueueService) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['id'];
      this.transferQueueUrl = this.customUtils.buildTransferQueueUrl(this.queueId);
      // Swal.showLoading();
      this.queueService.findByIdAndUserId(this.queueId).subscribe({
        next: queueVO => {
          if (queueVO.errcode==0){
            console.log('data', queueVO);
            this.queueVo = queueVO;
          }
          // Swal.close()

        },
        error: err => {
          // Swal.close()
          console.log('Fail', err);
          this.toastService.showErrorToast("Server Error")
        }
      });

      this.queueService.getTransferQueueCode(this.queueId).subscribe({
        next: data => {
          if (data.errcode == 0) {
            this.verificationCodeVo = data;
            this.loadCountDown(this.verificationCodeVo.createDateTime);
          }
        }, error: err => {
          this.toastService.showErrorToast("Server Error")
        }
      })
    });
  }

  generateTransferQueueCode() {
    Swal.showLoading();
    this.queueService.generateTransferQueueCode(this.queueId).subscribe({
      next: data => {
        Swal.close();
        this.verificationCodeVo = data;
        this.toastService.showSuccessToast("Operation successful");
        this.loadCountDown(this.verificationCodeVo.createDateTime);
      }, error: err => {
        Swal.close();
        this.toastService.showErrorToast("Server Error")
      }
    })
  }

  copyChecked: boolean = false;

  copyUrl(): void {
    // 创建一个临时的 input 元素
    const tempInput = document.createElement('input');
    tempInput.value = this.transferQueueUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    // 显示复制成功的提示
    this.toastService.showAlertWithSuccess('Copied successfully. You can send the link to others to transfer the queue.');
    this.copyChecked = true;
  }

  loadCountDown(createDateTime: Date) {
    let diffNowSeconds = this.dateTimeUtils.diffNowSeconds(createDateTime);
    console.log("diffNowSeconds", diffNowSeconds)
    const remainingTime = 600 + diffNowSeconds; // 剩余倒计时（秒）
    if (remainingTime> 0) {
      this.countDown = remainingTime;
      this.countDownIntervalId = setInterval(() => {
        if (this.countDown > 0) {
          this.countDown--;
        } else {
          clearInterval(this.countDownIntervalId);
          window.location.reload();
        }
      }, 1000);
    }
  }

}
