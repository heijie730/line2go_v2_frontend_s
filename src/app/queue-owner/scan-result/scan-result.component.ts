import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TicketService} from "../../_services/ticket.service";
import {ToastService} from "../../_helpers/toast.service";
import {CheckTicketVo} from "../../models/CheckTicketVo";
import Swal from "sweetalert2";

@Component({
  selector: 'app-scan-result',
  templateUrl: './scan-result.component.html',
  styleUrls: ['./scan-result.component.css']
})
export class ScanResultComponent implements OnInit {

  checkTicketVo: CheckTicketVo;

  constructor(private activateRoute: ActivatedRoute, private ticketService: TicketService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    Swal.showLoading();
    this.activateRoute.params.subscribe(params => {
      let ticketId = params['ticketId'];
      this.ticketService.checkTicket(ticketId).subscribe({
        next: checkTicketVO => {
          Swal.close();
          if (checkTicketVO.errcode == 0) {
            this.checkTicketVo = checkTicketVO;
          } else {
            this.toastService.showErrorToast(checkTicketVO.errmsg);
          }
        },
        error: err => {
          Swal.close();
          this.toastService.showErrorToast("Operation failed", "Server error");
        }
      })
    });
  }
}
