import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  QueueVo, TicketDateRulePo, TicketTakenDateRangeRulePo, TicketTakenPasswordRulePo,
  TicketTakenRuleItem,
  TicketTakenSameTagRulePo, TicketTakenTimeRangeRulePo, TicketTakenVipRulePo
} from "../../../../../../models/QueueVo";
import {TagVo} from "../../../../../../models/TagVo";
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../../_services/queue.service";
import {ToastService} from "../../../../../../_helpers/toast.service";
import {Location} from "@angular/common";
import * as bootstrap from "bootstrap";
import flatpickr from "flatpickr";
import {BoardCastComponent} from "../../../../../../share/board-cast/board-cast.component";
import {TimeRangeComponent} from "../../../../../../share/time-range/time-range.component";
import {NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";
import {TemplateType} from "../../../../../../models/NotificationParam";

@Component({
  selector: 'app-save-ticket-taken-rule-item',
  templateUrl: './save-ticket-taken-rule-item.component.html',
  styleUrls: ['./save-ticket-taken-rule-item.component.css'],
  // providers: [NgbModalConfig, NgbModal],
})
export class SaveTicketTakenRuleItemComponent implements OnInit {
  queueId: string;
  index: number;
  itemList: TicketTakenRuleItem[];
  queueVo: QueueVo;
  currentItem: TicketTakenRuleItem = new TicketTakenRuleItem();
  title = "";
  // tags: Tag[];
  // tagVos: TagVo[] = [];
  // smsTagVos: TagVo[] = [];
  currentSameTagVos: TagVo[] = [];
  currentSameTag: TicketTakenSameTagRulePo = new TicketTakenSameTagRulePo();
  currentSameTagIndex: number | null;

  currentPasswordVos: TagVo[] = [];
  currentPassword: TicketTakenPasswordRulePo = new TicketTakenPasswordRulePo();
  currentPasswordIndex: number | null;

  currentVIPVos: TagVo[] = [];
  currentVIP: TicketTakenVipRulePo = new TicketTakenVipRulePo();
  currentVIPIndex: number | null;

  currentTimeRange: TicketTakenTimeRangeRulePo = new TicketTakenTimeRangeRulePo();
  currentTimeRangeIndex: number | null;
  // private startDateInput: HTMLInputElement;
  // private endDateInput: HTMLInputElement;
  @ViewChild(TimeRangeComponent) timeRangeComponent: TimeRangeComponent;

  currentDateRange: TicketTakenDateRangeRulePo = new TicketTakenDateRangeRulePo();
  currentDateRangeIndex: number | null;

  currentTicketDate: TicketDateRulePo = new TicketDateRulePo();
  currentTicketDateIndex: number | null;
  TemplateType= TemplateType

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location,
              config: NgbModalConfig, private modalService: NgbModal,
              private router: Router) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.index = params['index'];
      this.queueService.getDefaultTicketTakenRuleItem().subscribe(
        {
          next: informMembersVO => {
            this.currentItem = informMembersVO.ticketTakenRuleItem;
            this.queueService.findById(this.queueId).subscribe(
              {
                next: queueVo => {
                  this.queueVo = queueVo;
                  this.itemList = this.queueVo.ticketTakenRuleManager.ticketTakenRuleItemList;
                  if (this.index) {
                    this.title = 'Edit Ticket Taken Rule Template';
                    this.currentItem = this.itemList[this.index];
                  } else {
                    this.title = 'Create Ticket Taken Rule Template';
                    this.currentItem.title += this.itemList.length;
                    this.itemList.push(this.currentItem);
                  }
                }
              }
            )
          }
        }
      )
    });
  }


  addSameTagItem() {
    this.currentSameTagIndex = null;
    this.currentSameTag = new TicketTakenSameTagRulePo();
    this.currentSameTag.title = this.currentSameTag.title + (this.currentItem.beforeTicketTaken.ticketTakenSameTagRulePos.length + 1)
    this.currentSameTagVos = this.queueVo.tags.map(x => x.toTagVo());
    this.showModal("userTicketTakenSameTagModal");
  }

  updateSameTagItem(item: TicketTakenSameTagRulePo, sameTagIndex: number) {
    console.log("updateItem", sameTagIndex)
    this.currentSameTagIndex = sameTagIndex;
    this.currentSameTag = item;
    this.currentSameTagVos = this.queueVo.tags.map(x => x.toTagVo(item.tags));
    this.showModal("userTicketTakenSameTagModal");
  }

  removeSameTagItem(item: TicketTakenSameTagRulePo) {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      const index = this.currentItem.beforeTicketTaken.ticketTakenSameTagRulePos.indexOf(item);
      if (index !== -1) {
        this.currentItem.beforeTicketTaken.ticketTakenSameTagRulePos.splice(index, 1);
      }
    });
  }


  submitSameTagRule() {
    let tags = this.currentSameTagVos.filter(x => x.checked).map(x => x.toTag());
    if (tags.length == 0) {
      this.toastService.showErrorToast("You must select at least one tag.");
      return;
    }
    if (!this.currentSameTag.title) {
      this.toastService.showErrorToast("You must enter a rule name.");
      return;
    }
    let length = this.currentItem.beforeTicketTaken.ticketTakenSameTagRulePos.filter(x => x.title == this.currentSameTag.title).length;
    if ((this.currentSameTagIndex != null && length > 1) || (this.currentSameTagIndex == null && length == 1)) {
      this.toastService.showErrorToast("Rule name must not duplicate with existing ones.");
      return;
    }
    if (this.currentSameTag.allowTakenCount == null) {
      this.toastService.showErrorToast("Maximum quota cannot be empty.");
      return;
    }
    if (this.currentSameTag.allowTakenCount < 0) {
      this.toastService.showErrorToast("Maximum quota cannot be less than 0.");
      return;
    }
    this.currentSameTag.tags = tags;
    if (this.currentSameTagIndex != null) {
      // Replace the element within the array
      this.currentItem.beforeTicketTaken.ticketTakenSameTagRulePos[this.currentSameTagIndex] = this.currentSameTag;
      this.currentSameTagIndex = null;
    } else {
      console.log(this.currentSameTag);
      this.currentItem.beforeTicketTaken.ticketTakenSameTagRulePos.push(this.currentSameTag);
    }
    this.closeModal("userTicketTakenSameTagModal");
  }


  addPasswordItem() {
    this.currentPasswordIndex = null;
    this.currentPassword = new TicketTakenPasswordRulePo();
    // this.currentPassword.title = this.currentPassword.title + (this.currentItem.beforeTicketTaken.ticketTakenPasswordRulePos.length + 1)
    this.currentPasswordVos = this.queueVo.tags.map(x => x.toTagVo());
    this.showModal("userTicketTakenPasswordModal");
  }

  updatePasswordItem(item: TicketTakenPasswordRulePo, passwordIndex: number) {
    console.log("updateItem", passwordIndex)
    this.currentPasswordIndex = passwordIndex;
    this.currentPassword = item;
    this.currentPasswordVos = this.queueVo.tags.map(x => x.toTagVo(item.tags));
    this.showModal("userTicketTakenPasswordModal");
  }

  removePasswordItem(item: TicketTakenPasswordRulePo) {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      const index = this.currentItem.beforeTicketTaken.ticketTakenPasswordRulePos.indexOf(item);
      if (index !== -1) {
        this.currentItem.beforeTicketTaken.ticketTakenPasswordRulePos.splice(index, 1);
      }
    });
  }

  submitPasswordRule() {
    let tags = this.currentPasswordVos.filter(x => x.checked).map(x => x.toTag());
    if (tags.length == 0) {
      this.toastService.showErrorToast("You must select at least one tag.");
      return;
    }
    if (!this.currentPassword.title) {
      this.toastService.showErrorToast("You must enter a rule name.");
      return;
    }
    let length = this.currentItem.beforeTicketTaken.ticketTakenPasswordRulePos.filter(x => x.title == this.currentPassword.title).length;
    if ((this.currentPasswordIndex != null && length > 1) || (this.currentPasswordIndex == null && length == 1)) {
      this.toastService.showErrorToast("Rule name must not duplicate with existing ones.");
      return;
    }
    if (this.currentPassword.delimiter == null || this.currentPassword.delimiter=='') {
      this.toastService.showErrorToast("Delimiter cannot be empty.");
      return;
    }
    if (this.currentPassword.password == null || this.currentPassword.password == '') {
      this.toastService.showErrorToast("Password cannot be empty.");
      return;
    }
    this.currentPassword.tags = tags;
    if (this.currentPasswordIndex != null) {
      // Replace the element within the array
      this.currentItem.beforeTicketTaken.ticketTakenPasswordRulePos[this.currentPasswordIndex] = this.currentPassword;
      this.currentPasswordIndex = null;
    } else {
      console.log(this.currentPassword);
      this.currentItem.beforeTicketTaken.ticketTakenPasswordRulePos.push(this.currentPassword);
    }
    this.closeModal("userTicketTakenPasswordModal");
  }

  addVIPItem() {
    this.currentVIPIndex = null;
    this.currentVIP = new TicketTakenVipRulePo();
    this.currentVIP.title = this.currentVIP.title + (this.currentItem.beforeTicketTaken.ticketTakenVipRulePos.length + 1)
    this.currentVIPVos = this.queueVo.tags.map(x => x.toTagVo());
    this.showModal("userTicketTakenVIPModal");
  }

  updateVIPItem(item: TicketTakenVipRulePo, VIPIndex: number) {
    console.log("updateItem", VIPIndex)
    this.currentVIPIndex = VIPIndex;
    this.currentVIP = item;
    this.currentVIPVos = this.queueVo.tags.map(x => x.toTagVo(item.tags));
    this.showModal("userTicketTakenVIPModal");
  }

  removeVIPItem(item: TicketTakenVipRulePo) {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      const index = this.currentItem.beforeTicketTaken.ticketTakenVipRulePos.indexOf(item);
      if (index !== -1) {
        this.currentItem.beforeTicketTaken.ticketTakenVipRulePos.splice(index, 1);
      }
    });

  }

  submitVIPRule() {
    let tags = this.currentVIPVos.filter(x => x.checked).map(x => x.toTag());
    if (tags.length == 0) {
      this.toastService.showErrorToast("You must select at least one tag.");
      return;
    }
    if (!this.currentVIP.title) {
      this.toastService.showErrorToast("You must enter a rule name.");
      return;
    }
    let length = this.currentItem.beforeTicketTaken.ticketTakenVipRulePos.filter(x => x.title == this.currentVIP.title).length;
    if ((this.currentVIPIndex != null && length > 1) || (this.currentVIPIndex == null && length == 1)) {
      this.toastService.showErrorToast("Rule name must not duplicate with existing ones.");
      return;
    }
    this.currentVIP.tags = tags;
    if (this.currentVIPIndex != null) {
      // Replace the element within the array
      this.currentItem.beforeTicketTaken.ticketTakenVipRulePos[this.currentVIPIndex] = this.currentVIP;
      this.currentVIPIndex = null;
    } else {
      console.log(this.currentVIP);
      this.currentItem.beforeTicketTaken.ticketTakenVipRulePos.push(this.currentVIP);
    }
    this.closeModal("userTicketTakenVIPModal");
  }


  addTimeRangeItem(modal: any) {
    this.currentTimeRangeIndex = null;
    this.currentTimeRange = new TicketTakenTimeRangeRulePo();
    this.currentTimeRange.title = this.currentTimeRange.title + (this.currentItem.beforeTicketTaken.ticketTakenTimeRangeRulePos.length + 1)
    // this.showModal("userTicketTakenTimeRangeModal");
    this.modalService.open(modal);
  }

  updateTimeRangeItem(item: TicketTakenTimeRangeRulePo, timeRangeIndex: number, modal: any) {
    console.log("updateItem", timeRangeIndex, item)
    this.currentTimeRangeIndex = timeRangeIndex;
    this.currentTimeRange = JSON.parse(JSON.stringify(item));//深度拷贝
    // this.showModal("userTicketTakenTimeRangeModal");
    this.modalService.open(modal);
  }

  removeTimeRangeItem(item: TicketTakenTimeRangeRulePo) {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      const index = this.currentItem.beforeTicketTaken.ticketTakenTimeRangeRulePos.indexOf(item);
      if (index !== -1) {
        this.currentItem.beforeTicketTaken.ticketTakenTimeRangeRulePos.splice(index, 1);
      }
    });

  }


  submitTimeRangeRule() {
    if (!this.currentTimeRange.title || !this.currentTimeRange.title.trim()) {
      this.toastService.showErrorToast("You must enter a rule name.");
      return;
    }
    let length;
    if (this.currentTimeRangeIndex != null) {
      length = this.currentItem.beforeTicketTaken.ticketTakenTimeRangeRulePos
        .filter((_, index) => index !== this.currentTimeRangeIndex)
        .filter(x => x.title == this.currentTimeRange.title).length;
    } else {
      length = this.currentItem.beforeTicketTaken.ticketTakenTimeRangeRulePos
        .filter(x => x.title == this.currentTimeRange.title).length;
    }
    if (length == 1) {
      this.toastService.showErrorToast("Rule name must not duplicate with existing ones.");
      return;
    }
    if (this.currentTimeRange.startTime > this.currentTimeRange.endTime) {
      this.toastService.showErrorToast("Start time must be earlier than end time.");
      return;
    }
    if (this.currentTimeRangeIndex != null) {
      // Replace the element within the array
      this.currentItem.beforeTicketTaken.ticketTakenTimeRangeRulePos[this.currentTimeRangeIndex] = this.currentTimeRange;
      this.currentTimeRangeIndex = null;
    } else {
      console.log(this.currentTimeRange);
      this.currentItem.beforeTicketTaken.ticketTakenTimeRangeRulePos.push(this.currentTimeRange);
    }
    // this.closeModal("userTicketTakenTimeRangeModal");
    this.modalService.dismissAll();
  }


  addDateRangeItem() {
    this.currentDateRangeIndex = null;
    this.currentDateRange = new TicketTakenDateRangeRulePo();
    this.currentDateRange.title = this.currentDateRange.title + (this.currentItem.beforeTicketTaken.ticketTakenDateRangeRulePos.length + 1)
    this.showModal("userTicketTakenDateRangeModal");
  }

  updateDateRangeItem(item: TicketTakenDateRangeRulePo, DateRangeIndex: number) {
    console.log("updateItem", DateRangeIndex, item)
    this.currentDateRangeIndex = DateRangeIndex;
    this.currentDateRange = JSON.parse(JSON.stringify(item));//深度拷贝
    this.showModal("userTicketTakenDateRangeModal");
  }

  removeDateRangeItem(item: TicketTakenDateRangeRulePo) {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      const index = this.currentItem.beforeTicketTaken.ticketTakenDateRangeRulePos.indexOf(item);
      if (index !== -1) {
        this.currentItem.beforeTicketTaken.ticketTakenDateRangeRulePos.splice(index, 1);
      }
    });

  }


  submitDateRangeRule() {
    if (!this.currentDateRange.title || !this.currentDateRange.title.trim()) {
      this.toastService.showErrorToast("You must enter a rule name.");
      return;
    }
    let length;
    if (this.currentDateRangeIndex != null) {
      length = this.currentItem.beforeTicketTaken.ticketTakenDateRangeRulePos
        .filter((_, index) => index !== this.currentDateRangeIndex)
        .filter(x => x.title == this.currentDateRange.title).length;
    } else {
      length = this.currentItem.beforeTicketTaken.ticketTakenDateRangeRulePos
        .filter(x => x.title == this.currentDateRange.title).length;
    }
    if (length == 1) {
      this.toastService.showErrorToast("Rule name must not duplicate with existing ones.");
      return;
    }
    if (this.currentDateRangeIndex != null) {
      // Replace the element within the array
      this.currentItem.beforeTicketTaken.ticketTakenDateRangeRulePos[this.currentDateRangeIndex] = this.currentDateRange;
      this.currentDateRangeIndex = null;
    } else {
      console.log(this.currentDateRange);
      this.currentItem.beforeTicketTaken.ticketTakenDateRangeRulePos.push(this.currentDateRange);
    }
    this.closeModal("userTicketTakenDateRangeModal");
  }

  addTicketDateItem() {
    this.currentTicketDateIndex = null;
    this.currentTicketDate = new TicketDateRulePo();
    this.currentTicketDate.title = this.currentTicketDate.title + (this.currentItem.beforeTicketTaken.ticketDateRulePos.length + 1)
    this.showModal("userTicketDateModal");
  }

  updateTicketDateItem(item: TicketDateRulePo, ticketDateIndex: number) {
    console.log("updateItem", ticketDateIndex, item)
    this.currentTicketDateIndex = ticketDateIndex;
    this.currentTicketDate = JSON.parse(JSON.stringify(item));//深度拷贝
    this.showModal("userTicketDateModal");
  }

  removeTicketDateItem(item: TicketDateRulePo) {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      const index = this.currentItem.beforeTicketTaken.ticketDateRulePos.indexOf(item);
      if (index !== -1) {
        this.currentItem.beforeTicketTaken.ticketDateRulePos.splice(index, 1);
      }
    });

  }


  submitTicketDateRule() {
    if (!this.currentTicketDate.title || !this.currentTicketDate.title.trim()) {
      this.toastService.showErrorToast("You must enter a rule name.");
      return;
    }
    let length;
    if (this.currentTicketDateIndex != null) {
      length = this.currentItem.beforeTicketTaken.ticketDateRulePos
        .filter((_, index) => index !== this.currentTicketDateIndex)
        .filter(x => x.title == this.currentTicketDate.title).length;
    } else {
      length = this.currentItem.beforeTicketTaken.ticketDateRulePos
        .filter(x => x.title == this.currentTicketDate.title).length;
    }
    if (length == 1) {
      this.toastService.showErrorToast("Rule name must not duplicate with existing ones.");
      return;
    }
    if (this.currentTicketDateIndex != null) {
      // Replace the element within the array
      this.currentItem.beforeTicketTaken.ticketDateRulePos[this.currentTicketDateIndex] = this.currentTicketDate;
      this.currentTicketDateIndex = null;
    } else {
      console.log(this.currentTicketDate);
      this.currentItem.beforeTicketTaken.ticketDateRulePos.push(this.currentTicketDate);
    }
    this.closeModal("userTicketDateModal");
  }


  toTime(selectedDate: Date): string {
    const hours = selectedDate.getHours().toString().padStart(2, "0");
    const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
    const seconds = selectedDate.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }


  delete(): void {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      this.itemList.splice(this.index, 1);
      // let queueVo = new QueueVo();
      // queueVo.id = this.queueId;
      this.queueVo.ticketTakenRuleManager.ticketTakenRuleItemList = this.itemList;
      this.queueService.updateTicketTakenRule(this.queueVo).subscribe({
        next: queueVo => {
          console.log('Success', queueVo);
          this.toastService.showSuccessToast('Deletion successful');
          if (this.index) {
            this.router.navigate(['/leader/ticket-taken-rule', this.queueId]);
          } else {
            this.router.navigate(['/leader/ticket-taken-rule', this.queueId]);
          }
        },
        error: err => {
          this.toastService.showErrorToast("Operation failed", "Server error");
        }
      });
    });
  }

  submit(): void {
    if (!this.currentItem.title || !this.currentItem.title.trim()) {
      this.toastService.showErrorToast("Name cannot be empty");
      return;
    }
    let length = this.itemList.filter(x => x.title == this.currentItem.title).length;
    if (length > 1) {
      this.toastService.showErrorToast("Name cannot duplicate with existing ones");
      return;
    }
    this.queueVo.ticketTakenRuleManager.ticketTakenRuleItemList = this.itemList;
    this.queueService.updateTicketTakenRule(this.queueVo).subscribe({
      next: queueVo => {
        console.log('Success', queueVo);
        this.toastService.showSuccessToast('Update successful');
        if (this.index) {
          this.router.navigate(['/leader/save-ticket-taken-rule-item', this.queueId, this.index]);
        } else {
          this.router.navigate(['/leader/save-ticket-taken-rule-item', this.queueId, this.itemList.length - 1]);
        }
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
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
