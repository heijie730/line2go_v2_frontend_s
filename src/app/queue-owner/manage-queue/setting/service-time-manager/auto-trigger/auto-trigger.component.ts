import { Component, OnInit } from '@angular/core';
import {AutoTriggerServiceTimeItem, QueueVo, TicketTakenRuleItem} from "../../../../../models/QueueVo";
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../_services/queue.service";
import {ToastService} from "../../../../../_helpers/toast.service";
import {Location} from "@angular/common";
import {Duration} from "moment/moment";
import * as moment from "moment";

@Component({
  selector: 'app-auto-trigger',
  templateUrl: './auto-trigger.component.html',
  styleUrls: ['./auto-trigger.component.css']
})
export class AutoTriggerComponent implements OnInit {
  queueId: string;
  index: number;
  itemList: AutoTriggerServiceTimeItem[] = [];
  queueVo: QueueVo;
  currentItem: AutoTriggerServiceTimeItem = new AutoTriggerServiceTimeItem();
  title = "";


  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.index = params['index'];

      this.currentItem = new AutoTriggerServiceTimeItem();
      this.queueService.findById(this.queueId).subscribe(
        {
          next: queueVo => {
            this.queueVo = queueVo;
            this.itemList = this.queueVo.serviceTimeManager.autoTriggerItemList;
          }
        }
      )
    });
  }

  deleteItem(i: number) {
    this.itemList.splice(i, 1);
  }

  addOption() {
    let length = this.itemList.length;
    let item = new AutoTriggerServiceTimeItem();
    if (length > 0) {
      let lastItem = this.itemList[length - 1];
      let duration = this.calculateDuration(lastItem.startTime, lastItem.endTime);
      let startTime = lastItem.endTime; // 使用上一个项目的结束时间作为新项目的开始时间
      let endTime = this.calculateEndTime(startTime, duration); // 计算新项目的结束时间
      item.startTime = startTime;
      item.endTime = endTime;
      let preTicketNos = lastItem.ticketNos.map(x => x + lastItem.ticketNos.length);
      let waitRemoves: number[] = [];
      for (let autoTriggerServiceTimeItem of this.itemList) {
        for (let ticketNo of autoTriggerServiceTimeItem.ticketNos) {
          for (let number of preTicketNos) {
            if (number == ticketNo) {
              waitRemoves.push(number)
            }
          }
        }
      }
      item.ticketNos = preTicketNos.filter(x => !waitRemoves.includes(x)); //排除重复项
    }
    this.itemList.push(item);
  }

  calculateDuration(startTime: string, endTime: string): Duration {
    const startMoment = moment(startTime, 'HH:mm:ss');
    const endMoment = moment(endTime, 'HH:mm:ss');
    return moment.duration(endMoment.diff(startMoment));
  }

  calculateEndTime(startTime: string, duration: Duration): string {
    return moment(startTime, 'HH:mm:ss').add(duration).format('HH:mm:ss');
  }

  ticketsOnChange(item: AutoTriggerServiceTimeItem, index: number) {
    let empty = item.ticketNos.toString() == '';
    if (empty) {
      item.ticketNos = [];
    } else {
      let string = this.formatString(item.ticketNos.toString());
      let numbers = string.split(",").map(x => parseInt(x));
      console.log(numbers);
      item.ticketNos = numbers.filter((value, index, self) => {
        return self.indexOf(value) === index;
      }).sort((a, b) => a - b); //去重,排序
    }
  }

  formatString(input: string): string {
    // 使用正则表达式将字符串中的数字和非数字部分分离
    const regex = /(\d+)|([^0-9]+)/g;
    const matches = input.match(regex);

    // 处理每个匹配项
    if (matches) {
      let formattedString = '';
      for (const match of matches) {
        // 如果是数字，则添加到格式化字符串中
        if (/^\d+$/.test(match)) {
          formattedString += match + ',';
        }
      }

      // 去除最后一个逗号并返回结果
      return formattedString.slice(0, -1);
    }

    return input; // 返回原始输入，如果没有匹配项
  }

  submit(): void {

    this.queueVo.serviceTimeManager.autoTriggerItemList = this.itemList;
    this.queueService.updateServiceTimeManager(this.queueVo).subscribe({
      next: queueVo => {
        console.log('Success', queueVo);
        this.toastService.showSuccessToast('Update successful');
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");

      }
    });
  }

}
