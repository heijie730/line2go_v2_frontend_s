import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { QueueService } from "../../../../../_services/queue.service";
// import { TagColors } from "../tagColors";
import { ToastService } from "../../../../../_helpers/toast.service";
import { QueueVo, Tag } from "../../../../../models/QueueVo";
import { TagVo } from "../../../../../models/TagVo";

@Component({
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.css']
})
export class EditTagComponent implements OnInit {
  index: number;
  // tagVo: TagVO = new TagVO();
  queueId: string;
  // tagColors: { color: string, enable: boolean }[] = TagColors;
  queueVo: QueueVo;
  tags: Tag[];
  tag: Tag = new Tag();
  selectedColor: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private queueService: QueueService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.index = params['index'];
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          this.queueVo = queueVo;
          this.tags = this.queueVo.tags;
          this.tag = this.tags[this.index];
        }
      });
    });
  }

  delete(): void {
    this.toastService.showConfirmAlert("Confirm Deletion?", () => {
      this.tags.splice(this.index, 1); // Remove element at the specified index
      let tagVo = new TagVo();
      tagVo.queueId = this.queueId;
      tagVo.tags = this.tags;
      this.queueService.saveTag(tagVo).subscribe({
        next: tagVo => {
          this.toastService.showSuccessToast("Deletion Successful");
          this.router.navigate(['/leader/tag-list', this.queueId]);
        }
      });
    });
  }

  submit(): void {
    this.tag.tagContent = this.tag.tagContent.trim();
    if (!this.tag.tagContent) {
      this.toastService.showErrorToast("Please enter tag content");
      return;
    }
    let tagsWithSameContent = this.queueVo.tags.filter(tag => tag.tagContent === this.tag.tagContent);
    if (tagsWithSameContent.length > 1) {
      this.toastService.showErrorToast("Tag content must be unique");
      return;
    }
    console.log(this.tag);
    let tagVo = new TagVo();
    tagVo.queueId = this.queueId;
    tagVo.tags = this.tags;
    this.queueService.saveTag(tagVo).subscribe({
      next: tagVo => {
        this.toastService.showSuccessToast("Tag edited successfully");
      }
    });
  }
}
