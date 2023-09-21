import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DashboardEnum, DashboardItem, DateTypeEnum, QueueVo } from "../../../../../../models/QueueVo";
import { ActivatedRoute, Router } from "@angular/router";
import { QueueService } from "../../../../../../_services/queue.service";
import { ToastService } from "../../../../../../_helpers/toast.service";
import { Location } from "@angular/common";
import { DateTimeUtils } from "../../../../../../_utils/dateTimeUtils";
import { AwsService } from "../../../../../../_services/aws-service.service";
import { CustomContentItemComponent } from "./custom-content-item/custom-content-item.component";
import { TicketTakenListItemComponent } from "./ticket-taken-list-item/ticket-taken-list-item.component";

@Component({
  selector: 'app-save-dashboard-item',
  templateUrl: './save-dashboard-item.component.html',
  styleUrls: ['./save-dashboard-item.component.css']
})
export class SaveDashboardItemComponent implements OnInit {
  queueId: string;
  index: number;
  itemList: DashboardItem[];
  queueVo: QueueVo;
  currentItem: DashboardItem = new DashboardItem();
  title = "";

  @ViewChild(CustomContentItemComponent) customContentItemComponent: CustomContentItemComponent;
  @ViewChild(TicketTakenListItemComponent) queueInfoItemComponent: TicketTakenListItemComponent;

  dashboardEnum: DashboardEnum = DashboardEnum.ITEM_EDIT;
  date: string;

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService, public dateTimeUtils: DateTimeUtils,
              private location: Location, private awsService: AwsService,
              private router: Router) {
  }

  ngOnInit(): void {

    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.index = params['index'];

      this.currentItem = new DashboardItem();
      this.queueService.findById(this.queueId).subscribe(
        {
          next: queueVo => {
            this.queueVo = queueVo;
            this.date = this.dateTimeUtils.yyyyMMdd(new Date(),this.queueVo.timeZone);
            this.itemList = this.queueVo.dashboardManager.dashboardItemList;
            console.log(this.itemList);
            if (this.index) {
              this.title = 'Edit Dashboard Item';
              this.currentItem = this.itemList[this.index];
            } else {
              this.title = 'Create Dashboard Item';
              this.itemList.push(this.currentItem);
            }
          }
        }
      );
    });
  }

  delete(): void {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      this.itemList.splice(this.index, 1);
      this.queueVo.dashboardManager.dashboardItemList = this.itemList;
      this.queueService.updateDashboardManager(this.queueVo).subscribe({
        next: queueVo => {
          console.log('Success', queueVo);
          this.toastService.showSuccessToast('Deleted successfully');
          if (this.index) {
            this.router.navigate(['/leader/dashboard-item-list', this.queueId]);
          } else {
            this.router.navigate(['/leader/dashboard-item-list', this.queueId]);
          }
        },
        error: err => {
          this.toastService.showErrorToast("Operation failed", "Server error");
        }
      });
    });
  }

  submit(): void {
    if (!this.currentItem.title || !this.currentItem.title.trim()) {
      this.toastService.showErrorToast("Name cannot be empty");
      return;
    }
    let length = this.itemList.filter(x => x.title == this.currentItem.title).length;
    if (length > 1) {
      this.toastService.showErrorToast("Name cannot be duplicated with existing items");
      return;
    }
    let dateType = this.currentItem.ticketTakenListSetting.dateType;
    if (dateType.dateTypeEnum === DateTypeEnum.MANUAL_DAY && !dateType.date) {
      this.toastService.showErrorToast("Specific date not selected");
      return;
    }
    let boardCastDateType = this.currentItem.boardCastSetting.dateType;
    if (boardCastDateType.dateTypeEnum === DateTypeEnum.MANUAL_DAY && !boardCastDateType.date) {
      this.toastService.showErrorToast("Specific date not selected");
      return;
    }
    this.queueVo.id = this.queueId;
    this.queueVo.dashboardManager.dashboardItemList = this.itemList;
    this.queueService.updateDashboardManager(this.queueVo).subscribe({
      next: queueVo => {
        console.log('Success', queueVo);
        this.toastService.showSuccessToast('Updated successfully');
        if (this.index) {
          this.router.navigate(['/leader/save-dashboard-item', this.queueId, this.index]);
        } else {
          this.router.navigate(['/leader/save-dashboard-item', this.queueId, this.itemList.length - 1]);
        }
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }
}
