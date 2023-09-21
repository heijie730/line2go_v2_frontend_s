import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { QueueService } from "../../_services/queue.service";
import { DateTimeUtils } from "../../_utils/dateTimeUtils";
import { QueueVo } from "../../models/QueueVo";
import { ToastService } from "../../_helpers/toast.service";
import * as bootstrap from "bootstrap";
import { AppComponent } from "../../app.component";
import { environment } from "../../../environments/environment";
import { BoardCastLogVo, BoardCastType, RoleEnum } from "../../models/BoardCastLogVo";
import Swal from "sweetalert2";
import { BoardCastLogService } from "../../_services/board-cast-log.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotificationParam} from "../../models/NotificationParam";
import {Observable, tap} from "rxjs";
import {PollingUtil} from "../../_helpers/PollingUtil";

@Component({
  selector: 'app-board-cast[queueVo][date][role]',
  templateUrl: './board-cast.component.html',
  styleUrls: ['./board-cast.component.css']
})
export class BoardCastComponent implements OnInit, OnDestroy {
  @Input() queueVo: QueueVo;
  @Input() date: string;
  @Input() role: RoleEnum;
  @Input() ticketNo: number;
  @Output() triggerLoadBoardCastLogs: EventEmitter<BoardCastLogVo[]> = new EventEmitter();
  boardCastLogVos: BoardCastLogVo[] = [];
  chooseValue: string;
  answerValue: string;
  haveQuestions: boolean = false;
  boardCastLogsInterval: any;
  boardCast: string;
  page: number = 0;
  size: number = 20;
  @ViewChild('scrollable') scrollable: ElementRef;

  constructor(private queueService: QueueService,
              private toastService: ToastService,
              private boardCastLogService: BoardCastLogService,
              private modalService: NgbModal,
              public dateTimeUtils: DateTimeUtils) {
  }

  ngOnInit(): void {
    this.loadBoardCast();
    this.loadBoardCastLogsInterval();
    this.haveQuestions = this.queueVo.statusByMember.statusByQuestions.length > 0;
  }
  loadBoardCast(): void {
    this.loadBoardCastObservable().subscribe();
  }
  loadBoardCastObservable(): Observable<any>  {
    return  this.boardCastLogService.list(this.queueVo.id, this.date, this.page, this.size) .pipe(
      tap(boardCastLogVo => {
        console.log("loadBoardCast", boardCastLogVo)
        this.boardCastLogVos = boardCastLogVo.boardCastLogVos;
        this.triggerLoadBoardCastLogs.emit(this.boardCastLogVos);
      })
    );
  }

  toPage(page: number): void {
    this.page = page;
    this.loadBoardCast();
  }

  isScrolledToTop(): boolean {
    if (!this.scrollable) {
      return false;
    }

    const element = this.scrollable.nativeElement;
    return element.scrollTop === 0;
  }

  isScrolledToBottom(): boolean {
    if (!this.scrollable) {
      return false;
    }

    const element = this.scrollable.nativeElement;
    return element.scrollHeight - element.scrollTop === element.clientHeight;
  }

  onScroll(event: any) {
    if (this.isScrolledToBottom()) {
      console.log('Scrolled to bottom');
      this.size = this.size + 20;
      this.loadBoardCast();
    } else {
      console.log('Not scrolled to bottom');
    }
  }

  // loadBoardCastLogsInterval(): void {
  //   this.boardCastLogsInterval = setInterval(() => {
  //     if (!AppComponent.hidden) {
  //       this.loadBoardCast();
  //     }
  //   }, environment.boardCastInterval);
  //   console.log("boardCastLogsInterval", this.boardCastLogsInterval);
  // }

  pollingUtil = new PollingUtil();

  loadBoardCastLogsInterval(){
    this.pollingUtil.poll(
      () => this.loadBoardCastObservable(),
      environment.boardCastInterval,
      60000,
      1.1,
      () => AppComponent.hidden
    );
  }

  cleanBoardCast(): void {
    this.boardCast = '';
  }
  postBoardCast(): void {
    if (!this.boardCast) {
      this.toastService.showWarningToast("Please enter content");
      return;
    }
    let boardCastLogVo = new BoardCastLogVo();
    boardCastLogVo.queueId = this.queueVo.id;
    boardCastLogVo.date = this.date;
    boardCastLogVo.text = this.boardCast;
    boardCastLogVo.type = BoardCastType.CUSTOM_MESSAGE;
    boardCastLogVo.role = this.role;
    if (this.role == RoleEnum.MEMBER) {
      boardCastLogVo.ticketNo = this.ticketNo;
      boardCastLogVo.nickName ="No."+ this.ticketNo ;
    }
    if (this.role == RoleEnum.LEADER) {
      boardCastLogVo.nickName = this.queueVo.nickName;
    }
    console.log("boardCastLogVo", boardCastLogVo);
    this.boardCastLogService.create(boardCastLogVo).subscribe({
      next: result => {
        console.log(result);
        this.toastService.showSuccessToast("Posted successfully");
        this.loadBoardCast();
        this.closeModal("postBroadCastModal");
      }
    });
  }

  save(): void {
    if (!this.chooseValue) {
      this.toastService.showErrorToast("Please select a question");
      return;
    }
    if (!this.answerValue) {
      this.toastService.showErrorToast("Please enter content");
      return;
    }
    let boardCastLogVo = new BoardCastLogVo();
    boardCastLogVo.queueId = this.queueVo.id;
    boardCastLogVo.date = this.date;
    boardCastLogVo.title = this.chooseValue;
    boardCastLogVo.text = this.answerValue;
    boardCastLogVo.role = this.role;
    boardCastLogVo.type = BoardCastType.CUSTOM_MESSAGE;
    if (this.role == RoleEnum.MEMBER) {
      boardCastLogVo.ticketNo = this.ticketNo;
      boardCastLogVo.nickName ="No."+ this.ticketNo ;
    }
    if (this.role == RoleEnum.LEADER) {
      boardCastLogVo.nickName = this.queueVo.nickName;
    }
    this.boardCastLogService.create(boardCastLogVo)
      .subscribe({
        next: result => {
          console.log(result);
          this.toastService.showSuccessToast("Posted successfully");
          this.loadBoardCast();
          this.closeModal("publishStatusModal");
          this.answerValue = "";
        }
      });
    console.log("chooseValue", this.chooseValue);
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

  clearBoardCast() {
    Swal.fire({
      title: 'Clear the broadcast?',
      showConfirmButton: false,
      showDenyButton: true,
      showCancelButton: true,
      denyButtonText: `Clear`,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isDenied) {
        this.boardCastLogService.deleteByQueueIdAndDate(this.queueVo.id, this.date).subscribe({
          next: result => {
            console.log(result);
            if (result.errcode == 0) {
              this.toastService.showSuccessToast("Broadcast cleared");
              this.boardCastLogVos = [];
            }
          }
        });
      }
    });
  }
  notificationSwitch(notificationSwitchModal:any){
    this.modalService.open(notificationSwitchModal);
  }

  ngOnDestroy(): void {
    this.pollingUtil.stop();
    console.log("ngOnDestroy subscription");

    // clearInterval(this.boardCastLogsInterval);
    // console.log("ngOnDestroy boardCastLogsInterval", this.boardCastLogsInterval);
  }
}
