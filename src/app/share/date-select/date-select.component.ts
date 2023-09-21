import {Component, Input, OnInit} from '@angular/core';
import {QueueVo, TicketTakenDateRangeRulePo} from "../../models/QueueVo";

@Component({
  selector: 'app-date-select[dateRangeRulePo][queueVo]',
  templateUrl: './date-select.component.html',
  styleUrls: ['./date-select.component.css']
})
export class DateSelectComponent implements OnInit {
  @Input() dateRangeRulePo: TicketTakenDateRangeRulePo;
  @Input() queueVo: QueueVo;
  constructor() { }

  ngOnInit(): void {
  }

}
