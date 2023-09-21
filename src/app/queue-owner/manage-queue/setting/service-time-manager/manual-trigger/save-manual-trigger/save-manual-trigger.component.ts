import { Component, OnInit } from '@angular/core';
import {
  ConflictGroup,
  ManualTriggerServiceTimeItem,
  QueueVo,
  ServiceTimeManager,
  Tag,
  TagRules
} from "../../../../../../models/QueueVo";
import { TagVo } from "../../../../../../models/TagVo";
import { ActivatedRoute, Router } from "@angular/router";
import { QueueService } from "../../../../../../_services/queue.service";
import { ToastService } from "../../../../../../_helpers/toast.service";
import { Location } from "@angular/common";

@Component({
  selector: 'app-save-manual-trigger',
  templateUrl: './save-manual-trigger.component.html',
  styleUrls: ['./save-manual-trigger.component.css']
})
export class SaveManualTriggerComponent implements OnInit {

  queueId: string;
  queueVo: QueueVo;
  serviceTimeManager: ServiceTimeManager;
  index: number;
  title: string;
  tags: Tag[];
  tagVos: TagVo[] = [];
  currentItem: ManualTriggerServiceTimeItem;

  constructor(
    private activateRoute: ActivatedRoute,
    private queueService: QueueService,
    private toastService: ToastService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.index = params['index'];
      if (this.index) {
        this.title = 'Edit';
      } else {
        this.title = 'Create';
      }
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          console.log(queueVo);
          this.queueVo = queueVo;
          this.serviceTimeManager = this.queueVo.serviceTimeManager;
          if (this.index) {
            this.currentItem = this.serviceTimeManager.manualTriggerItemList[this.index];
          } else {
            this.currentItem = new ManualTriggerServiceTimeItem();
          }
          this.tags = this.queueVo.tags;
          this.tagVos = this.tags.map(x => x.toTagVo(this.currentItem.tags));
        }
      });
    });
  }

  delete(): void {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      this.serviceTimeManager.manualTriggerItemList.splice(this.index, 1);
      this.queueVo.serviceTimeManager = this.serviceTimeManager;
      this.queueService.updateServiceTimeManager(this.queueVo).subscribe({
        next: queueVo => {
          console.log('Success', queueVo);
          this.toastService.showSuccessToast('Deleted successfully');
          this.router.navigate(['/leader/manual-trigger', this.queueId]);
        },
        error: err => {
          this.toastService.showErrorToast("Operation failed", "Server error");
        }
      });
    });
  }

  submit(): void {
    let checkedTags = this.tagVos.filter(x => x.checked);
    if (checkedTags.length === 0) {
      this.toastService.showErrorToast("Please select at least one tag");
      return;
    }
    this.currentItem.tags = checkedTags.map(x => x.toTag());
    if (this.index) {
      this.serviceTimeManager.manualTriggerItemList[this.index] = this.currentItem;
    } else {
      this.serviceTimeManager.manualTriggerItemList.push(this.currentItem);
    }
    this.queueVo.serviceTimeManager = this.serviceTimeManager;
    this.queueService.updateServiceTimeManager(this.queueVo).subscribe({
      next: queueVo => {
        console.log('Success', queueVo);
        this.toastService.showSuccessToast('Updated successfully');
        if (this.index) {
          this.router.navigate(['/leader/save-manual-trigger', this.queueId, this.index]);
        } else {
          this.router.navigate(['/leader/save-manual-trigger', this.queueId, this.serviceTimeManager.manualTriggerItemList.length - 1]);
        }
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }
}
