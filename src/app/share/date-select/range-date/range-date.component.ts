import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import flatpickr from "flatpickr";
import {QueueVo, TicketTakenDateRangeRulePo} from "../../../models/QueueVo";
import {DateTimeUtils} from "../../../_utils/dateTimeUtils";

@Component({
  selector: 'app-range-date[dateRangeRulePo][queueVo]',
  templateUrl: './range-date.component.html',
  styleUrls: ['./range-date.component.css']
})
export class RangeDateComponent implements OnInit, AfterViewInit {
  @Input() dateRangeRulePo: TicketTakenDateRangeRulePo;
  @ViewChild('datePicker') datePicker: ElementRef;
  @Input() queueVo: QueueVo;

  constructor(private dateTimeUtils: DateTimeUtils) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let flatpickrInstance = flatpickr(this.datePicker.nativeElement, {
      mode: 'range',
      dateFormat: 'Y-m-d',
      allowInput:true,
      onChange: (selectedDates) => {
        console.log(selectedDates)
        //fixme selectedDates 格式为2023-07-08 to 2023-07-18，如何设置to为-？
        this.dateRangeRulePo.dates = selectedDates.map(x => this.dateTimeUtils.yyyyMMdd(x,this.queueVo.timeZone));
      }
    });
    flatpickrInstance.setDate(this.dateRangeRulePo.dates);
  }
}
