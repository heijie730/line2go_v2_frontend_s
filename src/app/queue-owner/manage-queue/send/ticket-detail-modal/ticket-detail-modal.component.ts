import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TicketVo} from "../../../../models/TicketVo";
import {Tag} from "../../../../models/QueueVo";
import {TagTicketVo} from "../../../../models/TagTicketVo";
import {TicketService} from "../../../../_services/ticket.service";
import {ToastService} from "../../../../_helpers/toast.service";
import {FilledSurveyVo} from "../../../../models/FilledSurveyVo";
import * as bootstrap from "bootstrap";

@Component({
  selector: 'app-ticket-detail-modal',
  templateUrl: './ticket-detail-modal.component.html',
  styleUrls: ['./ticket-detail-modal.component.css']
})
export class TicketDetailModalComponent implements OnInit {
  @Input() id: string;
  @Input() ticketVos: TicketVo[] = [];
  filledSurveyVo: FilledSurveyVo = new FilledSurveyVo();
  @Output() triggerDeleteTag: EventEmitter<{ tag: Tag, ticketVo: TicketVo }> = new EventEmitter();
  @Output() triggerDeleteTickets: EventEmitter<{  ticketVos: TicketVo[] }> = new EventEmitter();

  constructor(private ticketService: TicketService,
              private toastService: ToastService,) {
  }

  ngOnInit(): void {

  }

  deleteTag(tag: Tag, ticketVo: TicketVo) {
    // let tags = ticketVo.tags;
    // let number = tags.indexOf(tag);
    // ticketVo.tags = tags.splice(number);
    this.triggerDeleteTag.emit({tag: tag, ticketVo: ticketVo});
  }

  openModal(filledSurveyVo: FilledSurveyVo) {
    this.filledSurveyVo = filledSurveyVo;
    // const myModalEl = document.getElementById('fillSurveyModal');
    // if (myModalEl) {
    //   const modal = bootstrap.Modal.getInstance(myModalEl);
    //   if (modal) {
    //     modal.show();
    //   }
    // }
  }

  deleteTickets(): void {
    this.triggerDeleteTickets.emit({ticketVos: this.ticketVos});
  }
}
