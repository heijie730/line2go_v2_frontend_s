import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SurveyService } from "../../../_services/survey.service";
import { QueueService } from "../../../_services/queue.service";
import { FilledSurveyService } from "../../../_services/filled-survey.service";
import { FilledSurveyVo } from "../../../models/FilledSurveyVo";
import { Question, QuestionType } from 'src/app/models/survey/Question';
import { ToastService } from "../../../_helpers/toast.service";
import { CustomUtils } from "../../../_utils/CustomUtils";

@Component({
  selector: 'app-fill-survey',
  templateUrl: './fill-survey.component.html',
  styleUrls: ['./fill-survey.component.css']
})
export class FillSurveyComponent implements OnInit {
  titleName: string;
  queueId: string;
  surveyId: string;
  type: string;
  filledSurveyId: string;
  filledSurveyVo: FilledSurveyVo = new FilledSurveyVo();
  date: string;
  ticketNo: string;
  // surveyVo: SurveyVO = new SurveyVO();
  QuestionType = QuestionType;
  question: Question;

  constructor(
    private activateRoute: ActivatedRoute,
    private queueService: QueueService,
    public customUtils: CustomUtils,
    private filledSurveyService: FilledSurveyService,
    private toastService: ToastService,
    private surveyService: SurveyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.surveyId = params['surveyId'];
      this.queueId = params['queueId'];
      this.type = params['type'];
      if (this.type == 'add') this.titleName = 'Add Survey';
      if (this.type == 'edit') this.titleName = 'Edit Survey';
      if (this.type == 'preview') this.titleName = 'Preview Survey';
      this.activateRoute.queryParams.subscribe(params => {
        this.filledSurveyId = params['filledSurveyId'];
        this.date = params['date']
        this.ticketNo = params['ticketNo']
        if (this.filledSurveyId) {
          this.filledSurveyService.findById(this.filledSurveyId).subscribe({
            next: filledSurveyVo => {
              this.filledSurveyVo = filledSurveyVo;
              console.log('Success filledSurveyVo', filledSurveyVo);
            },
            error: err => {
              this.toastService.showErrorToast("Operation Failed", "Server Error");
            }
          });
        } else {
          this.surveyService.findById(this.surveyId)
            .subscribe({
              next: result => {
                console.log('Success findById', result);
                if (result.errcode != 1007) {
                  this.filledSurveyVo.surveyId = this.surveyId;
                  this.filledSurveyVo.queueId = this.queueId;
                  this.filledSurveyVo.survey = result.survey;
                }
              },
              error: err => {
                this.toastService.showErrorToast("Operation Failed", "Server Error");
              }
            });
        }
      });
    });
  }

  submitSurvey(): void {
    console.log(this.filledSurveyVo);
    let scrollToElement = null;

    for (let page of this.filledSurveyVo.survey.pages) {
      // Check if mandatory fields in the page are filled
      let pageValid = this.customUtils.isPageValid(page);
      if (!pageValid) {
        // Find the first unfilled mandatory field
        scrollToElement = document.getElementById(`question${page.elements[0].question.name}`);
        break;
      }
    }
    console.log("scrollToElement",scrollToElement)
    if (scrollToElement) {
      // Scroll to the unfilled field
      scrollToElement.scrollIntoView({behavior: 'auto'});
      this.toastService.showToast("Form Incomplete", 2000, true)
      return;
    }

    this.filledSurveyService.save(this.filledSurveyVo).subscribe({
      next: data => {
        this.router.navigate(['/member/queue-up', this.queueId, this.date], {
          queryParams: {
            filledSurveyId: data.id,
            ticketNo: this.ticketNo
          }
        });

        console.log('Create Success', data);
      },
      error: err => {
        this.toastService.showErrorToast("Operation Failed", "Server Error");
      }
    });
  }
}
