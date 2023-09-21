import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from "moment/moment";
import {Moment} from "moment/moment";
import {Router} from "@angular/router";
import {DateTimeUtils} from "../../_utils/dateTimeUtils";
import {ToastService} from "../../_helpers/toast.service";
import * as bootstrap from "bootstrap";
import 'moment/locale/zh-cn';
import {QueueVo} from "../../models/QueueVo"; // 引入中文本地化文件

@Component({
  selector: 'app-calendar[queueVo]',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input() dateStr: string;
  @Input() id: string;
  @Input() queueVo:QueueVo;
  date: Date;
  monthStr: string;
  dates: Date[] = [];
  // selectDate = this.date;
  // today: Date = new Date();

  @Output() afterDateChecked: EventEmitter<Date> = new EventEmitter();

  constructor(public router: Router,
              public dateTimeUtils: DateTimeUtils,
              private toastService: ToastService) {
    // this.date = moment(this.dateStr).toDate();
  }

  ngOnInit(): void {
    this.date = this.dateTimeUtils.parse(this.dateStr,this.queueVo.timeZone);
    this.loadCalendar();
  }


  addMonth(count: number): void {
    this.date = moment(this.date).add(count, 'month').toDate();
    this.loadCalendar();
  }

  firstDayOfMonth: Moment;
  lastDayOfMonth: Moment;

  toDay(date: Date): void {
    this.afterDateChecked.emit(date);
    // this.closeModal('calendarBackdrop');
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

  toColor(date: Date): string {
    let moment1 = moment(date);
    let before = moment1.isBefore(this.firstDayOfMonth);
    if (before) {
      return 'background-color: silver;';
    }
    let after = moment1.isAfter(this.lastDayOfMonth);
    if (after) {
      return 'background-color: silver;';
    }
    let same = moment1.isSame(new Date(), 'day');
    if (same) {
      return 'background-color: lightgreen;';
    }
    return '';
  }


  loadCalendar(): void {
    const firstDayOfMonth = moment(this.date).startOf('month');
    // console.log("firstDayOfMonth",firstDayOfMonth.calendar())
    moment.locale('zh-cn'); // 设置本地化为中文
    this.monthStr = firstDayOfMonth.format("YYYY年MM月");
    const firstDayOfCal = firstDayOfMonth.clone().startOf('week');
    this.firstDayOfMonth = firstDayOfMonth;
    const lastDayOfMonth = firstDayOfMonth.clone().endOf('month');
    this.lastDayOfMonth = lastDayOfMonth;
    const lastDayOfCal = lastDayOfMonth.clone().endOf('week');
    const temp = firstDayOfCal.clone();
    const days = [temp.toDate()];
    while (temp.isBefore(lastDayOfCal) && days.length < 42) {
      temp.add(1, 'day');
      days.push(temp.toDate());
    }
    while (days.length < 42) {
      temp.add(1, 'day');
      days.push(temp.toDate());
    }
    this.dates = days;
  }
}
