import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../_services/queue.service";
import {ToastService} from "../../../../../_helpers/toast.service";
import {Location} from "@angular/common";
import {TagVo} from "../../../../../models/TagVo";
import {InformItem, QueueVo, TicketTakenRuleManager, TicketTakenRuleItem, Tag} from "../../../../../models/QueueVo";

@Component({
  selector: 'app-ticket-taken-rule',
  templateUrl: './ticket-taken-rule.component.html',
  styleUrls: ['./ticket-taken-rule.component.css']
})
export class TicketTakenRuleComponent implements OnInit {

  queueId: string;
  queueVo: QueueVo;
  items: TicketTakenRuleItem[] = [];

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location,
              private router: Router) {
  }

  ngOnInit(): void {

    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.queueService.findById(this.queueId).subscribe(
        {
          next: queueVo => {
            this.queueVo = queueVo;
            this.items = this.queueVo.ticketTakenRuleManager.ticketTakenRuleItemList;
            console.log("items",this.items)
          }
        }
      )
    })
  }
}
