import {Component, Input, OnInit} from '@angular/core';
import {DashboardItem, QueueVo} from "../../../../../../../../models/QueueVo";
import {DateTimeUtils} from "../../../../../../../../_utils/dateTimeUtils";
import {AbsBaseSaveItem} from "../../base-save-item/AbsBaseSaveItem";

@Component({
  selector: 'app-save-board-cast-item[dashboardItem][queueVo]',
  templateUrl: './save-board-cast-item.component.html',
  styleUrls: ['./save-board-cast-item.component.css']
})
export class SaveBoardCastItemComponent extends AbsBaseSaveItem  implements OnInit {

  // @Input()  dashboardItem: DashboardItem;
  @Input() queueVo:QueueVo;
  constructor(public dateTimeUtils: DateTimeUtils,) {
    super();
  }

  ngOnInit(): void {
  }
  afterDateChecked(date: Date): void {
    let yyyyMMdd = this.dateTimeUtils.yyyyMMddOrigin(date);
    this.dashboardItem.boardCastSetting.dateType.date = yyyyMMdd;
  }
}
