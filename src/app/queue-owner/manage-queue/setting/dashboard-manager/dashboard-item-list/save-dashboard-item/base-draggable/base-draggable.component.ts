import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {DashboardEnum, DashboardItem} from "../../../../../../../models/QueueVo";
import {CdkDrag, CdkDragEnd} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-base-draggable',
  templateUrl: './base-draggable.component.html',
  // styleUrls: ['./dashboard-manager.component.css']
})
export class BaseDraggable implements OnInit, AfterViewInit {
  @Input() dashboardItem: DashboardItem ;
  @Input() dashboardEnum: DashboardEnum;
  @Output() deleteTrigger: EventEmitter<void> = new EventEmitter();
  @Output() editTrigger: EventEmitter<void> = new EventEmitter();
  @ViewChild('draggedElement', {static: true}) draggedElement: ElementRef<HTMLElement>;
  @ViewChild('dragElement')
  dragElement!: CdkDrag;

  disabledDragging: boolean = false;

  ngOnInit(): void {
    // let newVar = (this.dashboardEnum=='DASHBOARD_EDIT'
    //   ||this.dashboardEnum=='DASHBOARD_PRO'||this.dashboardEnum=='TEMPLATE_EDIT'
    // )?this.dashboardItem: {x:0,y:0};
    // console.log("BaseDraggable dashboardEnum",this.dashboardEnum)
    // console.log("BaseDraggable newVar",newVar)
  }

  ngAfterViewInit() {
    const element = this.draggedElement.nativeElement;
    const resizeObserver = new ResizeObserver(entries => {
      this.dashboardItem.width = this.draggedElement.nativeElement.offsetWidth;
      this.dashboardItem.height = this.draggedElement.nativeElement.offsetHeight;
    });
    resizeObserver.observe(element);
  }

  edit() {
    this.editTrigger.emit();
  }
  delete() {
    this.deleteTrigger.emit();
  }

  onDragEnd(event: CdkDragEnd) {
    const newPosition = event.source.getFreeDragPosition();
    this.dashboardItem.x = newPosition.x;
    this.dashboardItem.y = newPosition.y;
  }

  // setPosition() {
  //   this.dragElement.setFreeDragPosition(this.dashboardItem);
  // }

  mousemove(event: MouseEvent) {
    if (this.dashboardEnum == DashboardEnum.DASHBOARD_PRO) {
      this.disabledDragging = true;
    }
    if (this.dashboardEnum == DashboardEnum.DASHBOARD_EDIT ||
      this.dashboardEnum == DashboardEnum.TEMPLATE_EDIT ||
      this.dashboardEnum == DashboardEnum.ITEM_EDIT
    ) {
      const resizeHandleSize = 24; // 调整大小句柄的尺寸
      const element = this.draggedElement.nativeElement;
      const rect = element.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      // 检查点击位置是否在右下角的resize区域
      this.disabledDragging = mouseX > rect.width - resizeHandleSize &&
        mouseY > rect.height - resizeHandleSize;
    }
  }
}
