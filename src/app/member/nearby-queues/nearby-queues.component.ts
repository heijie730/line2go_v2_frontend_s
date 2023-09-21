import {Component, OnInit} from '@angular/core';
import {QueueVo} from "../../models/QueueVo";
import {QueueService} from "../../_services/queue.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../_helpers/toast.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {findTemplate} from "../../models/NotificationParam";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-nearby-queues',
  templateUrl: './nearby-queues.component.html',
  styleUrls: ['./nearby-queues.component.css']
})
export class NearbyQueuesComponent implements OnInit {
  keyword: string = '';
  page: number = 0;
  size: number = 10;
  queueVos: QueueVo[] | undefined;
  x: number = 0;
  y: number = 0;
  maxDistance: number = 5000;

  constructor(private queueService: QueueService,
              private router: Router, private toastService: ToastService,
              private modalService: NgbModal, private deviceService: DeviceDetectorService,
              private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        let keywordTmp = params['keyword'];
        let pageTmp = parseInt(params['page']);
        let sizeTmp = parseInt(params['size']);
        let maxDistanceTmp = parseInt(params['maxDistance']);
        if (keywordTmp) {
          this.keyword = keywordTmp;
        }
        if (pageTmp >= 0) {
          this.page = pageTmp;
        }
        if (sizeTmp > 0) {
          this.size = sizeTmp;
        }
        if (maxDistanceTmp > 0) {
          this.maxDistance = maxDistanceTmp;
        }
        let xTmp = parseFloat(params['x']);
        let ymp = parseFloat(params['y']);
        if (xTmp != 0 && ymp != 0) {
          this.x = xTmp;
          this.y = ymp;
          this.loadQueues();
        } else {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                this.x = position.coords.longitude;
                this.y = position.coords.latitude;
                console.log(this.x, this.y)
                this.loadQueues();
              },
              (error) => {
                console.error('Error getting location:', error);
                switch (error.code) {
                  case error.PERMISSION_DENIED:
                    // 用户拒绝了位置权限请求
                    let deviceInfo = this.deviceService.getDeviceInfo();
                    let str = '';
                    console.log(deviceInfo);
                    if (deviceInfo.os.toUpperCase() == 'IOS') {
                      str += ' Go to iPhone settings > Privacy and security > location and make sure Safari is not set to "Never"';
                    }
                    this.toastService.showAlertWithError('Please enable permissions first. Please close the page and try entering again.' + str);
                    break;
                  case error.POSITION_UNAVAILABLE:
                    // 无法获取位置信息
                    this.toastService.showAlertWithError('Location retrieval error. Please close the page and try entering again.');
                    break;
                  case error.TIMEOUT:
                    // 获取位置信息超时
                    this.toastService.showAlertWithError('Time out.');
                    break;
                }
              }
            );
          } else {
            // this.loadQueues();
            this.toastService.showAlertWithError('Unable to retrieve location information from your browser.');
          }
        }
      });

  }

  onTypeChange(event: any) {
    let templateName = event.target.value;
    console.log(templateName);
    this.router.navigate(['/member/nearby-queues'], {
      queryParams: {
        page: 0,
        size: this.size,
        keyword: this.keyword,
        x: this.x,
        y: this.y,
        maxDistance: this.maxDistance
      }
    });
  }

  search() {
    // if (!this.keyword) {
    //   this.toastService.showErrorToast("Please enter a keyword.");
    //   return;
    // }
    // console.log(this.keyword)
    this.router.navigate(['/member/nearby-queues'], {
      queryParams: {
        page: 0,
        size: this.size,
        keyword: this.keyword,
        x: this.x,
        y: this.y,
        maxDistance: this.maxDistance
      }
    });
  }

  loadQueues() {
    console.log("keyword", this.keyword);
    Swal.showLoading();
    this.queueVos = undefined;
    if (!this.x || !this.y) {
      Swal.close();
      this.toastService.showAlertWithError('Location retrieval error. Please close the page and try entering again.');
      return;
    }
    this.queueService.nearbyQueues(this.keyword, this.page, this.size, this.x, this.y, this.maxDistance).subscribe({
      next: queueVo => {
        Swal.close();
        this.queueVos = queueVo.queueVos
        console.log(this.queueVos);
      }, error: err => {
        Swal.close();
        this.toastService.showErrorToast("Operation Failed", "Server Error");
      }
    })
  }


}
