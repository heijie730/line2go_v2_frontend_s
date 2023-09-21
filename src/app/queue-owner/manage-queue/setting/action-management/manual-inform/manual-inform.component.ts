import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../_services/queue.service";
import {ToastService} from "../../../../../_helpers/toast.service";
import {Location} from "@angular/common";
// import {InformItem, QueueVO} from "../../../models/queueVo";
import {TagVo} from "../../../../../models/TagVo";
import {InformItem, QueueVo} from "../../../../../models/QueueVo";
import Swal from "sweetalert2";

@Component({
  selector: 'app-manual-inform',
  templateUrl: './manual-inform.component.html',
  styleUrls: ['./manual-inform.component.css']
})
export class ManualInformComponent implements OnInit {

  queueId: string;
  queueVo: QueueVo;
  informItems: InformItem[] = [];

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location,
              private router: Router) {
  }

  ngOnInit(): void {

    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      Swal.showLoading();
      this.queueService.findById(this.queueId).subscribe(
        {
          next: queueVo => {
            Swal.close()
            this.queueVo = queueVo;
            this.informItems = this.queueVo.manualNotification.informItems;
          },error:err => {
            Swal.close();
            this.toastService.showErrorToast("Network error, please try again");
          }
        }
      )
    })
  }

}
