import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NotificationService} from "../../../_services/notification.service";
import {environment} from "../../../../environments/environment";
import {AppComponent} from "../../../app.component";

@Component({
  selector: 'app-notification-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent implements OnInit, OnDestroy {
  @Input() homeUrl: string;
  count: string = "";
  // ticketInterval: any;

  constructor(private notificationService: NotificationService) {
  }


  ngOnInit(): void {
    console.log("icon on init .................");
    // this.loadCountUnRead();
    // this.loadCountUnReadInterval();
  }

  ngOnDestroy(): void {
    // clearInterval(this.ticketInterval);
    // console.log("ngOnDestroy ticketInterval", this.ticketInterval);
  }

  notificationCount: number;

  NOTIFICATION_KEY: string = 'notificationCount';

  isPushNotification(newCount: number) {
    if (newCount > 0) {
      let item = window.sessionStorage.getItem(this.NOTIFICATION_KEY);
      let newVar = item ? item : '0';
      let oldCount = parseInt(newVar);
      if (newCount > oldCount) {
        this.notificationService.findFirstUnRead().subscribe(notificationVo => {
          const notification = new Notification(<string>notificationVo.title, {
            body: notificationVo.content,
          });
          notification.onclick = (event) => {
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            window.open(environment.domain + '/share/notifications/' + notificationVo.id + '/' + notificationVo.checked, '_blank');
          }
        })
      }
    }
    window.sessionStorage.setItem(this.NOTIFICATION_KEY, newCount + '');
  }

  // loadCountUnRead(): void {
  //   this.notificationService.countUnRead().subscribe({
  //     next: countVo => {
  //       console.log('Success count', countVo);
  //       // if (countVo && countVo.count) {
  //       let count1 = countVo.count;
  //       if (count1 > 99) {
  //         this.count = "99+";
  //       } else if (count1 == 0) {
  //         this.count = "";
  //       } else {
  //         this.count = count1 + '';
  //       }
  //       // if (countVo.fgNotify && 'Notification' in window) {
  //       //   this.isPushNotification(count1);
  //       // }
  //     }
  //   })
  // }
  //
  // loadCountUnReadInterval(): void {
  //   console.log("loadCountUnReadInterval init....")
  //   this.ticketInterval = setInterval(() => {
  //     if (!AppComponent.hidden) {
  //       this.loadCountUnRead();
  //     }
  //   }, environment.notificationInterval);
  // }
}
