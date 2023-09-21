import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../_services/queue.service";
import {ToastService} from "../../../../../_helpers/toast.service";
// import {SmsSubscriptionService} from "../../../../../_services/sms-subscription.service";
import {Location} from "@angular/common";
import {MemberLoginOptions, QueueVo} from "../../../../../models/QueueVo";

@Component({
    selector: 'app-member-login-options',
    templateUrl: './member-login-options.component.html',
    styleUrls: ['./member-login-options.component.css']
})
export class MemberLoginOptionsComponent implements OnInit {
    queueId: string;
    queueVo: QueueVo;
    memberLoginOptions: MemberLoginOptions;

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
                    this.memberLoginOptions = this.queueVo.memberOptions.memberLoginOptions;
                }
            });
        })
    }
    submit(){
        this.queueService.updateMemberOptions(this.queueVo).subscribe({
            next: queueVo => {
                console.log(queueVo);
              this.toastService.showSuccessToast('Update successful');
            }
        });
    }
}
