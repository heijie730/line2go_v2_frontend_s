import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NotificationParam,TemplateType} from "../../../../../models/NotificationParam";
import {TagVo} from "../../../../../models/TagVo";
import {QueueVo, VoiceBoardCast} from "../../../../../models/QueueVo";
import {ToastService} from "../../../../../_helpers/toast.service";
import * as bootstrap from "bootstrap";
import { TtsService } from "../../../../../_helpers/tts.service";

@Component({
  selector: 'app-voice-board-cast',
  templateUrl: './voice-board-cast.component.html',
  styleUrls: ['./voice-board-cast.component.css']
})
export class VoiceBoardCastComponent implements OnInit, AfterViewInit {
  @Input() voiceBoardCast: VoiceBoardCast;
  @Input() queueVo: QueueVo;
  // @Output() openModalTrigger: EventEmitter<void> = new EventEmitter();
  // @Output() closeModalTrigger: EventEmitter<void> = new EventEmitter();
  currentNotificationParamTags: TagVo[] = [];
  currentNotificationParam: NotificationParam = new NotificationParam();
  currentNotificationParamIndex: number | null;
  TemplateType=TemplateType;
  constructor(private toastService: ToastService, private ttsService: TtsService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.onBoardCastTemplateChange();
    // });
  }

  addNotificationParamItem() {
    this.currentNotificationParamIndex = null;
    this.currentNotificationParam = new NotificationParam();
    this.currentNotificationParam.editable = true;
    let length = this.voiceBoardCast.template.notificationParams.length;
    this.currentNotificationParam.placeholder = '{' + length + '}';
    this.currentNotificationParamTags = this.queueVo.tags.map(x => x.toTagVo());
    // this.openModalTrigger.emit();
    this.showModal("notificationParamModal");
  }

  updateNotificationParamItem(item: NotificationParam, sameTagIndex: number) {
    this.currentNotificationParamIndex = sameTagIndex;
    this.currentNotificationParam = item;
    this.currentNotificationParamTags = this.queueVo.tags.map(x => x.toTagVo(item.tags));
    // this.openModalTrigger.emit();
    this.showModal("notificationParamModal");
  }

  removeNotificationParamItem(item: NotificationParam) {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      const index = this.voiceBoardCast.template.notificationParams.indexOf(item);
      if (index !== -1) {
        this.voiceBoardCast.template.notificationParams.splice(index, 1);
      }
    });
  }

  submitNotificationParam() {
    let tags = this.currentNotificationParamTags.filter(x => x.checked).map(x => x.toTag());
    if (tags.length == 0) {
      this.toastService.showErrorToast("You must select at least one tag");
      return;
    }
    if (!this.currentNotificationParam.placeholder) {
      this.toastService.showErrorToast("Incorrect parameter placeholder");
      return;
    }
    if (!this.currentNotificationParam.name) {
      this.toastService.showErrorToast("Incorrect parameter name");
      return;
    }
    if (!this.currentNotificationParam.exampleValue) {
      this.toastService.showErrorToast("Incorrect example value");
      return;
    }
    this.currentNotificationParam.tags = tags;
    if (this.currentNotificationParamIndex != null) {
      // Replace element in the array
      this.voiceBoardCast.template.notificationParams[this.currentNotificationParamIndex] = this.currentNotificationParam;
      this.currentNotificationParamIndex = null;
    } else {
      this.voiceBoardCast.template.notificationParams.push(this.currentNotificationParam);
    }
    this.closeModal("notificationParamModal");
    // this.showModal("tagMessageModal");
    // this.closeModalTrigger.emit();
  }

  onBoardCastTemplateChange() {
    let notificationParams = this.voiceBoardCast.template.notificationParams;
    let preview = this.voiceBoardCast.template.template;
    for (let notificationParam of notificationParams) {
      preview = preview?.replace(notificationParam.placeholder, notificationParam.exampleValue);
    }
    this.voiceBoardCast.template.preview = preview;
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

  closeModal(id: string): void {
    var myModalEl = document.getElementById(id);
    if (myModalEl) {
      var modal = bootstrap.Modal.getInstance(myModalEl);
      if (modal) {
        modal.hide();
      }
    }
  }

  // play() {
  //   let preview = this.voiceBoardCast.template.preview;
  //   let volume = this.voiceBoardCast.volume;
  //   let rate = this.voiceBoardCast.rate;
  //   let pitch = this.voiceBoardCast.pitch;
  //   this.ttsService.speak(preview, volume, rate, pitch);
  // }
}
