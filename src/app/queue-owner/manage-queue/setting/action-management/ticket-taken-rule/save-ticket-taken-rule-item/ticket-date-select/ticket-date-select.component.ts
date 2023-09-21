import {Component, Input, OnInit} from '@angular/core';
import {QueueVo, TicketDateRulePo} from "../../../../../../../models/QueueVo";

@Component({
  selector: 'app-ticket-date-select[ticketDateRulePo][queueVo]',
  templateUrl: './ticket-date-select.component.html',
  styleUrls: ['./ticket-date-select.component.css']
})
export class TicketDateSelectComponent implements OnInit {
  @Input() ticketDateRulePo: TicketDateRulePo;
  @Input() queueVo: QueueVo;
  constructor() { }

  ngOnInit(): void {
  }

}
