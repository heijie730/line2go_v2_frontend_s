import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TimeRange} from "../../models/QueueVo";
import flatpickr from "flatpickr";
import {ToastService} from "../../_helpers/toast.service";
import {v4 as uuidv4} from "uuid";


@Component({
  selector: 'app-time-range',
  templateUrl: './time-range.component.html',
  styleUrls: ['./time-range.component.css']
})
export class TimeRangeComponent implements OnInit, AfterViewInit , OnChanges{
  @Input() timeRange: TimeRange;
  private startDateInput: HTMLInputElement;
  private endDateInput: HTMLInputElement;
  startTimeId: string = uuidv4();
  endTimeId: string = uuidv4();

  constructor(private toastService: ToastService,) {
  }

  ngOnInit(): void {
    console.log(this.timeRange)
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['timeRange']) {
      console.log('timeRange has changed:', changes['timeRange'].currentValue);
      if (this.startDateInput){
        this.initializeFlatpickr();
      }
    }
  }
  ngAfterViewInit() {
    this.startDateInput = document.getElementById(
      this.startTimeId
    ) as HTMLInputElement;
    this.endDateInput = document.getElementById(
      this.endTimeId
    ) as HTMLInputElement;
    this.initializeFlatpickr();
  }

  initializeFlatpickr() {
    const startTimePicker = flatpickr(this.startDateInput, {
      enableTime: true,

      noCalendar: true,
      dateFormat: "H:i:S",
      allowInput: true,
      defaultDate: this.timeRange.startTime,
      disableMobile: true,
      time_24hr: true,
      enableSeconds: true
    },);

    const endTimePicker = flatpickr(this.endDateInput, {
      enableTime: true,

      noCalendar: true,
      dateFormat: "H:i:S",
      allowInput: true,
      defaultDate: this.timeRange.endTime,
      disableMobile: true,
      time_24hr: true,
      enableSeconds: true
    });

    // 添加 onChange 事件处理程序
    // startTimePicker.config.onChange.push((selectedDates) => {
    //   const startTime = selectedDates[0];
    //   const endTime = endTimePicker.selectedDates[0];
    //   this.timeRange.startTime = this.toTime(startTime);
    //   this.timeRange.endTime = this.toTime(endTime);
    //   if (endTime && startTime > endTime) {
    //     this.toastService.showErrorToast("开始时间必须小于结束时间")
    //   } else {
    //     // 清除错误提示
    //     console.log("开始时间正确");
    //   }
    // });

    // endTimePicker.config.onChange.push((selectedDates) => {
    //   const startTime = startTimePicker.selectedDates[0];
    //   const endTime = selectedDates[0];
    //   this.timeRange.startTime = this.toTime(startTime);
    //   this.timeRange.endTime = this.toTime(endTime);
    //   if (startTime && startTime > endTime) {
    //     this.toastService.showErrorToast("结束时间必须大于开始时间")
    //   } else {
    //     // 清除错误提示
    //     console.log("结束时间正确");
    //   }
    // });
  }

  toTime(selectedDate: Date): string {
    const hours = selectedDate.getHours().toString().padStart(2, "0");
    const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
    const seconds = selectedDate.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }
}
