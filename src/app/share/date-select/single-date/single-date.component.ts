import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DateTimeUtils} from "../../../_utils/dateTimeUtils";
import flatpickr from "flatpickr";

@Component({
  selector: 'app-single-date',
  templateUrl: './single-date.component.html',
  styleUrls: ['./single-date.component.css']
})
export class SingleDateComponent implements OnInit, AfterViewInit {
  @Input() date: string;
  @Output() afterDateChecked: EventEmitter<Date> = new EventEmitter();
  @ViewChild('datePicker') datePicker: ElementRef;

  constructor(private dateTimeUtils: DateTimeUtils) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }

  loadAny() {
    let flatpickrInstance = flatpickr(this.datePicker.nativeElement, {
      mode: 'single',
      dateFormat: 'Y-m-d',
      allowInput: true,
      disableMobile: true,
      onChange: (selectedDates) => {
        // let map = selectedDates.map(x => this.dateTimeUtils.yyyyMMdd(x));
        console.log(selectedDates);
        this.afterDateChecked.emit(selectedDates[0]);
      }
    });
    flatpickrInstance.setDate(this.date);
  }
}
