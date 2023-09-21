import { Component, OnInit } from '@angular/core';
import {
  BoardCastManager,
  BoardCastQuestion,
  QueueVo,
  StatusByQuestion,
  TicketSetting
} from "../../../../models/QueueVo";
import { ActivatedRoute, Router } from "@angular/router";
import { QueueService } from "../../../../_services/queue.service";
import { ToastService } from "../../../../_helpers/toast.service";
// import { SmsSubscriptionService } from "../../../../_services/sms-subscription.service";
import { Location } from "@angular/common";

@Component({
  selector: 'app-board-cast-manager',
  templateUrl: './board-cast-manager.component.html',
  styleUrls: ['./board-cast-manager.component.css']
})
export class BoardCastManagerComponent implements OnInit {

  queueId: string;
  queueVo: QueueVo;
  boardCastManager: BoardCastManager = new BoardCastManager();

  constructor(
    private activateRoute: ActivatedRoute,
    private queueService: QueueService,
    private toastService: ToastService,
    // private smsSubscriptionService: SmsSubscriptionService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          console.log(queueVo);
          this.queueVo = queueVo;
          this.boardCastManager = this.queueVo.boardCastManager;
        }
      });
    });
  }

  addItem(): void {
    let boardCastQuestion = new BoardCastQuestion();
    boardCastQuestion.question = '';
    this.boardCastManager.boardCastQuestions.push(boardCastQuestion);
  }

  submit() {
    this.queueService.updateBoardCastManager(this.queueVo).subscribe({
      next: queueVo => {
        console.log('Success', queueVo);
        this.toastService.showSuccessToast('Update Successful');
      },
      error: err => {
        this.toastService.showErrorToast("Operation Failed", "Server Error");
      }
    });
  }
}
