import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NotificationService } from "../../../_services/notification.service";
import { TokenStorageService } from "../../../_services/token-storage.service";
import { NotificationVo } from "../../../models/NotificationVo";
import { DateTimeUtils } from "../../../_utils/dateTimeUtils";
import { Location } from "@angular/common";
import { ToastService } from "../../../_helpers/toast.service";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  userId: string;
  notifications: NotificationVo[] = [];
  page: number = 0;
  size: number = 10;
  homeUrl: string;
  onlyUnRead: boolean = false;

  constructor(
    public activateRoute: ActivatedRoute,
    private notificationService: NotificationService,
    public dateTimeUtils: DateTimeUtils,
    private location: Location,
    private toastService: ToastService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe(params => {
      let pageTmp = parseInt(params['page']);
      let sizeTmp = parseInt(params['size']);
      this.homeUrl = params['homeUrl'];
      if (pageTmp >= 0) {
        this.page = pageTmp;
      }
      if (sizeTmp > 0) {
        this.size = sizeTmp;
      }
      this.loadList();
    });
  }

  loadList(): void {
    this.notificationService.list(this.page, this.size, this.onlyUnRead).subscribe({
      next: notifications => {
        this.notifications = notifications;
        console.log('Success notifications', notifications);
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }

  toBack(): void {
    this.location.back();
  }

  markAllAsRead(): void {
    this.notificationService.markAllChecked().subscribe({
      next: result => {
        let modifiedCount = result.modifiedCount;
        this.toastService.showInfoToast("Marked " + modifiedCount + " unread notifications as read", "Marked Successfully");
        this.loadList();
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }

  onChange(): void {
    this.loadList();
  }
}
