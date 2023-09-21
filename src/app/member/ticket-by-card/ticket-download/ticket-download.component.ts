import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TicketService} from "../../../_services/ticket.service";
import {ToastService} from "../../../_helpers/toast.service";
import {TicketVo} from "../../../models/TicketVo";
import html2canvas from "html2canvas";
import {Location} from "@angular/common";
import {QueueService} from "../../../_services/queue.service";
import {QueueVo} from "../../../models/QueueVo";

@Component({
  selector: 'app-ticket-download',
  templateUrl: './ticket-download.component.html',
  styleUrls: ['./ticket-download.component.css']
})
export class TicketDownloadComponent implements OnInit {

  ticketVo: TicketVo;
  queueVo: QueueVo;

  constructor(private location: Location, private activateRoute: ActivatedRoute,
              private ticketService: TicketService,
              private queueService: QueueService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      let queueId = params['queueId'];
      let ticketId = params['ticketId'];
      this.queueService.findById(queueId).subscribe({
        next: queueVo => {
          this.queueVo = queueVo;
        }
      })
      this.ticketService.findById(ticketId).subscribe({
        next: ticketVo => {
          if (ticketVo.errcode == 0) {
            this.ticketVo = ticketVo;
          }
        },
        error: err => {
          this.toastService.showErrorToast("Operation Failed", "Server Error");
        }
      })
    });
  }

  back(): void {
    this.location.back()
  }

  initHtml2Img(ticket: TicketVo): void {
    if (!ticket.imgData) {
      let element = document.getElementById(ticket.id);
      if (element) {
        html2canvas(element).then(function (canvas) {
          ticket.imgData = canvas.toDataURL();
          // console.log("initHtml2Img", ticket.imgData);
        });
      }
    }
  }

}
