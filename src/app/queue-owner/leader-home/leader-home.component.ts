import {Component, OnInit} from '@angular/core';
import {UserService} from '../../_services/user.service';
import {TokenStorageService} from "../../_services/token-storage.service";
import {ActivatedRoute, Router} from '@angular/router';

import {QueueService} from "../../_services/queue.service";
import * as bootstrap from 'bootstrap';
import {QueueVo} from "../../models/QueueVo";
import {CreateQueueVo} from "../../models/CreateQueueVo";
import {DateTimeUtils} from "../../_utils/dateTimeUtils";
import {ToastService} from "../../_helpers/toast.service";
import Swal from "sweetalert2";
import * as momentTimezone from 'moment-timezone';

@Component({
  selector: 'app-leader-home',
  templateUrl: './leader-home.component.html',
  styleUrls: ['./leader-home.component.css']
})
export class LeaderHomeComponent implements OnInit {
  content?: string;
  input: any;
  errorMessage = '';
  queueVo: QueueVo;
  queueVos: QueueVo[] = [];

  createQueueVo: CreateQueueVo = new CreateQueueVo();
  // date: string;
  page: number = 0;
  size: number = 10;
  timezones: string[] = momentTimezone.tz.names();

  constructor(private userService: UserService,
              private token: TokenStorageService,
              private queueService: QueueService,
              private router: Router, public activateRoute: ActivatedRoute,
              private toastService: ToastService,
              public dateTimeUtils: DateTimeUtils,) {
    // customize default values of modals used by this component tree
    // config.backdrop = 'static';
    // config.keyboard = false;
  }

  ngOnInit(): void {
    this.createQueueVo.timeZone = momentTimezone.tz.guess()
    this.activateRoute.queryParams.subscribe(params => {
      let pageTmp = parseInt(params['page']);
      let sizeTmp = parseInt(params['size']);
      if (pageTmp >= 0) {
        this.page = pageTmp;
      }
      if (sizeTmp > 0) {
        this.size = sizeTmp;
      }
      this.loadQueues();
    });

  }

  toDate(timeZone: string) {
    return this.dateTimeUtils.yyyyMMdd(new Date(), timeZone);
  }

  close() {
    this.cleanErrorMsg();
    const myModalEl = document.getElementById('staticBackdrop');
    if (myModalEl) {
      const modal = bootstrap.Modal.getInstance(myModalEl);
      if (modal) {
        modal.hide();
      }
    }
  }

  cleanErrorMsg() {
    this.errorMessage = "";
  }

  onSubmit(): void {
    console.log("onSubmit", this.createQueueVo);
    if (!this.createQueueVo.queueName) {
      this.errorMessage = "Please enter the queue name";
      return;
    }
    if (!this.createQueueVo.timeZone) {
      this.errorMessage = "Please select time zone";
      return;
    }
    Swal.showLoading();
    this.queueService.create(this.createQueueVo).subscribe({
      next: data => {
        console.log('Success', data);
        this.close();
        // this.loadQueues();
        Swal.close();
        this.toastService.showSuccessToast("Queue created successfully");
        this.router.navigate(['/leader/home'], {
          queryParams: {
            page: 0,
            size: this.size
          }
        })

      },
      error: err => {
        console.log('Fail', err.error.errmsg);
        this.errorMessage = "Server error";
        Swal.close();
      }
    });
    // this.checkoutForm.reset();
  }

  loadQueues(): void {
    Swal.showLoading();
    this.queueService.list(this.page, this.size).subscribe({
      next: data => {
        console.log('Success', data);
        if (data.errcode == 0) {
          this.queueVos = data.queueVos;
        }
        Swal.close();
      },
      error: err => {
        Swal.close();
        console.log('Fail', err);
      }
    });
  }

  deleteQueue(queueId: string) {
    Swal.fire({
      title: 'Please enter "Delete" and click OK',
      input: 'text',
      inputValidator: (value) => {
        if (!value || value.toLowerCase() !== 'delete') {
          return 'You must enter "Delete"';
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.performDelete(queueId)
          .catch(error => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'The Queue has been deleted.', 'success').then(result => {
          if (result.isConfirmed) {
            this.loadQueues();
          }
        });
      }
    })
  }

  performDelete(queueId: string): Promise<any> {
    return this.queueService.deleteQueueById(queueId).toPromise();
  }

}
