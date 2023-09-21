import {Component, Input, OnInit} from '@angular/core';
import {DashboardEnum, DashboardItem} from "../../../../../../../../models/QueueVo";
import {AbsBaseSaveItem} from "../../base-save-item/AbsBaseSaveItem";

@Component({
  selector: 'app-save-custom-content-item[dashboardItem]',
  templateUrl: './save-custom-content-item.component.html',
  styleUrls: ['./save-custom-content-item.component.css']
})
export class SaveCustomContentItemComponent extends AbsBaseSaveItem implements OnInit  {
 // @Input() dashboardEnum: DashboardEnum;
 //  @Input()  dashboardItem: DashboardItem;
  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
