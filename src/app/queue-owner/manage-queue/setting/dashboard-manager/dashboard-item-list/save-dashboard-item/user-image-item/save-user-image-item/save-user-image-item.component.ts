import {Component, Input, OnInit} from '@angular/core';
import {DashboardEnum, DashboardItem} from "../../../../../../../../models/QueueVo";
import {AbsBaseSaveItem} from "../../base-save-item/AbsBaseSaveItem";

@Component({
  selector: 'app-save-user-image-item[dashboardItem]',
  templateUrl: './save-user-image-item.component.html',
  styleUrls: ['./save-user-image-item.component.css']
})
export class SaveUserImageItemComponent  extends AbsBaseSaveItem  implements OnInit {
  // @Input() dashboardEnum: DashboardEnum;
  // @Input()  dashboardItem: DashboardItem;
  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
