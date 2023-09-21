import { Component, OnInit } from '@angular/core';
import {DashboardItem, QueueVo} from "../../../../../models/QueueVo";
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../_services/queue.service";
import {ToastService} from "../../../../../_helpers/toast.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-dashboard-item-list',
  templateUrl: './dashboard-item-list.component.html',
  styleUrls: ['./dashboard-item-list.component.css']
})
export class DashboardItemListComponent implements OnInit {
  queueId: string;
  queueVo: QueueVo;
  items: DashboardItem[] = [];

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
            this.items = this.queueVo.dashboardManager.dashboardItemList;
            console.log("items",this.items)
          }
        }
      )
    })
  }
}
