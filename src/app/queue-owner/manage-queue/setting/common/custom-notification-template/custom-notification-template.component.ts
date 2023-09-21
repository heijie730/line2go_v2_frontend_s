import {Component, Input, OnInit} from '@angular/core';
import {
  buildEmailMsgTemplate,
  findSystemParam,
  NotificationParam,
  TemplateType
} from "../../../../../models/NotificationParam";
import {BaseNotification, QueueVo, VoiceBoardCast} from "../../../../../models/QueueVo";
import {TagVo} from "../../../../../models/TagVo";
import * as bootstrap from "bootstrap";
import {ToastService} from "../../../../../_helpers/toast.service";
import {TtsService} from "../../../../../_helpers/tts.service";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

@Component({
  selector: 'app-custom-notification-template[baseNotification][queueVo][templateType]',
  templateUrl: './custom-notification-template.component.html',
  styleUrls: ['./custom-notification-template.component.css']
})
export class CustomNotificationTemplateComponent implements OnInit {
  @Input() queueVo: QueueVo;
  @Input() baseNotification: BaseNotification;
  @Input() templateType: TemplateType
  currentNotificationParamTags: TagVo[] = [];
  currentNotificationParam: NotificationParam = new NotificationParam();
  currentNotificationParamIndex: number | null;

  constructor(
    private modalService: NgbModal,
    private toastService: ToastService,
    private ttsService: TtsService
  ) {}

  ngOnInit(): void {}

  addNotificationParamItem(notificationParamModal: any) {
    console.log(this.templateType)
    let notificationTemplate = findSystemParam(this.templateType);
    let sysParams = notificationTemplate.notificationParams.filter(x => !x.editable)
      .filter(x => !this.baseNotification.template.notificationParams.map(k => k.name).includes(x.name));
    if (sysParams.length > 0) {
      let queueMap: { [key: string]: string } = {};
      sysParams.forEach(x => {
        queueMap[x.name] = x.name;
      });
      queueMap['Custom Parameter']='Custom Parameter';
      Swal.fire({
        title: 'Please select a parameter',
        input: 'select',
        inputOptions: queueMap,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        inputValidator: (value) => {
          if (!value) {
            return 'Please select a parameter';
          }
          return null;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const userChoice = result.value;
          // 处理用户的选择
          console.log('用户的选择:', userChoice);
          if (userChoice=='Custom Parameter'){
            this.addParam(notificationParamModal);
          } else {
            let notificationParam = sysParams.filter(x => x.name == userChoice)[0];
            this.baseNotification.template.notificationParams.push(notificationParam);
          }
        }
      });
    } else {
      this.addParam(notificationParamModal);
    }
  }

// 在你的 Angular 组件中，保存当前打开的 modal 的引用
  currentModal: NgbModalRef;

  addParam(notificationParamModal: any) {
    this.currentNotificationParamIndex = null;
    this.currentNotificationParam = new NotificationParam();
    this.currentNotificationParam.editable = true;
    let length = this.baseNotification.template.notificationParams.length;
    this.currentNotificationParam.placeholder = '{' + length + '}';
    this.currentNotificationParamTags = this.queueVo.tags.map(x => x.toTagVo());
    this.currentModal = this.modalService.open(notificationParamModal);
  }

  updateNotificationParamItem(
    notificationParamModal: any,
    item: NotificationParam,
    sameTagIndex: number
  ) {
    this.currentNotificationParamIndex = sameTagIndex;
    this.currentNotificationParam = item;
    this.currentNotificationParamTags = this.queueVo.tags.map(x =>
      x.toTagVo(item.tags)
    );
    this.currentModal =  this.modalService.open(notificationParamModal);
  }

  removeNotificationParamItem(item: NotificationParam) {
    this.toastService.showConfirmAlert("Confirm Deletion?", () => {
      const index = this.baseNotification.template.notificationParams.indexOf(
        item
      );
      if (index !== -1) {
        this.baseNotification.template.notificationParams.splice(index, 1);
      }
    });
  }

  submitNotificationParam() {
    let tags = this.currentNotificationParamTags.filter(x => x.checked).map(x =>
      x.toTag()
    );
    if (tags.length === 0) {
      this.toastService.showErrorToast("Must select at least one tag");
      return;
    }
    if (!this.currentNotificationParam.placeholder) {
      this.toastService.showErrorToast("Incorrect parameter placeholder tag");
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
    if (this.currentNotificationParamIndex !== null) {
      this.baseNotification.template.notificationParams[
        this.currentNotificationParamIndex
        ] = this.currentNotificationParam;
      this.currentNotificationParamIndex = null;
    } else {
      this.baseNotification.template.notificationParams.push(
        this.currentNotificationParam
      );
    }
    // this.modalService.dismissAll();
    this.currentModal.close();
  }

  onBoardCastTemplateChange() {
    let notificationParams = this.baseNotification.template.notificationParams;
    let preview = this.baseNotification.template.template;
    for (let notificationParam of notificationParams) {
      preview = preview?.replace(
        notificationParam.placeholder,
        notificationParam.exampleValue
      );
    }
    this.baseNotification.template.preview = preview;
  }

  play() {
    let baseNotification1 = this.baseNotification as VoiceBoardCast;
    let preview = baseNotification1.template.preview;
    let volume = baseNotification1.volume;
    let rate = baseNotification1.rate;
    let pitch = baseNotification1.pitch;
    this.ttsService.speak(preview, volume, rate, pitch);
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
}
