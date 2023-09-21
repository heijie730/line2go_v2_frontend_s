import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../_services/queue.service";
import {ToastService} from "../../../../_helpers/toast.service";
import {Location} from "@angular/common";
import {QueueVo} from "../../../../models/QueueVo";

@Component({
  selector: 'app-tag-rules',
  templateUrl: './tag-rules.component.html',
  styleUrls: ['./tag-rules.component.css']
})
export class TagRulesComponent implements OnInit {
  queueId: string;
  queueVo: QueueVo;
  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,

              private toastService: ToastService,
              private location: Location,
              private router: Router) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          console.log(queueVo);
          this.queueVo = queueVo;
        }
      });
    })
  }

}
