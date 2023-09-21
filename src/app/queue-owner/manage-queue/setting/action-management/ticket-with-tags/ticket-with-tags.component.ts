import { Component, OnInit } from '@angular/core';
import { GenerateTicketManager, QueueVo, Tag } from "../../../../../models/QueueVo";
import { ActivatedRoute, Router } from "@angular/router";
import { QueueService } from "../../../../../_services/queue.service";
import { ToastService } from "../../../../../_helpers/toast.service";
import { Location } from "@angular/common";
import { TagVo } from "../../../../../models/TagVo";
import * as bootstrap from "bootstrap";
import { TicketVo } from "../../../../../models/TicketVo";
import { StateService } from "../../../../../_services/state.service";
import { DateTimeUtils } from "../../../../../_utils/dateTimeUtils";

@Component({
  selector: 'app-ticket-with-tags',
  templateUrl: './ticket-with-tags.component.html',
  styleUrls: ['./ticket-with-tags.component.css']
})
export class TicketWithTagsComponent implements OnInit {
  queueId: string;
  queueVo: QueueVo;
  tagVo: TagVo;
  tagsOnGenerate: Tag[] = [];
  tags: Tag[];
  tagVos: TagVo[] = [];
  generateTicketManager: GenerateTicketManager = new GenerateTicketManager();
  exampleTicket: TicketVo = new TicketVo();

  constructor(
    private activateRoute: ActivatedRoute,
    private queueService: QueueService,
    private toastService: ToastService,
    private location: Location,
    private router: Router,
    public dateTimeUtils: DateTimeUtils,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          this.queueVo = queueVo;
          this.generateTicketManager = this.queueVo.generateTicketManager;
          this.tagsOnGenerate = this.generateTicketManager.tagsOnGenerate;
          this.tags = this.queueVo.tags;
          this.tagVos = this.tags.map(x => x.toTagVo(this.tagsOnGenerate));
          this.initTicket();
        }
      });
    });
  }

  submit(): void {
    if (this.generateTicketManager.ticketTitleName.trim() == '') {
      this.toastService.showErrorToast("Ticket Title Name cannot be empty");
      return;
    }
    if (this.generateTicketManager.ticketRemarkName.trim() == '') {
      this.toastService.showErrorToast("Remark Name cannot be empty");
      return;
    }
    if (this.generateTicketManager.ticketDateName.trim() == '') {
      this.toastService.showErrorToast("Usage Date Name cannot be empty");
      return;
    }
    let checkedTags = this.tagVos.filter(x => x.checked);
    this.tagsOnGenerate = checkedTags.map(x => x.toTag());
    console.log(this.tagsOnGenerate);
    this.queueVo.generateTicketManager.tagsOnGenerate = this.tagsOnGenerate;
    this.queueService.updateGenerateTicketManager(this.queueVo).subscribe({
      next: queueVo => {
        console.log('Success', queueVo);
        this.toastService.showSuccessToast('Update successful');
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }

  initTicket() {
    this.exampleTicket.queueName = this.queueVo.queueName;
    this.exampleTicket.ticketNo = 3;
    this.exampleTicket.ticketCustomInfo.remark = 'Please wait!';
    this.exampleTicket.ticketCustomInfo.titleName = this.queueVo.generateTicketManager.ticketTitleName;
    this.exampleTicket.ticketCustomInfo.remarkName = this.queueVo.generateTicketManager.ticketRemarkName;
    this.exampleTicket.ticketCustomInfo.dateName = this.queueVo.generateTicketManager.ticketDateName;
    let queueState = this.stateService.getManageQueueState(this.queueId);
    if (!queueState) {
      queueState = this.dateTimeUtils.yyyyMMdd(new Date(),this.queueVo.timeZone);
    }
    this.exampleTicket.ticketDate = queueState;
    let ticketMsgManager = this.queueVo.generateTicketManager.ticketMsgManager;
    let content = ticketMsgManager.content ? ticketMsgManager.content : '';
    if (ticketMsgManager.attachTypeEnum == 'APPEND') {
      this.exampleTicket.ticketCustomInfo.remark = this.exampleTicket.ticketCustomInfo.remark + content;
    }
    if (ticketMsgManager.attachTypeEnum == 'REPLACEMENT') {
      this.exampleTicket.ticketCustomInfo.remark = content;
    }
  }

  previewTicket() {
    this.initTicket();
    console.log(this.exampleTicket);
    this.showModal('attachMsgModal');
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
