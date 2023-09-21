import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DateRangeInterface, QueueVo, TicketTakenDateRangeRulePo} from "../../../models/QueueVo";
import flatpickr from "flatpickr";
import {DateTimeUtils} from "../../../_utils/dateTimeUtils";

@Component({
  selector: 'app-multiple-date[dateRange][queueVo]',
  templateUrl: './multiple-date.component.html',
  styleUrls: ['./multiple-date.component.css']
})
export class MultipleDateComponent implements OnInit, AfterViewInit {
  @Input() dateRange: DateRangeInterface;
  @Input() queueVo: QueueVo;
  @ViewChild('datePicker') datePicker: ElementRef;

  constructor(private dateTimeUtils: DateTimeUtils) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let flatpickrInstance = flatpickr(this.datePicker.nativeElement, {
      mode: 'multiple',
      dateFormat: 'Y-m-d',
      allowInput: true,
      onChange: (selectedDates) => {
        this.dateRange.dates = selectedDates.map(x => this.dateTimeUtils.yyyyMMdd(x,this.queueVo.timeZone));
      }
    });
    flatpickrInstance.setDate(this.dateRange.dates);
  }

}
