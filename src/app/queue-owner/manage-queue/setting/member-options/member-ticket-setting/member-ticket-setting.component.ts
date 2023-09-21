import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../_services/queue.service";
import {ToastService} from "../../../../../_helpers/toast.service";
// import {SmsSubscriptionService} from "../../../../../_services/sms-subscription.service";
import {Location} from "@angular/common";
import {MemberLoginOptions, QueueVo, TicketSetting} from "../../../../../models/QueueVo";
import * as bootstrap from "bootstrap";
import {TicketVo} from "../../../../../models/TicketVo";

@Component({
  selector: 'app-member-ticket-setting',
  templateUrl: './member-ticket-setting.component.html',
  styleUrls: ['./member-ticket-setting.component.css']
})
export class MemberTicketSettingComponent implements OnInit {
  queueId: string;
  queueVo: QueueVo;
  ticketSetting: TicketSetting;

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              // private smsSubscriptionService: SmsSubscriptionService,
              private location: Location,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.queueService.findById(this.queueId).subscribe({
        next: queueVo => {
          console.log(queueVo);
          this.queueVo = queueVo;
          this.ticketSetting = this.queueVo.memberOptions.ticketSetting;
        }
      });
    })
  }

  submit() {

    this.queueService.updateMemberOptions(this.queueVo).subscribe({
      next: queueVo => {
        console.log(queueVo);
        this.toastService.showSuccessToast('Update successful');
      }
    });
  }


}
