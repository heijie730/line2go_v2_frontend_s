import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SurveyService} from "../../../../../_services/survey.service";
import {SurveyVo} from "../../../../../models/SurveyVo";
import {QueueService} from "../../../../../_services/queue.service";
import {ToastService} from "../../../../../_helpers/toast.service";

@Component({
  selector: 'app-build-survey',
  templateUrl: './build-survey.component.html',
  styleUrls: ['./build-survey.component.css']
})
export class BuildSurveyComponent implements OnInit {
  queueId: string;
  surveyId: string;
  type: string;
  surveyVo: SurveyVo = new SurveyVo();

  constructor(private activateRoute: ActivatedRoute,
              private surveyService: SurveyService,
              private toastService: ToastService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.surveyId = params['surveyId'];
      this.type = params['type'];
      //add 的时候直接 先往数据库插入空的记录，再返回id，可以跟编辑 和 克隆一个逻辑。
      console.log(this.queueId, this.surveyId, this.type);
      this.loadSurvey();
    });
  }

  loadSurvey(): void {
    this.surveyService.findById(this.surveyId)
      .subscribe({
        next: surveyVo => {
          console.log('Success', surveyVo);
          this.surveyVo = surveyVo;
        },
        error: err => {
          this.toastService.showErrorToast("Operation failed", "Server error");

        }
      });
  }

  saveSurveyAndAddQuestion() {
    this.saveSurvey(this.toAddQuestion);
  }

  saveSurveyAndToPreview() {
    this.saveSurvey(this.toPreview);
  }

  toPreview = (): void => {
    this.router.navigate(['/leader/preview-survey', this.surveyId])
  }

  toAddQuestion = (): void => {
    this.router.navigate(['/leader/add-question', this.queueId, this.surveyId, 0, this.type])
  }

  saveSurvey(toWhere: any) {
    console.log('save survey....', this.surveyVo);
    this.surveyService.save(this.surveyVo).subscribe({
      next: data => {
        console.log('Success', data);
        if (toWhere) {
          toWhere();
        } else {
          this.toastService.showSuccessToast('Updated successfully');
        }
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");

      }
    })
  }
}
