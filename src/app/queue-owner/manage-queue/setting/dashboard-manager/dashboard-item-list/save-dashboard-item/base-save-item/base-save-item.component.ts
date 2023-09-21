import {Component, Input, OnInit} from '@angular/core';
import {DashboardItem} from "../../../../../../../models/QueueVo";

@Component({
  selector: 'app-base-save-item[dashboardItem]',
  templateUrl: './base-save-item.component.html'
})
export class BaseSaveItemComponent implements OnInit {
  @Input() dashboardItem: DashboardItem ;

  constructor() { }

  ngOnInit(): void {
  }

}
