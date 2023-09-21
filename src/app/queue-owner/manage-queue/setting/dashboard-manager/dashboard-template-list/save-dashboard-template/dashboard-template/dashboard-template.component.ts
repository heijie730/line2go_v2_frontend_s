import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {DashboardEnum, DashboardItem, DashboardTemplate, QueueVo} from "../../../../../../../models/QueueVo";
import {CdkDrag, CdkDragEnd} from "@angular/cdk/drag-drop";
import {AwsService} from "../../../../../../../_services/aws-service.service";
import * as bootstrap from "bootstrap";

@Component({
  selector: 'app-dashboard-template[dashboardTemplate][queueVo][imageKey][dashboardEnum]',
  templateUrl: './dashboard-template.component.html',
  styleUrls: ['./dashboard-template.component.css']
})
export class DashboardTemplateComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() dashboardTemplate: DashboardTemplate = new DashboardTemplate();
  @ViewChild('draggedElement', {static: true}) draggedElement: ElementRef<HTMLElement>;
  @ViewChild('dragElement')
  dragElement!: CdkDrag;
  @Input() queueVo: QueueVo;
  // @Output() saveListener: EventEmitter<void> = new EventEmitter();
  @Input() imageKey: string;
  @Input() dashboardEnum: DashboardEnum;
  url: string = '';
  disabledDragging: boolean = false;
  @Input() isTopLevel: boolean = true;
  @Output() deleteTrigger: EventEmitter<void> = new EventEmitter();
  @Output() submitTrigger: EventEmitter<void> = new EventEmitter();

  constructor(private awsService: AwsService) {

  }

  delete() {
    this.deleteTrigger.emit();
  }

  setPosition() {
    this.dragElement.setFreeDragPosition(this.dashboardTemplate);
  }

  ngOnInit(): void {
    let newVar = (this.dashboardEnum == 'DASHBOARD_EDIT'
      || this.dashboardEnum == 'DASHBOARD_PRO'
    ) ? this.dashboardTemplate : {x: 0, y: 0};
    console.log("newVar",newVar);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('imageKey' in changes) {
      console.log('myObject changed:', changes['imageKey'].currentValue);
      if (this.imageKey) {
        this.awsService.getFileUrl(this.imageKey).subscribe({
          next: data => {
            this.url = data;
            console.log("url = ", this.url)
          }
        })
      }
    }
  }

  ngAfterViewInit() {
    const element = this.draggedElement.nativeElement;
    const resizeObserver = new ResizeObserver(entries => {
      this.dashboardTemplate.width = this.draggedElement.nativeElement.offsetWidth;
      this.dashboardTemplate.height = this.draggedElement.nativeElement.offsetHeight;
    });
    resizeObserver.observe(element);
  }

  onDragEnd(event: CdkDragEnd) {
    const newPosition = event.source.getFreeDragPosition();
    this.dashboardTemplate.x = newPosition.x;
    this.dashboardTemplate.y = newPosition.y;
  }


  // deleteTemplate(template: DashboardTemplate) {
  //   let dashboardTemplates = this.dashboardTemplate.dashboardTemplateList;
  //   const index = dashboardTemplates.indexOf(template);
  //   if (index !== -1) {
  //     dashboardTemplates.splice(index, 1);
  //   }
  //   console.log(this.dashboardTemplate.dashboardTemplateList);
  // }

  deleteItem(item: DashboardItem) {
    let dashboardItemList = this.dashboardTemplate.dashboardItemList;
    const index = dashboardItemList.indexOf(item);
    if (index !== -1) {
      dashboardItemList.splice(index, 1);
    }
    console.log(this.dashboardTemplate.dashboardItemList);
  }

  dashboardItem: DashboardItem;

  openItem(dashboardItem: DashboardItem) {
    this.dashboardItem = dashboardItem;
    if (this.dashboardItem) {
      if (this.dashboardEnum == 'TEMPLATE_EDIT' || this.dashboardEnum == 'DASHBOARD_EDIT') {
        this.showModal('dashboardItemModal');
      }
    }
  }
  submit():void{
    this.submitTrigger.emit();
  }

  showModal(id: string): void {
    const myModalEl = document.getElementById(id);
    if (myModalEl) {
      const modal = new bootstrap.Modal(myModalEl);
      modal.show();
    } else {
      console.error(`Modal element with ID ${id} not found.`);
    }
  }
}
