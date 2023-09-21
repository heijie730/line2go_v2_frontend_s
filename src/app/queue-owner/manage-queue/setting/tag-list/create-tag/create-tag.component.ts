import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { QueueService } from "../../../../../_services/queue.service";
import { ToastService } from "../../../../../_helpers/toast.service";
import { QueueVo, Tag } from "../../../../../models/QueueVo";
import { TagVo } from "../../../../../models/TagVo";

@Component({
  selector: 'app-create-tag',
  templateUrl: './create-tag.component.html',
  styleUrls: ['./create-tag.component.css']
})
export class CreateTagComponent implements OnInit {
  queueId: string;
  tag: Tag = new Tag();
  queueVo: QueueVo;

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.tag.color = '#007bff';
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.queueService.findById(this.queueId).subscribe({
        next: queueVO => {
          console.log('data', queueVO);
          this.queueVo = queueVO;
        },
        error: err => {
          console.log('Fail', err);
        }
      });
    })
  }

  // colorChange(color: string): void {
  //   console.log(color);
  //   this.tagVo.color = color;
  // }

  submit(): void {
    this.tag.tagContent = this.tag.tagContent.trim();
    if (!this.tag.tagContent) {
      this.toastService.showErrorToast("Please enter tag content.");
      return;
    }
    console.log(this.tag);
    let tags = this.queueVo.tags;
    let some = tags.some(tag => tag.tagContent === this.tag.tagContent);
    if (some) {
      this.toastService.showErrorToast("Tag content cannot be the same as existing tags.");
      return;
    }
    tags.push(this.tag);
    let tagVo = new TagVo();
    tagVo.queueId = this.queueId;
    tagVo.tags = tags;
    this.queueService.saveTag(tagVo).subscribe({
      next: tagVo => {
        this.toastService.showSuccessToast("Tag created successfully.");
        this.router.navigate(['/leader/edit-tag', this.queueId, tags.length - 1]);
      }
    })
  }
}
