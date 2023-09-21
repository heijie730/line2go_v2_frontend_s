import {Component, Input, OnInit} from '@angular/core';
import {TicketMsgManager} from "../../../../../models/QueueVo";

@Component({
  selector: 'app-ticket-msg',
  templateUrl: './ticket-msg.component.html',
  styleUrls: ['./ticket-msg.component.css']
})
export class TicketMsgComponent implements OnInit {
  @Input() ticketMsgManager: TicketMsgManager;

  constructor() {
  }

  ngOnInit(): void {
  }

}
