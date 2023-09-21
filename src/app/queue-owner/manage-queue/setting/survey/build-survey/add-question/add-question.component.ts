import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Page} from "../../../../../../models/survey/Page";
import {Question, QuestionType} from "../../../../../../models/survey/Question";
import {RadioOption} from "../../../../../../models/survey/RadioOption";
import {SurveyService} from "../../../../../../_services/survey.service";
import {SurveyVo} from "../../../../../../models/SurveyVo";
import {ToastService} from "../../../../../../_helpers/toast.service";
import {QueueService} from "../../../../../../_services/queue.service";
import {TagVo} from "../../../../../../models/TagVo";

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {
  queueId: string;
  surveyId: string;
  type: string;
  index: number;
  page: Page = new Page();
  question: Question = new Question();
  surveyVo: SurveyVo = new SurveyVo();
  QuestionType = QuestionType;
  tagVos: TagVo[] = [];

  constructor(private activateRoute: ActivatedRoute, private router: Router,
              private toastService: ToastService, private queueService: QueueService,
              private surveyService: SurveyService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }


  ngOnInit(): void {

    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.surveyId = params['surveyId'];
      this.type = params['type'];
      this.index = parseInt(params['index']);

      this.page.num = this.index + 1;
      this.surveyService.findById(this.surveyId)
        .subscribe({
          next: surveyVo => {
            console.log('Success', surveyVo);
            if (surveyVo.errcode == 0) {
              this.surveyVo = surveyVo;
              if (this.surveyVo.survey.pages.length > this.index) {
                this.page = this.surveyVo.survey.pages[this.index];
              } else {
                this.surveyVo.survey.pages.push(this.page);
              }
              console.log("this.page", this.page);
              this.question = this.page.elements[0].question;
              this.queueService.findById(this.queueId).subscribe(
                {
                  next: queueVo => {
                    this.tagVos = queueVo.tags.map(x => x.toTagVo(this.question.shortText.tags))
                  }
                }
              )
            }
            console.log('page', this.page);
            console.log('add question·····', this.queueId);
          },
          error: err => {
            this.toastService.showErrorToast("Operation failed", "Server error");

          }
        });
    });
  }
  onQuestionTypeSelect(type: string) {
    console.log('type', type);
    console.log('page', this.page);
  }

  removeOption(i: number) {
    console.log('remove i', i);
    this.question.singleChoiceQuestion.radioOptions.splice(i, 1);
    console.log('page', this.page);
  }

  removeMultipleOption(i: number) {
    console.log('remove i', i);
    this.question.multipleChoiceQuestion.radioOptions.splice(i, 1);
    console.log('page', this.page);
  }

  addOption() {
    console.log('add option');
    let radioOption = new RadioOption();
    this.question.singleChoiceQuestion.radioOptions.push(radioOption);
    console.log('page', this.page);
  }

  radioOptionChange(radioOption: RadioOption) {
    radioOption.allowInput = !radioOption.allowInput;
    if (radioOption.allowInput) {
      this.toastService.showToast("Allow user custom input");
    }
  }

  addMultipleOption() {
    let radioOption = new RadioOption();
    this.question.multipleChoiceQuestion.radioOptions.push(radioOption);
    console.log('page', this.page);
  }

  saveSurveyAndAddQuestion() {
    this.saveSurvey(this.toAddQuestion);
  }

  saveSurveyAndToPreview() {
    this.saveSurvey(this.toPreview);
  }

  deleteQuestion() {
    console.log("deleteQuestion index", this.index);
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      this.surveyVo.survey.pages.splice(this.index, 1);
      this.saveSurvey(() => {
        if (this.index > 0) {
          this.router.navigate(['/leader/add-question', this.queueId, this.surveyId, this.index - 1, this.type]);
        } else {
          this.router.navigate(['/leader/build-survey', this.queueId, this.surveyId, 'edit']);
        }
        this.toastService.showSuccessToast("Deleted successfully");
      });
    });
  }

  toPreview = (): void => {
    this.router.navigate(['/leader/preview-survey', this.surveyId]);
  }

  toAddQuestion = (): void => {
    this.router.navigate(['/leader/add-question', this.queueId, this.surveyId, this.index + 1, this.type]);
  }

  saveSurvey(toWhere: any) {
    this.question.shortText.tags = this.tagVos.filter(x => x.checked).map(x => x.toTag());
    console.log('save survey....', this.surveyVo);
    this.surveyService.save(this.surveyVo).subscribe({
      next: data => {
        console.log('Success', data);
        if (toWhere) {
          toWhere();
        } else {
          this.toastService.showSuccessToast("Saved successfully");
        }
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }

}
