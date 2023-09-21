import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../_services/user.service";
import {TokenStorageService} from "../../_services/token-storage.service";
import {QueueService} from "../../_services/queue.service";
import {ToastService} from "../../_helpers/toast.service";
import {DateTimeUtils} from "../../_utils/dateTimeUtils";
import {TicketService} from "../../_services/ticket.service";
import {TicketVo} from "../../models/TicketVo";

@Component({
  selector: 'app-member-home',
  templateUrl: './member-home.component.html',
  styleUrls: ['./member-home.component.css']
})
export class MemberHomeComponent implements OnInit {

  ticketVo: TicketVo = new TicketVo();
  page: number = 0;
  size: number = 10;
  // isVisitor: boolean = false;

  constructor(private userService: UserService,
              private queueService: QueueService,
              private ticketService: TicketService,
              public router: Router,
              private tokenStorage: TokenStorageService,
              private toastService: ToastService,
              public dateTimeUtils: DateTimeUtils,) {
  }

  ngOnInit(): void {
    // let user = this.tokenStorage.getUser();
    // this.isVisitor = user?.registrationMethod == 'Guest Registration';
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService.memberHomeTickets(this.page, this.size).subscribe({
      next: data => {
        this.ticketVo = data;
      }
    })
  }

  toPage(page: number): void {
    this.page = page;
    this.loadTickets();
  }
  logout(): void {
    this.tokenStorage.signOut();
    window.location.reload();
    // this.router.navigate(['/login']);
  }
}
