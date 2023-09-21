import {Component, Input, OnInit} from '@angular/core';
import {findTemplate, NotificationTemplate, TemplateName, TemplateType} from "../../../../../models/NotificationParam";
import {BaseNotification} from "../../../../../models/QueueVo";

@Component({
  selector: 'app-notification-template-switch[baseNotification]',
  templateUrl: './notification-template-switch.component.html',
  styleUrls: ['./notification-template-switch.component.css']
})
export class NotificationTemplateSwitchComponent implements OnInit {
  @Input() baseNotification: BaseNotification;

  constructor() {
  }

  ngOnInit(): void {
  }

  onTypeChange(event: any) {
    let templateName = event.target.value;
    console.log(templateName);
    // Call findTemplate and get the result
    const newTemplate = findTemplate(templateName);
    // Copy the properties from the newTemplate to the existing baseNotification object
    Object.assign(this.baseNotification, newTemplate);
  }
}
