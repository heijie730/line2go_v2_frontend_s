import { Component, OnInit } from '@angular/core';
import {DashboardItem, DashboardTemplate, QueueVo} from "../../../../../models/QueueVo";
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../_services/queue.service";
import {ToastService} from "../../../../../_helpers/toast.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-dashboard-template-list',
  templateUrl: './dashboard-template-list.component.html',
  styleUrls: ['./dashboard-template-list.component.css']
})
export class DashboardTemplateListComponent implements OnInit {
  queueId: string;
  queueVo: QueueVo;
  items: DashboardTemplate[] = [];

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.queueService.findById(this.queueId).subscribe(
        {
          next: queueVo => {
            this.queueVo = queueVo;
            this.items = this.queueVo.dashboardManager.dashboardTemplateList;
            console.log("items",this.items)
          }
        }
      )
    })
  }
}
