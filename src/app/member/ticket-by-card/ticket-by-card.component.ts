import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TicketVo} from "../../models/TicketVo";
import html2canvas from "html2canvas";
import {TicketService} from "../../_services/ticket.service";
import {QueueService} from "../../_services/queue.service";
import {ToastService} from "../../_helpers/toast.service";
import {QueueVo} from "../../models/QueueVo";

// import {NgxPrinterService} from "ngx-printer";

@Component({
  selector: 'app-ticket-by-card',
  templateUrl: './ticket-by-card.component.html',
  styleUrls: ['./ticket-by-card.component.css']
})
export class TicketByCardComponent implements OnInit {
  @Input() ticketVo: TicketVo;
  @Input() queueVo: QueueVo;
  @Output() afterRefundSuccess: EventEmitter<any> = new EventEmitter();

  attachMsg: string;

  h2c: any = html2canvas;
  cloneTicketVo: TicketVo;

  constructor(private ticketService: TicketService,
              private queueService: QueueService,
              // private printerService: NgxPrinterService,
              private toastService: ToastService,) {
  }

  ngOnInit(): void {
    this.cloneTicketVo = Object.assign({}, this.ticketVo);

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

  refundTicket(id: string, queueId: string): void {
    this.toastService.showConfirmAlert("Are you sure you want to refund the ticket?", () => {
      this.ticketService.refundTicket(id, queueId).subscribe({
        next: result => {
          console.log('Ticket data', result);
          if (result.errcode == 0) {
            this.afterRefundSuccess.emit(result);
          }
        },
        error: err => {
          console.log('Refund Failed', err);
        }
      });
    });
  }

  attachMsgOnchange(): void {
    // this.cloneTicketVo.ticketMsg.content += this.attachMsg;
  }

  submit() {

  }
  isDropdownMenuVisible(): boolean {
    // 如果所有的条件都不满足，返回false，否则返回true
    return this.queueVo && (
      this.queueVo.memberOptions.ticketSetting.downloadTicket ||
      this.queueVo.memberOptions.ticketSetting.memberAttachTypeEnum != 'NOT_ALLOW_ATTACH' ||
      this.queueVo.memberOptions.ticketSetting.refundTypeEnum != 'NOT_ALLOW_REFUND'
    );
  }

}
