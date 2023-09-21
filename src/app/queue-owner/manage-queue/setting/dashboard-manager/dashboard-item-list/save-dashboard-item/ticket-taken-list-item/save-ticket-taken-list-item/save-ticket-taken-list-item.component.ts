import { Component, Input, OnInit } from '@angular/core';
import { DashboardEnum, DashboardItem, DisplayRule, QueueVo, TagMessage } from "../../../../../../../../models/QueueVo";
import { TagVo } from "../../../../../../../../models/TagVo";
import * as bootstrap from "bootstrap";
import { DateTimeUtils } from "../../../../../../../../_utils/dateTimeUtils";
import { ToastService } from "../../../../../../../../_helpers/toast.service";
import { NotificationParam } from "../../../../../../../../models/NotificationParam";
import { TtsService } from "../../../../../../../../_helpers/tts.service";
import { AbsBaseSaveItem } from "../../base-save-item/AbsBaseSaveItem";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: 'app-save-ticket-taken-list-item[dashboardItem][queueVo]',
  templateUrl: './save-ticket-taken-list-item.component.html',
  styleUrls: ['./save-ticket-taken-list-item.component.css']
})
export class SaveTicketTakenListItemComponent extends AbsBaseSaveItem implements OnInit {

  @Input() queueVo: QueueVo;
  currentTagMessageTags: TagVo[] = [];
  currentTagMessage: TagMessage = new TagMessage();
  currentTagMessageIndex: number | null;

  currentDisplayRuleTags: TagVo[] = [];
  currentDisplayRule: DisplayRule = new DisplayRule();
  currentDisplayRuleIndex: number | null;

  constructor(public dateTimeUtils: DateTimeUtils, private toastService: ToastService,
              private modalService: NgbModal,
              private ttsService: TtsService) {
    super();
  }

  ngOnInit(): void {
  }

  afterDateChecked(date: Date): void {
    let yyyyMMdd = this.dateTimeUtils.yyyyMMddOrigin(date);
    this.dashboardItem.ticketTakenListSetting.dateType.date = yyyyMMdd;
  }
// 在你的 Angular 组件中，保存当前打开的 modal 的引用
  currentModal: NgbModalRef;

  addTagMessageItem(content: any) {
    this.currentTagMessageIndex = null;
    this.currentTagMessage = new TagMessage();
    this.currentTagMessageTags = this.queueVo.tags.map(x => x.toTagVo());
    this.onBoardCastTemplateChange();
    // this.showModal("tagMessageModal");
    this.currentModal = this.modalService.open(content);
  }

  updateTagMessageItem(item: TagMessage, sameTagIndex: number,content: any) {
    console.log("updateItem", sameTagIndex)
    this.currentTagMessageIndex = sameTagIndex;
    this.currentTagMessage = item;
    this.currentTagMessageTags = this.queueVo.tags.map(x => x.toTagVo(item.tags));
    this.onBoardCastTemplateChange();
    // this.showModal("tagMessageModal");
    this.currentModal = this.modalService.open(content);
  }

  removeTagMessageItem(item: TagMessage) {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      const index = this.dashboardItem.ticketTakenListSetting.tagMessages.indexOf(item);
      if (index !== -1) {
        this.dashboardItem.ticketTakenListSetting.tagMessages.splice(index, 1);
      }
    });
  }

  addDisplayRuleItem() {
    this.currentDisplayRuleIndex = null;
    this.currentDisplayRule = new DisplayRule();
    this.currentDisplayRuleTags = this.queueVo.tags.map(x => x.toTagVo());
    this.showModal("displayRuleModal");
  }

  updateDisplayRuleItem(item: DisplayRule, sameTagIndex: number) {
    console.log("updateItem", sameTagIndex)
    this.currentDisplayRuleIndex = sameTagIndex;
    this.currentDisplayRule = item;
    this.currentDisplayRuleTags = this.queueVo.tags.map(x => x.toTagVo(item.tags));
    this.showModal("displayRuleModal");
  }

  removeDisplayRuleItem(item: DisplayRule) {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      const index = this.dashboardItem.ticketTakenListSetting.displayRules.indexOf(item);
      if (index !== -1) {
        this.dashboardItem.ticketTakenListSetting.displayRules.splice(index, 1);
      }
    });
  }

  submitTagMessage() {
    let tags = this.currentTagMessageTags.filter(x => x.checked).map(x => x.toTag());
    if (tags.length == 0) {
      this.toastService.showErrorToast("You must select at least one tag");
      return;
    }
    this.currentTagMessage.tags = tags;
    if (this.currentTagMessageIndex != null) {
      // Replace element in the array
      this.dashboardItem.ticketTakenListSetting.tagMessages[this.currentTagMessageIndex] = this.currentTagMessage;
      this.currentTagMessageIndex = null;
    } else {
      this.dashboardItem.ticketTakenListSetting.tagMessages.push(this.currentTagMessage);
    }
    // this.closeModal("tagMessageModal");
    this.currentModal.close()
  }

  submitDisplayRule() {
    let tags = this.currentDisplayRuleTags.filter(x => x.checked).map(x => x.toTag());
    if (tags.length == 0) {
      this.toastService.showErrorToast("You must select at least one tag");
      return;
    }
    if (!this.currentDisplayRule.displayOptionEnum) {
      this.toastService.showErrorToast("Please select a display option");
      return;
    }
    this.currentDisplayRule.tags = tags;
    if (this.currentDisplayRuleIndex != null) {
      // Replace element in the array
      this.dashboardItem.ticketTakenListSetting.displayRules[this.currentDisplayRuleIndex] = this.currentDisplayRule;
      this.currentDisplayRuleIndex = null;
    } else {
      this.dashboardItem.ticketTakenListSetting.displayRules.push(this.currentDisplayRule);
    }
    this.closeModal("displayRuleModal");
  }

  onBoardCastTemplateChange() {
    let notificationParams = this.currentTagMessage.voiceBoardCast.template.notificationParams;
    let preview = this.currentTagMessage.voiceBoardCast.template.template;
    for (let notificationParam of notificationParams) {
      preview = preview?.replace(notificationParam.placeholder, notificationParam.exampleValue);
    }
    this.currentTagMessage.voiceBoardCast.template.preview = preview;
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
