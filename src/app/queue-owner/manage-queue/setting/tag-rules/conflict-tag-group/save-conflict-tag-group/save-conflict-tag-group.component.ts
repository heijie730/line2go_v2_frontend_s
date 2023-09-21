import { Component, OnInit } from '@angular/core';
import { ConflictGroup, QueueVo, Tag, TagRules } from "../../../../../../models/QueueVo";
import { TagVo } from "../../../../../../models/TagVo";
import { ActivatedRoute, Router } from "@angular/router";
import { QueueService } from "../../../../../../_services/queue.service";
import { ToastService } from "../../../../../../_helpers/toast.service";
import { Location } from "@angular/common";

@Component({
  selector: 'app-save-conflict-tag-group',
  templateUrl: './save-conflict-tag-group.component.html',
  styleUrls: ['./save-conflict-tag-group.component.css']
})
export class SaveConflictTagGroupComponent implements OnInit {

  queueId: string;
  queueVo: QueueVo;
  tagRules: TagRules;
  index: number;
  title: string;
  tags: Tag[];
  tagVos: TagVo[] = [];
  conflictGroup: ConflictGroup = new ConflictGroup();

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.index = params['index'];
      if (this.index) {
        this.title = 'Edit Duplicate Tag Group';
      } else {
        this.title = 'Create Duplicate Tag Group';
      }
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          console.log(queueVo);
          this.queueVo = queueVo;
          this.tagRules = this.queueVo.tagRules;
          if (this.index) {
            this.conflictGroup = this.tagRules.conflictGroups[this.index];
          } else {
            this.conflictGroup = new ConflictGroup();
          }
          this.tags = this.queueVo.tags;
          this.tagVos = this.tags.map(x => x.toTagVo(this.conflictGroup.tags));
        }
      });
    });
  }

  delete(): void {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      this.tagRules.conflictGroups.splice(this.index, 1);
      this.queueVo.tagRules = this.tagRules;
      this.queueService.updateTagRules(this.queueVo).subscribe({
        next: queueVo => {
          console.log('Success', queueVo);
          this.toastService.showSuccessToast('Deleted successfully');
          if (this.index) {
            this.router.navigate(['/leader/conflict-tag-group', this.queueId]);
          } else {
            this.router.navigate(['/leader/conflict-tag-group', this.queueId]);
          }
        },
        error: err => {
          this.toastService.showErrorToast("Operation failed", "Server error");
        }
      });
    });
  }

  submit(): void {
    let checkedTags = this.tagVos.filter(x => x.checked);
    if (checkedTags.length == 0) {
      this.toastService.showErrorToast("Please select at least one tag");
      return;
    }
    this.conflictGroup.tags = checkedTags.map(x => x.toTag());
    if (this.index) {
      this.tagRules.conflictGroups[this.index] = this.conflictGroup;
    } else {
      this.tagRules.conflictGroups.push(this.conflictGroup);
    }
    this.queueVo.tagRules = this.tagRules;
    this.queueService.updateTagRules(this.queueVo).subscribe({
      next: queueVo => {
        console.log('Success', queueVo);
        this.toastService.showSuccessToast('Updated successfully');
        if (this.index) {
          this.router.navigate(['/leader/save-conflict-tag-group', this.queueId, this.index]);
        } else {
          this.router.navigate(['/leader/save-conflict-tag-group', this.queueId, this.tagRules.conflictGroups.length - 1]);
        }
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }
}
