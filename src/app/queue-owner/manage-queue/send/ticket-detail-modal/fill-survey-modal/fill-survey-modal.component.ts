import {Component, Input, OnInit} from '@angular/core';
import {FilledSurveyVo} from "../../../../../models/FilledSurveyVo";
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../_services/queue.service";
import {FilledSurveyService} from "../../../../../_services/filled-survey.service";
import {SurveyService} from "../../../../../_services/survey.service";
import {QuestionType} from "../../../../../models/survey/Question";

@Component({
  selector: 'app-fill-survey-modal',
  templateUrl: './fill-survey-modal.component.html',
  styleUrls: ['./fill-survey-modal.component.css']
})
export class FillSurveyModalComponent implements OnInit {
  @Input() id: string;
  @Input() filledSurveyVo: FilledSurveyVo = new FilledSurveyVo();
  QuestionType = QuestionType;

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private filledSurveyService: FilledSurveyService,
              private surveyService: SurveyService, private router: Router) {
  }

  ngOnInit(): void {

  }

}
