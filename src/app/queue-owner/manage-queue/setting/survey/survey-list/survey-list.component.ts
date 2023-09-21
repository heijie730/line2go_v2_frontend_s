import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SurveyService} from "../../../../../_services/survey.service";
import {SurveyVo} from "../../../../../models/SurveyVo";
import {QueueService} from "../../../../../_services/queue.service";
import {QueueVo} from "../../../../../models/QueueVo";
import {ToastService} from "../../../../../_helpers/toast.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit {
  queueId: string;
  surveyVoList: SurveyVo[] = [];
  queueVo: QueueVo;
  page: number = 0;
  size: number = 10;

  constructor(private activateRoute: ActivatedRoute,
              private surveyService: SurveyService,
              private queueService: QueueService,
              private toastService: ToastService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.activateRoute.queryParams.subscribe(params => {
        let pageTmp = parseInt(params['page']);
        let sizeTmp = parseInt(params['size']);
        if (pageTmp >= 0) {
          this.page = pageTmp;
        }
        if (sizeTmp > 0) {
          this.size = sizeTmp;
        }
        this.loadSurveys();
      });
      this.loadQueue();
    });

  }

  loadSurveys(): void {
    Swal.showLoading();
    this.surveyService.surveyList(this.queueId, this.page, this.size).subscribe({
      next: surveyList => {
        this.surveyVoList = surveyList;
        console.log('Success', surveyList);
        Swal.close();
      },
      error: err => {
        Swal.close();
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }

  loadQueue(): void {
    this.queueService.findById(this.queueId)
      .subscribe({
        next: queueVo => {
          this.queueVo = queueVo;
          console.log('Success queueVo', queueVo);
        },
        error: err => {
          this.toastService.showErrorToast("Operation failed", "Server error");

        }
      });
  }

  onChange(surveyId: string, editable: boolean, event: any) {
    console.log('onChange', surveyId, editable, event);
    console.log('onChange event.target.checked', event.target.checked);
    let checked = event.target.checked;
    let surveyVo = new SurveyVo();
    surveyVo.queueId = this.queueId;
    surveyVo.id = surveyId;
    if (checked) {
      if (editable) {
        Swal.fire({
          title: "Once used, this survey cannot be edited anymore (but can be cloned). Continue?",
          showCancelButton: true,
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.surveyService.makeUnEditable(surveyVo).subscribe({
              next: result => {
                console.log('updateEditable Success', result);
                this.loadSurveys();
              },
              error: err => {
                this.toastService.showErrorToast("Operation failed", "Server error");
              }
            });
            this.updateSurveyId(surveyVo);
          } else {
            console.log("preventDefault...")
            event.target.checked = !checked;
          }
        });
      } else {
        this.updateSurveyId(surveyVo);
      }
    } else {
      surveyVo.id = '';
      this.updateSurveyId(surveyVo);
    }
  }

  updateSurveyId(surveyVo: SurveyVo) {
    this.queueService.updateSurveyId(surveyVo).subscribe({
      next: result => {
        console.log('useThisSurvey Success result', result);
        this.toastService.showSuccessToast("Operation successful");
        this.loadQueue();
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }

  cloneSurvey(surveyVo: SurveyVo): void {
    this.toastService.showConfirmAlert("Confirm cloning the survey?", () => {
      let surveyVo2 = Object.assign({}, surveyVo);
      surveyVo2.id = '';
      surveyVo2.survey.name+="(clone)"
      console.log("surveyVo2", surveyVo2);
      this.surveyService.save(surveyVo2).subscribe({
        next: data => {
          console.log('Success', data);
          let surveyId = data.id;
          let queueId = data.queueId;
          this.router.navigate(['/leader/build-survey', queueId, surveyId, 'clone']);
        },
        error: err => {
          this.toastService.showErrorToast("Operation failed", "Server error");
        }
      });
    });
  }

  deleteSurvey(id: string): void {
    this.toastService.showConfirmAlert("Are you sure you want to delete the survey?", () => {
      if (this.queueVo.surveyPoId === id) {
        this.toastService.showErrorToast("Please unassign this survey before deleting", "Deletion failed");
        return;
      }
      this.surveyService.deleteById(id).subscribe({
        next: data => {
          this.toastService.showSuccessToast("Deletion successful");
          this.loadSurveys();
        },
        error: err => {
          this.toastService.showErrorToast("Failed to delete survey", "Server error");
        }
      });
    });
  }

}
