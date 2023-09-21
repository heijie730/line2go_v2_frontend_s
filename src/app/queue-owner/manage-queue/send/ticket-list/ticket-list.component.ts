import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TicketVo} from "../../../../models/TicketVo";
import {ToastService} from "../../../../_helpers/toast.service";
import html2canvas from "html2canvas";
import {SurveyService} from "../../../../_services/survey.service";
import {QueueService} from "../../../../_services/queue.service";
import {TicketService} from "../../../../_services/ticket.service";
import * as JSZip from "jszip";
import {saveAs} from "file-saver";
import {Location} from "@angular/common";
import {QueueVo} from "../../../../models/QueueVo";
import Swal from "sweetalert2";

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit, AfterViewInit {
  ticketVos: TicketVo[] = [];
  h2c: any = html2canvas;
  queueId: string;
  isLoading = false;  // 控制 spinner 的显示和隐藏的变量
  queueVo: QueueVo;

  constructor(private activateRoute: ActivatedRoute,
              private surveyService: SurveyService,
              private queueService: QueueService,
              private toastService: ToastService,
              private ticketService: TicketService,
              private location: Location) {
    // let currentNavigation = this.router.getCurrentNavigation();
    // if (currentNavigation && currentNavigation.extras && currentNavigation.extras.state) {
    //   this.allCheckedTickets = currentNavigation.extras.state as TicketVO[];
    // } else {
    //   this.toastService.showErrorToast("Error", "please select tickets first");
    // }

  }

  ngOnInit(): void {
    Swal.showLoading();
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.queueService.findById(this.queueId ).subscribe({
        next: queueVo => {
          Swal.close();
          this.queueVo = queueVo;
        },error:err => {
          Swal.close();
          this.toastService.showErrorToast("Network error, please try again");
        }
      })
      this.activateRoute.queryParams.subscribe(params => {
        let ticketNos = params['ticketNos'];
        let date = params['date'];
        console.log(ticketNos, date)
        this.ticketService.findByTicketNos(this.queueId, date, ticketNos.split(","))
          .subscribe(data => {
              console.log(data)
              this.ticketVos = data.ticketVos;
            }
          );
      });

    });


  }

  ngAfterViewInit() {
    // console.log("ngAfterViewInit", this.ticketVos);
    // for (let ticketVo of this.ticketVos) {
    //   this.initHtml2Img(ticketVo);
    //   console.log("ngAfterViewInit", ticketVo);
    // }
  }

  async initHtml2Img2() {
    for (let ticketVo of this.ticketVos) {
      await this.initHtml2Img(ticketVo);
    }
  }

  async initHtml2Img(ticket: TicketVo) {
    // let b = !this.capturedImage;
    // console.log("initHtml2Img b", b, this.capturedImage)
    if (!ticket.imgData) {
      // this.h2c(document.getElementById(ticket.id))
      //   .then((canvas: { toDataURL: () => any; toBlob: (arg0: (blob: Blob) => void) => void; }) => {
      //     ticket.imgData = canvas.toDataURL();
      //     console.log("initHtml2Img", ticket);
      //   });
      const value = await this.h2c(document.getElementById(ticket.id));
      ticket.imgData = value.toDataURL();
    }
  }

  downloadAll(): void {
    this.isLoading = true; // 开始时显示 spinner
    this.initHtml2Img2().then(() => {
      var zip = new JSZip();
      for (let i = 0; i < this.ticketVos.length; i++) {
        let ticketVo = this.ticketVos[i];
        zip.file(ticketVo.queueName + "-" + ticketVo.ticketNo + ".png", this.dataURLtoBlob(ticketVo.imgData));
      }
      zip.generateAsync({type: "blob"}).then((content) => {
        saveAs(content, "tickets.zip");
        this.isLoading = false; // 结束时隐藏 spinner
      });
    }).catch(() => {
      this.isLoading = false; // 如果发生错误也要隐藏 spinner
    });
  }


  dataURLtoBlob(dataurl: any) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }

  back(): void {
    this.location.back()
  }
}
