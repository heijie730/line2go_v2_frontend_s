import {Component, Input, OnInit} from '@angular/core';
import {TicketVo} from "../../../models/TicketVo";
import {QueueVo} from "../../../models/QueueVo";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-ticket-v2[queueVo]',
  templateUrl: './ticket-v2.component.html',
  styleUrls: ['./ticket-v2.component.css']
})
export class TicketV2Component implements OnInit {
  @Input() queueVo:QueueVo;
  @Input() ticketVo: TicketVo;
  @Input() qrCodeData: string;

  constructor(  private modalService: NgbModal) { }

  ngOnInit(): void {
    // let ticketId = this.ticketVo.id;
    // this.memberScanResultUrl = `${ticketId}`;
  }
  previewFillSurvey(fillSurveyModal:any){
    this.modalService.open(fillSurveyModal);
  }

}
