import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import * as bootstrap from "bootstrap";
import {DateTimeUtils} from "../../../_utils/dateTimeUtils";
import flatpickr from "flatpickr";
import {TicketDateEnum, TicketDateRulePo, TicketTakenRuleItem} from "../../../models/QueueVo";

@Component({
  selector: 'app-calendar-select[date]',
  templateUrl: './calendar-select.component.html',
  styleUrls: ['./calendar-select.component.css']
})
export class CalendarSelectComponent implements OnInit, AfterViewInit {
  @Input() date: string;
  // @Input() ticketDateRulePos: TicketDateRulePo[];
  @Input() ticketTakenRuleItemList: TicketTakenRuleItem[] = [];
  @Output() afterDateChecked: EventEmitter<Date> = new EventEmitter();
  // dateWithCalendar: string;
  @ViewChild('datePicker') datePicker: ElementRef;

  constructor(public dateTimeUtils: DateTimeUtils,) {
  }

  ngOnInit(): void {
    // this.dateWithCalendar = this.dateTimeUtils.toCalendarDay(this.date);
  }

  ngAfterViewInit() {
    if (!this.ticketTakenRuleItemList || this.ticketTakenRuleItemList.length == 0) {
      this.loadAny();
    } else {
      let ticketDateRulePos = this.ticketTakenRuleItemList.map(x => x.beforeTicketTaken.ticketDateRulePos).reduce((mergedDates: TicketDateRulePo[], ticketDateRulePos) => {
        return mergedDates.concat(ticketDateRulePos);
      }, []);
      let anyList = ticketDateRulePos.filter(x => x.ticketDateEnum == TicketDateEnum.ANY);
      if (anyList.length > 0) {
        this.loadAny();
      } else {
        const allDates = ticketDateRulePos.reduce((mergedDates: string[], ticketDateRulePo) => {
          return mergedDates.concat(ticketDateRulePo.dates);
        }, []);
        const uniqueDatesSet = new Set(allDates);
        const uniqueDatesArray = Array.from(uniqueDatesSet);
        this.loadDates(uniqueDatesArray);
      }
    }
  }

  loadAny() {
    // const currentDate = new Date();
    // const minDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    // const maxDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    let flatpickrInstance = flatpickr(this.datePicker.nativeElement, {
      mode: 'single',
      // minDate: minDate,
      // maxDate: maxDate,
    
      dateFormat: 'Y-m-d',
      allowInput: false,
      disableMobile: true,
      onChange: (selectedDates) => {
        console.log(selectedDates);
        this.dateChecked(selectedDates[0])
      }
    });
    // flatpickrInstance.setDate(this.date);
  }

  loadDates(dates: string[]) {
    let flatpickrInstance = flatpickr(this.datePicker.nativeElement, {
      mode: 'single',
      enable: dates,

      dateFormat: 'Y-m-d',
      allowInput: false,
      disableMobile: true,
      onChange: (selectedDates) => {
        console.log(selectedDates);
        this.dateChecked(selectedDates[0])
      }
    });
    if (!dates.includes(this.date)) {
      setTimeout(() => {
        this.date = dates[0];
      });
    }
    flatpickrInstance.setDate(this.date);

  }

  dateChecked(date: Date): void {
    this.date = this.dateTimeUtils.yyyyMMddOrigin(date);
    // this.dateWithCalendar = this.dateTimeUtils.toCalendarDay(this.date);
    // this.closeModal('calendarBackdrop');
    this.afterDateChecked.emit(date);
  }

  showModal(id: string): void {
    const myModalEl = document.getElementById(id);
    if (myModalEl) {
      const modal = new bootstrap.Modal(myModalEl);
      modal.show();
    } else {
      console.error(`Modal element with ID ${id} not found.`);
    }
  }

  closeModal(id: string): void {
    var myModalEl = document.getElementById(id);
    if (myModalEl) {
      var modal = bootstrap.Modal.getInstance(myModalEl);
      if (modal) {
        modal.hide();
      }
    }
  }
}
