import {Component, OnInit} from '@angular/core';
import {QueueService} from "../../_services/queue.service";
import {data} from "autoprefixer";
import {ToastService} from "../../_helpers/toast.service";
import {QueueVo} from "../../models/QueueVo";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-search-queues',
  templateUrl: './search-queues.component.html',
  styleUrls: ['./search-queues.component.css']
})
export class SearchQueuesComponent implements OnInit {
  keyword: string;
  page: number = 0;
  size: number = 10;
  queueVos: QueueVo[] | undefined;

  constructor(private queueService: QueueService,
              private router: Router, private toastService: ToastService, private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        let keywordTmp = params['keyword'];
        let pageTmp = parseInt(params['page']);
        let sizeTmp = parseInt(params['size']);
        if (keywordTmp) {
          this.keyword = keywordTmp;
        }
        if (pageTmp >= 0) {
          this.page = pageTmp;
        }
        if (sizeTmp > 0) {
          this.size = sizeTmp;
        }
        this.loadQueues();
      });

  }

  search() {
    if (!this.keyword) {
      this.toastService.showErrorToast("Please enter a keyword.");
      return;
    }
    this.router.navigate(['/member/search-queues'], {
      queryParams: {
        page: 0,
        size: this.size,
        keyword: this.keyword
      }
    });
  }

  loadQueues() {
    console.log("keyword", this.keyword);
    Swal.showLoading();
    this.queueVos = undefined;
    if (!this.keyword) {
      Swal.close();
      // this.queueVos = [];
      return;
    }
    this.queueService.searchQueues(this.keyword, this.page, this.size).subscribe({
      next: queueVo => {
        Swal.close();
        this.queueVos = queueVo.queueVos;
      }, error: err => {
        Swal.close();
        this.toastService.showErrorToast("Operation Failed", "Server Error");
      }
    })
  }

}
