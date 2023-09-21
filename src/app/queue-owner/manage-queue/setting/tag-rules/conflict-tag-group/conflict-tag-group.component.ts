import { Component, OnInit } from '@angular/core';
import {QueueVo, TagRules} from "../../../../../models/QueueVo";
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../_services/queue.service";
import {ToastService} from "../../../../../_helpers/toast.service";
import {Location} from "@angular/common";
import Swal from "sweetalert2";

@Component({
  selector: 'app-conflict-tag-group',
  templateUrl: './conflict-tag-group.component.html',
  styleUrls: ['./conflict-tag-group.component.css']
})
export class ConflictTagGroupComponent implements OnInit {

  queueId: string;
  queueVo: QueueVo;
  tagRules: TagRules;

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location,
              private router: Router) {
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
          this.tagRules = this.queueVo.tagRules;
        },error:err => {
          Swal.close();
          this.toastService.showErrorToast("Operation failed", "Server error");
        }
      });
    })
  }
}
