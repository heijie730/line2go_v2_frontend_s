import {Component, OnInit} from '@angular/core';
import {QueueVo, StatusByMember, StatusByQuestion, Tag} from "../../../../../models/QueueVo";
import {TagVo} from "../../../../../models/TagVo";
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../_services/queue.service";
import {ToastService} from "../../../../../_helpers/toast.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-status-questions',
  templateUrl: './status-questions.component.html',
  styleUrls: ['./status-questions.component.css']
})
export class StatusQuestionsComponent implements OnInit {

  queueId: string;
  queueVo: QueueVo;
  tagVo: TagVo;
  tagsOnGenerate: Tag[] = [];
  tags: Tag[];
  tagVos: TagVo[] = [];
  statusByMember: StatusByMember = new StatusByMember();

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location,
              private router: Router) {
  }

  ngOnInit(): void {
    this.statusByMember.statusByQuestions = [];
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.queueService.findById(this.queueId).subscribe(
        {
          next: queueVo => {
            this.queueVo = queueVo;
            this.statusByMember = this.queueVo.statusByMember;
          }
        }
      );

    })
  }

  save(): void {
    this.statusByMember.statusByQuestions = this.statusByMember.statusByQuestions.filter(x => !(x.question == null || x.question == ''));
    this.queueVo.statusByMember = this.statusByMember;
    this.queueService.updateStatusQuestions(this.queueVo).subscribe({
      next: queueVo => {
        console.log('Success', queueVo);
        this.toastService.showSuccessToast('Updated successfully');
      },
      error: err => {
        this.toastService.showErrorToast("Network error, please try again");
      }
    });
  }

  addItem(): void {
    let statusByQuestion = new StatusByQuestion();
    statusByQuestion.question = '';
    this.statusByMember.statusByQuestions.push(statusByQuestion);
  }
}
