import {Component, OnDestroy, OnInit} from '@angular/core';
import {QueueService} from "../../_services/queue.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TokenStorageService} from "../../_services/token-storage.service";
import {ToastService} from "../../_helpers/toast.service";
import {QueueVo} from "../../models/QueueVo";
import {FilledSurveyService} from "../../_services/filled-survey.service";
import {FilledSurveyVo} from "../../models/FilledSurveyVo";
import {DateTimeUtils} from "../../_utils/dateTimeUtils";
import {QueueUpVo} from "../../models/QueueUpVo";
import * as bootstrap from "bootstrap";
import {TicketService} from "../../_services/ticket.service";
import {TicketVo} from "../../models/TicketVo";
import {RuleFireStatus, RuleResultVo} from "../../models/RuleResultVo";
import {environment} from "../../../environments/environment";
import {TextType} from "../../models/RichTextVo";
import {Location} from "@angular/common";

// import {AngularFireAuth} from "@angular/fire/compat/auth";
declare var WeixinJSBridge: any;

@Component({
  selector: 'app-queue-up',
  templateUrl: './queue-up.component.html',
  styleUrls: ['./queue-up.component.css']
})
export class QueueUpComponent implements OnInit, OnDestroy {
  queue: QueueVo;
  queueId: string;
  date: string;
  surveyId: string;
  filledSurveyVo: FilledSurveyVo;
  page: number = 0;
  size: number = 35;
  skip: number = -1;
  ticketVos: TicketVo[] = [];
  ticketNo: string;
  currentTicket: TicketVo | null;
  queueDesc: string;
  ruleResultVo: RuleResultVo = new RuleResultVo();

//先查看详情，当点击排队时，再检查是否登录和注册。
  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private tokenStorageService: TokenStorageService,
              private filledSurveyService: FilledSurveyService,
              private ticketService: TicketService,
              public router: Router,
              private dateTimeUtils: DateTimeUtils,
              private toastService: ToastService,
              private location: Location,
              // private angularFireAuth: AngularFireAuth,
  ) {

  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy");

  }

  ngOnInit(): void {
    console.log("preCheckResult", this.ruleResultVo)
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      let date = params['date'];
      if (date) {
        this.date = date;
        this.loadQueue();
      } else {
        let loadDateFn = () => {
          let date1 = new Date();
          let yyyyMMdd = this.dateTimeUtils.yyyyMMdd(date1, this.queue.timeZone);
          this.date = yyyyMMdd;
        }
        this.loadQueue(loadDateFn);
      }
      // this.ticketService.findMyTicket()
      this.loadQueueDesc();
    });
    this.activateRoute.queryParams.subscribe(params => {
      let filledSurveyId = params['filledSurveyId'];
      this.ticketNo = params['ticketNo']; //有时候可能传过来的号码已经被领取，但没关系，因为check-queue-up-result会返回错误。

      if (filledSurveyId) {
        this.filledSurveyService.findById(filledSurveyId).subscribe({
          next: filledSurveyVo => {
            this.filledSurveyVo = filledSurveyVo;
            console.log('Success', filledSurveyVo);
          },
          error: err => {
            this.toastService.showErrorToast("Operation Failed", "Server Error");
          }
        });
      }
    });
  }

  loadQueue(loadDateFn?:() => void) {
    this.queueService.preCheckTicketTaken(this.queueId, this.date).subscribe({
      next: result => {
        console.log("preCheckTicketTaken", result)
        this.ruleResultVo = result;
      },
      error: err => {
        console.log('Fail', err);
      }
    })
    this.queueService.findById(this.queueId).subscribe({
      next: queueVo => {
        console.log('data', queueVo);
        this.queue = queueVo;
        if (loadDateFn){
          loadDateFn();
        }
        this.surveyId = this.queue.surveyPoId;
        this.loadTicket();
      },
      error: err => {
        console.log('Fail', err);
      }
    });
  }

  loadQueueDesc() {
    this.queueService.findRichText(this.queueId, TextType.QUEUE_DESC).subscribe({
      next: queueDescVo => {
        console.log('data', queueDescVo);
        if (queueDescVo.errcode == 0) {
          this.queueDesc = queueDescVo.content;
        }
      },
      error: err => {
        console.log('Fail', err);
      }
    });
  }

  onSubmit(): void {
    if (!this.ticketNo) {
      this.toastService.showErrorToast("Please select a ticket.");
      return;
    }
    if (!this.date) {
      this.toastService.showErrorToast("Please select a date.");
      return;
    }
    let queueUpVo = new QueueUpVo();
    queueUpVo.id = this.queueId;
    queueUpVo.date = this.date;
    if (this.ticketNo != 'Auto') {
      queueUpVo.ticketNo = parseInt(this.ticketNo);
    }
    if (this.surveyId) {
      if (!this.filledSurveyVo) {
        this.toastService.showErrorToast('You must fill out the survey first.');
        return;
      }
      queueUpVo.filledSurveyVo = this.filledSurveyVo;
    }
    this.ticketService.tryPickUpTicket(queueUpVo).subscribe({
      next: ticketVo => {
        console.log('Success', ticketVo);
        let requestId = ticketVo.ticketUserInfo.requestId;
        this.router.navigate(['/member/check-queue-up-result']
          , {
            queryParams: {
              queueId: this.queueId, requestId: requestId, ticketNo: this.ticketNo,
              queueName: this.queue.queueName, date: this.date
            }
          });
      },
      error: err => {
        this.toastService.showErrorToast('Queueing failed.');
      }
    });
  }

  afterDateChecked(date: Date): void {
    this.date = this.dateTimeUtils.yyyyMMddOrigin(date);
    // this.closeModal('calendarBackdrop');
    this.loadQueue();
    this.page = 0;
    this.ticketNo = '';
  }

  afterSubscribed(): void {
  }

  addPage(count: number) {
    let number = this.page + count;
    if (number >= 0) {
      this.page = number;
    } else {
      this.page = 0;
    }
    this.loadTicket();
  }

  chooseTicketNo(ticketVo: TicketVo | null) {
    this.currentTicket = ticketVo;
    if (ticketVo == null) {
      this.ticketNo = 'Auto';
    } else {
      this.ticketNo = ticketVo.ticketNo.toString();
    }
    this.closeModal("ticketModal");
  }

  loadTicket(): void {
    let ticketVoParam = new TicketVo();
    ticketVoParam.queueId = this.queueId;
    ticketVoParam.ticketDate = this.date;
    // ticketVoParam.tags = this.queue.ticketTags.tagsOnGenerate;
    if (this.queue.allowUserCreateTicket) {
      if (this.page == 0) {
        this.size = 34;
        this.skip = 0;
      } else {
        this.size = 35;
        this.skip = (this.page - 1) * 35 + 34;
      }
    }
    this.ticketService.findUsableTickets(ticketVoParam, this.page, this.size, this.skip).subscribe({
      next: result => {
        console.log('Success', result);
        this.ticketVos = result.ticketVos;
        // this.ticketNo = '';
      }
    })
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

  toBack(): void {
    this.location.back();
  }
}
