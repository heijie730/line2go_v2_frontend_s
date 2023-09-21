import {Component, EventEmitter, Input, Output} from "@angular/core";
import {DashboardEnum, DashboardItem} from "../../../../../../../models/QueueVo";

@Component({
  template: ''
})
export abstract class AbsBaseDraggable {
  @Input() dashboardItem: DashboardItem ;
  @Input() dashboardEnum: DashboardEnum;
  @Output() deleteTrigger: EventEmitter<void> = new EventEmitter();
  @Output() editTrigger: EventEmitter<void> = new EventEmitter();
}
