import {Component, Input} from "@angular/core";
import {DashboardItem} from "../../../../../../../models/QueueVo";

@Component({
  template: ''
})
export abstract class AbsBaseSaveItem{
  @Input() dashboardItem: DashboardItem ;

}
