import {Component, Input, OnInit} from '@angular/core';
import {SurveyVo} from "../../../../../models/SurveyVo";
import {ActivatedRoute, Router} from "@angular/router";
import {SurveyService} from "../../../../../_services/survey.service";
import {FilledSurveyService} from "../../../../../_services/filled-survey.service";
import {FilledSurveyVo} from "../../../../../models/FilledSurveyVo";
import { QuestionType } from 'src/app/models/survey/Question';
import {ToastService} from "../../../../../_helpers/toast.service";
import {CustomUtils} from "../../../../../_utils/CustomUtils";

@Component({
  selector: 'app-preview-survey',
  templateUrl: './preview-survey.component.html',
  styleUrls: ['./preview-survey.component.css']
})
export class PreviewSurveyComponent implements OnInit {
  @Input() titleName = 'preview';
  surveyId: string;
  surveyVo: SurveyVo = new SurveyVo();
  @Input() busType = 'preview';
  QuestionType = QuestionType;

  constructor(private activateRoute: ActivatedRoute,
              private surveyService: SurveyService,
              private filledSurveyService: FilledSurveyService,
              private toastService: ToastService,
              public customUtils:CustomUtils,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.surveyId = params['surveyId'];
      this.surveyService.findById(this.surveyId)
        .subscribe({
          next: result => {
            console.log('Success findById', result);
            if (result.errcode != 1007) {
              this.surveyVo = result;
            }
          },
          error: err => {
            this.toastService.showErrorToast("Operation failed", "Server error");

          }
        });
    });
  }

}
