import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NotificationService } from "../../../_services/notification.service";
import { NotificationVo } from "../../../models/NotificationVo";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { MarkNotificationVo } from "../../../models/MarkNotificationVo";
import { ToastService } from "../../../_helpers/toast.service";
import { Location } from "@angular/common";
import { DateTimeUtils } from "../../../_utils/dateTimeUtils";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  id: string;
  notification: NotificationVo;
  checked: boolean;
  params: Params;
  homeUrl: string;
  constructor(
    private activateRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private toastService: ToastService,
    private location: Location,
    public dateTimeUtils: DateTimeUtils,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      this.checked = JSON.parse(params['checked']);
      if (!this.checked) {
        let markNotificationVo = new MarkNotificationVo();
        markNotificationVo.ids = [this.id];
        this.notificationService.markChecked(markNotificationVo).subscribe(data => {
            console.log(data);
          },
          error => console.log(error)
        )
      }
      this.notificationService.findById(this.id).subscribe({
        next: notification => {
          console.log("notification", notification);
          this.notification = notification;
          if (this.notification.errcode != 0) {
            this.toastService.showErrorToast("Notification not found");
          }
        }
      });
    });

    this.activateRoute.queryParams.subscribe(params => {
      this.homeUrl = params['homeUrl'];

      this.params = params;
    });
  }

  @HostListener('document:click', ['$event'])
  public handleClick(event: Event): void {
    if (event.target instanceof HTMLAnchorElement) {
      const element = event.target as HTMLAnchorElement;
      if (element.className === 'router-link') {
        event.preventDefault();
        const route = element?.getAttribute('href');
        if (route) {
          this.router.navigateByUrl(`/${route}`);

        }
      }
    }
  }

  delete(): void {
    this.toastService.showConfirmAlert("Confirm deletion?", () => {
      let markNotificationVo = new MarkNotificationVo();
      markNotificationVo.ids = [this.id];
      this.notificationService.delete(markNotificationVo).subscribe(result => {
        console.log(result);
        if (result.errcode == 0) {
          this.toastService.showSuccessToast("Deleted successfully");
          this.router.navigate(['/share/notifications'], { queryParams: this.params });
          // this.location.back();
        } else {
          this.toastService.showErrorToast("Deletion failed: " + result.errmsg);
        }
      })
    });
  }

  toBack(): void {
    this.location.back()
  }
}
