import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DashboardEnum, DashboardItem} from "../../../../../../../models/QueueVo";
import {CdkDragEnd} from "@angular/cdk/drag-drop";
import {AbsBaseDraggable} from "../base-draggable/AbsBaseDraggable";


@Component({
  selector: 'custom-content-item[dashboardEnum][dashboardItem]',
  templateUrl: './custom-content-item.component.html',
  styleUrls: ['./custom-content-item.component.css']
})
export class CustomContentItemComponent extends AbsBaseDraggable{

  constructor() {
    super();
  }

}
