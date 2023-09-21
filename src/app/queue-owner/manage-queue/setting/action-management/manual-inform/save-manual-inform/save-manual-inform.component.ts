import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../../_services/queue.service";
import {ToastService} from "../../../../../../_helpers/toast.service";
import {Location} from "@angular/common";
import {InformItem, QueueVo, Tag} from "../../../../../../models/QueueVo";
import {TagVo} from "../../../../../../models/TagVo";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {InformMembersVo} from "../../../../../../models/InformMembersVo";
import {NotificationParam, TemplateType} from "../../../../../../models/NotificationParam";

@Component({
  selector: 'app-save-manual-inform',
  templateUrl: './save-manual-inform.component.html',
  styleUrls: ['./save-manual-inform.component.css']
})
export class SaveManualInformComponent implements OnInit {
  queueId: string;
  index: number;
  informItems: InformItem[];
  queueVo: QueueVo;
  currentItem: InformItem = new InformItem();
  title = "";
  informWithTagVos: TagVo[] = [];
  // smsTagVos: TagVo[] = [];
  TemplateType=TemplateType;
  // @ViewChild('playTimes') playTimes: any;
  // @ViewChild('playTimesField', { read: ElementRef }) playTimesField: ElementRef;

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
      this.queueService.getDefaultInformItem().subscribe(
        {
          next: informMembersVO => {
            this.currentItem = informMembersVO.informItem;
            this.queueService.findById(this.queueId).subscribe(
              {
                next: queueVo => {
                  this.queueVo = queueVo;
                  this.informItems = this.queueVo.manualNotification.informItems;
                  if (this.index) {
                    this.title = 'Edit Manual Notification Template';
                    this.currentItem = this.informItems[this.index];
                  } else {
                    this.title = 'Create Manual Notification Template';
                    this.informItems.push(this.currentItem);
                  }
                  console.log(this.currentItem);
                  let tags = this.queueVo.tags;
                  this.informWithTagVos = tags.map(x => x.toTagVo(this.currentItem.informWithTags));
                  // this.smsTagVos = tags.map(x => x.toTagVo(this.currentItem.sendSms.tags));
                }
              }
            )
          }
        }
      )
    });
  }

  createTagVos(tags: Tag[], currentItemTags: Tag[]): TagVo[] {
    return tags.map(x => {
      let tagVo1 = new TagVo();
      tagVo1.tagContent = x.tagContent;
      tagVo1.tagDesc = x.tagDesc;
      tagVo1.color = x.color;
      tagVo1.checked = currentItemTags?.some(tag => tag.tagContent === x.tagContent);
      return tagVo1;
    });
  }

  delete(): void {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      this.informItems.splice(this.index, 1);
      this.queueVo.manualNotification.informItems = this.informItems;
      this.queueService.updateManualInform(this.queueVo).subscribe({
        next: queueVo => {
          console.log('Success', queueVo);
          this.toastService.showSuccessToast('Deleted successfully');
          if (this.index) {
            this.router.navigate(['/leader/manual-inform', this.queueId]);
          } else {
            this.router.navigate(['/leader/manual-inform', this.queueId]);
          }
        },
        error: err => {
          this.toastService.showErrorToast("Operation failed", "Server error");
        }
      });
    });
  }

  submit(): void {
    // if (this.playTimes.errors) {
    //   this.toastService.showErrorToast("Input error");
    //   this.playTimesField.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    //   return;
    // }
    let informWithTagVos = this.informWithTagVos.filter(x => x.checked).map(x => x.toTag());
    // let smsTags = this.smsTagVos.filter(x => x.checked).map(x => x.toTag());
    this.currentItem.informWithTags = informWithTagVos;
    // this.currentItem.sendSms.tags = smsTags;
    this.queueVo.id = this.queueId;
    this.queueVo.manualNotification.informItems = this.informItems;
    console.log(this.informItems);
    this.queueService.updateManualInform(this.queueVo).subscribe({
      next: queueVo => {
        console.log('Success', queueVo);
        this.toastService.showSuccessToast('Updated successfully');
        if (this.index) {
          this.router.navigate(['/leader/save-inform', this.queueId, this.index]);
        } else {
          this.router.navigate(['/leader/save-inform', this.queueId, this.informItems.length - 1]);
        }
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }

  onBoardCastTemplateChange() {
    let notificationParams = this.currentItem.boardCastMsg.template.notificationParams;
    let template = this.currentItem.boardCastMsg.template.template;
    let preview = this.currentItem.boardCastMsg.template.preview;
    for (let notificationParam of notificationParams) {
      preview = template.replace(notificationParam.placeholder, notificationParam.exampleValue);
    }
    this.currentItem.boardCastMsg.template.preview = preview;
  }
}
