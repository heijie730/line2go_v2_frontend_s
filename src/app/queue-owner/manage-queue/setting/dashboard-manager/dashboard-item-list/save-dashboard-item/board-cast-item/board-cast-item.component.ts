import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {QueueVo} from "../../../../../../../models/QueueVo";
import {DateTimeUtils} from "../../../../../../../_utils/dateTimeUtils";
import {QueueService} from "../../../../../../../_services/queue.service";
import {AppComponent} from "../../../../../../../app.component";
import {environment} from "../../../../../../../../environments/environment";
import {AbsBaseDraggable} from "../base-draggable/AbsBaseDraggable";
import {BoardCastLogService} from "../../../../../../../_services/board-cast-log.service";
import {BoardCastLogVo} from "../../../../../../../models/BoardCastLogVo";
import {PollingUtil} from "../../../../../../../_helpers/PollingUtil";
import {Observable, tap} from "rxjs";

@Component({
  selector: 'app-board-cast-item',
  templateUrl: './board-cast-item.component.html',
  styleUrls: ['./board-cast-item.component.css']
})
export class BoardCastItemComponent extends AbsBaseDraggable implements OnInit, OnDestroy {
  date: string;
  @Input() queueVo: QueueVo;
  boardCastLogsInterval: any;
  boardCastLogVos: BoardCastLogVo[] = [];
  // size: number;
  page: number = 0;
  size: number = 10;

  constructor(public dateTimeUtils: DateTimeUtils, private boardCastLogService: BoardCastLogService, private queueService: QueueService,) {
    super();
  }

  ngOnInit(): void {
    let boardCastSetting = this.dashboardItem.boardCastSetting;
    this.page = boardCastSetting.page;
    this.size = boardCastSetting.size;
    this.date = boardCastSetting.dateType.toDate(this.queueVo.timeZone);
    // this.size = boardCastSetting.size;
    this.loadBoardCast();
    this.loadBoardCastLogsInterval();
  }
  loadBoardCast(): void {
    this.loadBoardCastObservable().subscribe();
  }
  loadBoardCastObservable(): Observable<any> {
    return this.boardCastLogService.list(this.queueVo.id, this.date, this.page, this.size).pipe(
      tap(boardCastLogVo => {
        this.boardCastLogVos = boardCastLogVo.boardCastLogVos;
      })
    );
  }

  toPage(page: number): void {
    this.page = page;
    this.loadBoardCast();
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

  loadBoardCastLogsInterval() {
    this.pollingUtil.poll(
      () => this.loadBoardCastObservable(),
      environment.boardCastInterval,
      60000,
      1.1,
      () => AppComponent.hidden
    );
  }


  ngOnDestroy(): void {
    this.pollingUtil.stop();
    console.log("ngOnDestroy subscription");

    // clearInterval(this.boardCastLogsInterval);
    // console.log("ngOnDestroy boardCastLogsInterval", this.boardCastLogsInterval);
  }
}
