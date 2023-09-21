import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SurveyService} from "../../../../_services/survey.service";
import {QueueService} from "../../../../_services/queue.service";
import {ToastService} from "../../../../_helpers/toast.service";

import {Location} from "@angular/common";
import {QueueVo, Tag} from "../../../../models/QueueVo";
import * as bootstrap from "bootstrap";
import Swal from "sweetalert2";

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  queueId: string;
  queueVo: QueueVo;
  tags: Tag[] = [];

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,

              private toastService: ToastService,
              private location: Location,
              private router: Router) {
  }
  toBack(): void {
    this.location.back()
  }
  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      Swal.showLoading();
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          Swal.close();
          console.log(queueVo);
          this.queueVo = queueVo;
          this.tags = this.queueVo.tags;
        },error:err => {
          Swal.close();
          this.toastService.showErrorToast("Operation failed", "Server error");
        }
      });
    })
  }
}
