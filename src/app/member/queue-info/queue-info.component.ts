import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { TicketService } from "../../_services/ticket.service";
import { QueueService } from "../../_services/queue.service";
import { BoardCastLogVo, RoleEnum } from "../../models/BoardCastLogVo";
import { TicketVo } from "../../models/TicketVo";
import { QueueVo, Tag } from "../../models/QueueVo";
import html2canvas from "html2canvas";
import * as bootstrap from 'bootstrap';
import { SafeUrl } from "@angular/platform-browser";
import { FindMyTicketVo } from "../../models/FindMyTicketVo";
import { ToastService } from "../../_helpers/toast.service";
import { AppComponent } from "../../app.component";
import { environment } from "../../../environments/environment";
import Swal from "sweetalert2";
import {Observable, tap} from "rxjs";
import {PollingUtil} from "../../_helpers/PollingUtil";

@Component({
  selector: 'app-queue-info',
  templateUrl: './queue-info.component.html',
  styleUrls: ['./queue-info.component.css']
})
export class QueueInfoComponent implements OnInit, OnDestroy {
  ticketVo: TicketVo;
  queue: QueueVo;

  // ticketDate: string;

  queueId: string;
  date: string;
  ticketInterval: any;

  allowMemberPublishStatus: boolean = false;
  firstTicketNo: number;
  turnInfo: string = '';
  RoleEnum = RoleEnum;

  constructor(private activateRoute: ActivatedRoute,
              private ticketService: TicketService,
              private queueService: QueueService,
              private toastService: ToastService,
              public router: Router) {

  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.date = params['date'];

      // findMyTicketVo.busKey = this.busKey;
      this.loadTickets();
      this.loadTicketsInterval();
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          this.queue = queueVo;
          this.allowMemberPublishStatus = this.queue.statusByMember.allowMemberPublishStatus;
          console.log('data queue', queueVo);
        }
      });
    });
  }

  // loadTicketsInterval(): void {
  //   this.ticketInterval = setInterval(() => {
  //     if (!AppComponent.hidden) {
  //       this.loadTickets();
  //     }
  //   }, environment.memberTicketInterval);
  // }

  pollingUtil = new PollingUtil();

  loadTicketsInterval(){
    this.pollingUtil.poll(
      () => this.loadTicketsObservable(),
      environment.memberTicketInterval,
      60000,
      1.1,
      () => AppComponent.hidden
    );
  }

  ngOnDestroy(): void {
    this.pollingUtil.stop();
    console.log("ngOnDestroy subscription");

    // clearInterval(this.ticketInterval);
    // console.log("ngOnDestroy ticketInterval", this.ticketInterval);
  }
  loadTickets(): void {
    this.loadTicketsObservable().subscribe();
  }

  loadTicketsObservable(): Observable<any> {
    let findMyTicketVo = new FindMyTicketVo();
    findMyTicketVo.queueId = this.queueId;
    findMyTicketVo.date = this.date;
    return this.ticketService.findMyTicketList(findMyTicketVo).pipe(
      tap(ticketVo => {
        console.log('data ticket', ticketVo);
        if (ticketVo.errcode == 1010) {
          this.toastService.showWarningToast("No ticket found");
          return;
        }
        this.ticketVo = ticketVo;
        if (this.ticketVo.ticketVos.length > 0) {
          this.firstTicketNo = this.ticketVo.ticketVos[0].ticketNo;
        }
        // this.ticketDate = this.ticketVo.ticketDate;

      })
    );

  }

  afterRefundSuccess(ticket: TicketVo): void {
    console.log("after refund success", ticket)
    this.toastService.showSuccessToast("Successfully refunded ticket");
    this.loadTickets();
  }

  afterSubscribed(): void {
    this.closeModal('staticBackdrop');
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

  confirmArray: number[] = [];

  isArraySubset(arr: Tag[], subset: Tag[]): boolean {
    return subset.every(item => arr.map(x => x.tagContent).includes(item.tagContent));
  }

  afterLoadBoardCastLogs(boardCastLogVos: BoardCastLogVo[]) {
    // let turnNoArray = [] as number[];
    // if (this.ticketVo && this.ticketVo.ticketVos) {
    //   for (let ticketVO of this.ticketVo.ticketVos) {
    //     let some = false;
    //     for (let ticketEndRuleItem of ticketEndRuleItemList) {
    //       let subset = this.isArraySubset(ticketVO.tags, ticketEndRuleItem.endTags);
    //       if (subset) {
    //         some = true;
    //       }
    //     }
    //     if (!some) {
    //       let membersList = boardCastLogVos.filter(x => x.members != null && x.members.length > 0).map(x => x.members);
    //       let include = membersList.filter(x => x.includes(ticketVO.ticketNo));
    //       if (include.length > 0) {
    //         turnNoArray.push(ticketVO.ticketNo)
    //       }
    //     }
    //   }
    // }
    // if (turnNoArray.length > 0) {
    //   let join = turnNoArray.join(",");
    //   let s = "你是" + join + "号，现在轮到你了！！！";
    //   this.turnInfo = s;
    //   if (this.confirmArray.length != turnNoArray.length) {
    //     this.toastService.showAlertWithSuccess(s);
    //     this.confirmArray = turnNoArray;
    //   }
    // } else {
    //   this.turnInfo = "";
    // }

  }
}
