import {Component, Input, OnInit} from '@angular/core';
import {NotificationTemplate} from "../../../../../models/NotificationParam";
import {BaseNotification} from "../../../../../models/QueueVo";

@Component({
  selector: 'app-notification-template[baseNotification]',
  templateUrl: './notification-template.component.html',
  styleUrls: ['./notification-template.component.css']
})
export class NotificationTemplateComponent implements OnInit {

  @Input() baseNotification:BaseNotification;

  constructor() { }

  ngOnInit(): void {
  }

}
