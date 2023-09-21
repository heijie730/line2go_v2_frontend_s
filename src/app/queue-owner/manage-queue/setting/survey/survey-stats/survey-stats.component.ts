import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SurveyVo} from "../../../../../models/SurveyVo";
import {ActivatedRoute, Router} from "@angular/router";
import {SurveyService} from "../../../../../_services/survey.service";
import {FilledSurveyService} from "../../../../../_services/filled-survey.service";
import {ToastService} from "../../../../../_helpers/toast.service";
import {CustomUtils} from "../../../../../_utils/CustomUtils";
import {QuestionType} from 'src/app/models/survey/Question';
import {TicketService} from "../../../../../_services/ticket.service";
import {DateTimeUtils} from "../../../../../_utils/dateTimeUtils";
import flatpickr from "flatpickr";
import Swal from "sweetalert2";
import {TicketVo} from "../../../../../models/TicketVo";
import html2canvas from "html2canvas";
import {RadioOption} from "../../../../../models/survey/RadioOption";
import {QueueService} from "../../../../../_services/queue.service";
import {QueueVo} from "../../../../../models/QueueVo";

@Component({
  selector: 'app-survey-stats',
  templateUrl: './survey-stats.component.html',
  styleUrls: ['./survey-stats.component.css']
})
export class SurveyStatsComponent implements OnInit, AfterViewInit {
  surveyId: string;
  queue: QueueVo;
  surveyVo: SurveyVo = new SurveyVo();
  QuestionType = QuestionType;
  queueId: string;
  date: string;
  @ViewChild('datePicker') datePicker: ElementRef;
  ticketVos: TicketVo[] = [];
  surveyStats: QuestionStatsDetail[] = [];
  imgData: any;

  constructor(private activateRoute: ActivatedRoute,
              private surveyService: SurveyService,
              private filledSurveyService: FilledSurveyService,
              private toastService: ToastService,
              private ticketService: TicketService,
              public dateTimeUtils: DateTimeUtils,
              public customUtils: CustomUtils,
              private queueService: QueueService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.surveyId = params['surveyId'];
      this.date = params['ticketDate'];
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          this.queue = queueVo;
          if (!this.date) {
            this.date = this.dateTimeUtils.yyyyMMdd(new Date(), this.queue.timeZone);
          }
          Swal.showLoading();
          this.ticketService.findByTicketDateAndSurveyId(this.date, this.surveyId).subscribe({
              next: data => {
                Swal.close();
                this.ticketVos = data.ticketVos;
                this.summary();
              },
              error: err => {
                Swal.close();
                this.toastService.showErrorToast("Operation failed", "Server error");
              }
            }
          )
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
        }
      })

    });
  }

  ngAfterViewInit() {
    // const currentDate = new Date();
    // let maxDate = currentDate.setMonth(currentDate.getMonth() + 6);
    // const currentDate2 = new Date();
    // let minDate = currentDate2.setMonth(currentDate2.getMonth() - 1);
    let flatpickrInstance = flatpickr(this.datePicker.nativeElement, {
      mode: 'single',
      // minDate: minDate,
      // maxDate: maxDate,
      defaultDate: this.date,
      dateFormat: 'Y-m-d',
      allowInput: false,
      disableMobile: true,
      onChange: (selectedDates) => {
        console.log(selectedDates);
        this.afterDateChecked(selectedDates[0]);
      }
    });
  }

  afterDateChecked(date: Date): void {
    let yyyyMMdd = this.dateTimeUtils.yyyyMMddOrigin(date);
    console.log("afterDateChecked", yyyyMMdd);
    window.location.href = '/leader/survey-stats/' + this.queueId + "/" + this.surveyId + "/" + yyyyMMdd;
  }

  toBack() {
    this.router.navigate(['/leader/survey-list', this.queueId]);
  }

  initHtml2Img(): void {
    if (!this.imgData) {
      let element = document.getElementById('surveyStats');
      if (element) {
        html2canvas(element).then((canvas) => {
          this.imgData = canvas.toDataURL();
        });
      }
    }
  }

  summary() {
    let filledSurveyVos = this.ticketVos.filter(x => x.ticketUserInfo.filledSurveyVo)
      .map(x => x.ticketUserInfo.filledSurveyVo);

    let allAnswers = filledSurveyVos.map(x => {
      return x.survey.pages.flatMap(y => y.elements[0]).map(x => x.question).map(x => {
        let questionStats = new QuestionStats();
        let questionType = x.type;
        questionStats.questionType = questionType;
        if (questionType === QuestionType.SHORT_TEXT) {
          questionStats.question = x.shortText.question;
          questionStats.answers.push(x.shortText.answer);
        } else if (questionType === QuestionType.SINGLE_CHOICE_QUESTION) {
          let singleChoiceQuestion = x.singleChoiceQuestion;
          questionStats.question = singleChoiceQuestion.question;
          let strings = singleChoiceQuestion.radioOptions.filter(option => option.id == singleChoiceQuestion.answer).map(option => option.text);
          questionStats.answers.push(...strings);
          questionStats.radioOptions = singleChoiceQuestion.radioOptions;
        } else if (questionType === QuestionType.MULTIPLE_CHOICE_QUESTION) {
          let multipleChoiceQuestion = x.multipleChoiceQuestion;
          questionStats.question = multipleChoiceQuestion.question;
          let strings = multipleChoiceQuestion.radioOptions.filter(option => multipleChoiceQuestion.answer.includes(option.id)).map(option => option.text);
          questionStats.answers.push(...strings);
          questionStats.radioOptions = multipleChoiceQuestion.radioOptions;
        }
        return questionStats;
      });
    }).reduce((mergedDates: QuestionStats[], list) => {
      return mergedDates.concat(list);
    }, []);

    const answersGroupBy = new Map<string, QuestionStats[]>();
    allAnswers.forEach(questionStats => {
      const question = questionStats.question;
      if (!answersGroupBy.has(question)) {
        answersGroupBy.set(question, []);
      }
      answersGroupBy.get(question)?.push(questionStats);
    });

    const questionStatsDetails: QuestionStatsDetail[] = [];
    //以问题分组的所有答案
    answersGroupBy.forEach((answers, question) => {
      const answerStatsMap = new Map<string, AnswerStats>();

      answers.forEach(questionStats => {
        //就算没有填写，选择题也要初始化为0
        for (let radioOption of questionStats.radioOptions) {
          if (!answerStatsMap.has(radioOption.text)) {
            answerStatsMap.set(radioOption.text, {answer: radioOption.text, count: 0});
          }
        }
        questionStats.answers.forEach(answer => {
          if (!answerStatsMap.has(answer)) {
            answerStatsMap.set(answer, {answer: answer, count: 0});
          }
          answerStatsMap.get(answer)!.count += 1;
        });
      });

      const answerStatsArray = Array.from(answerStatsMap.values());
      const questionStatsDetail: QuestionStatsDetail = {
        question: question,
        questionType: answers[0].questionType,
        answerStats: answerStatsArray
      };
      questionStatsDetails.push(questionStatsDetail);
    });

    this.surveyStats = questionStatsDetails;
  }

}

export class QuestionStatsDetail {
  question: string;
  questionType: QuestionType;
  answerStats: AnswerStats[] = []
}

export class AnswerStats {
  answer: string;
  count: number;
}

export class QuestionStats {
  question: string;
  questionType: QuestionType;
  answers: string[] = [];
  radioOptions: RadioOption[] = [];
}
