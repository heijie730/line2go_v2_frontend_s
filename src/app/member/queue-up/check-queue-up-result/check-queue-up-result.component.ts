import {Component, OnDestroy, OnInit} from '@angular/core';
import {TypeEnum} from "./type.enum";
import {TicketService} from "../../../_services/ticket.service";
import {TicketVo} from "../../../models/TicketVo";
import {ActivatedRoute, Router} from "@angular/router";
import {AppComponent} from "../../../app.component";
import {environment} from "../../../../environments/environment";
import {QueueService} from "../../../_services/queue.service";
import {QueueVo} from "../../../models/QueueVo";
import {ToastService} from "../../../_helpers/toast.service";

@Component({
  selector: 'app-check-queue-up-result',
  templateUrl: './check-queue-up-result.component.html',
  styleUrls: ['./check-queue-up-result.component.css']
})
export class CheckQueueUpResultComponent implements OnInit, OnDestroy {
  type: TypeEnum = TypeEnum.PROCESSING;
  ticketVo: TicketVo;
  queueId: string;
  requestId: string;
  ticketNo: string;
  queueName: string;
  date: string;
  checkQueueUpResultInterval: any;
  queue: QueueVo;

  constructor(private activateRoute: ActivatedRoute, private ticketService: TicketService,
              private queueService: QueueService,  private toastService: ToastService,
              public router: Router) {
  }

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe(params => {
      this.queueId = params['queueId'];
      this.requestId = params['requestId'];
      this.ticketNo = params['ticketNo'];
      this.queueName = params['queueName'];
      this.date = params['date'];
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          this.queue = queueVo;
        },
        error: err => {
          console.log('Fail', err);
        }
      });
      this.loadCheckQueueUpResult();
      this.loadTicketsInterval();
    });

  }

  loadCheckQueueUpResult() {
    this.ticketService.picketUpResult(this.queueId, this.requestId).subscribe({
      next: data => {
        console.log(data);
        this.ticketVo = data;
        if (data.errcode == 0) {
          this.type = TypeEnum.SUCCESS;
          this.ticketNo = data.ticketNo + '';
          this.clearTimeInterval();
          // this.buildToMiniApp();
        } else if (data.errcode == 1033) {
          this.type = TypeEnum.PROCESSING;
        } else if (data.errcode == 1010) {
          this.type = TypeEnum.FAIL;
          this.clearTimeInterval();
        } else if (data.errcode == 1037) {
          this.type = TypeEnum.TIME_OUT;
          this.clearTimeInterval();
        }
      }
    })
  }

  loadTicketsInterval(): void {
    this.checkQueueUpResultInterval = setInterval(() => {
      if (!AppComponent.hidden) {
        this.loadCheckQueueUpResult();
      }
    }, environment.checkQueueUpResultInterval);
  }

  ngOnDestroy(): void {
    this.clearTimeInterval();
  }

  clearTimeInterval() {
    clearInterval(this.checkQueueUpResultInterval);
    console.log("ngOnDestroy checkQueueUpResultInterval", this.checkQueueUpResultInterval);
  }
}
