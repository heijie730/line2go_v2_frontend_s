import { Component, Input, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { SurveyService } from "../../_services/survey.service";
import { SurveyVo } from "../../models/SurveyVo";
import { DateTimeUtils } from "../../_utils/dateTimeUtils";
import { ToastService } from "../../_helpers/toast.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() titleName: string;
  @Input() secondPath: string;
  @Input() lastPath: string;
  @Input() lastType: string;
  @Input() queueId: string;

  constructor(
    private location: Location,
    private toastService: ToastService,
    private surveyService: SurveyService,
    public dateTimeUtils: DateTimeUtils,
    private router: Router) {
  }

  ngOnInit(): void {

  }

  onFirstClick(): void {
    this.location.back()
  }
  onSecondClick(): void {
    this.router.navigateByUrl(this.secondPath);
  }
  onLastClick(): void {
    this.router.navigateByUrl(this.lastPath);
  }

  addSurvey(): void {
    this.toastService.showSuccessToast('Survey Created Successfully');
    let surveyVo = new SurveyVo();
    surveyVo.queueId = this.queueId;
    surveyVo.survey.name = 'Queue Survey';
    let dateTime = this.dateTimeUtils.yyyyMMddHHmmss(new Date());
    surveyVo.survey.description = 'Please answer the survey first\n' + dateTime;
    console.log("surveyVo", surveyVo);
    this.surveyService.save(surveyVo).subscribe({
      next: data => {
        console.log('Success', data);
        let surveyId = data.id;
        let queueId = data.queueId;
        this.router.navigate(['/leader/build-survey', queueId, surveyId, 'add']);
      },
      error: err => {
        this.toastService.showErrorToast("Operation Failed", "Server Error");
      }
    });
  }
}
