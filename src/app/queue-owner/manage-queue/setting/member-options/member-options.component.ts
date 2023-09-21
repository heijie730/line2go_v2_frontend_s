import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {QueueService} from "../../../../_services/queue.service";

@Component({
  selector: 'app-member-options',
  templateUrl: './member-options.component.html',
  styleUrls: ['./member-options.component.css']
})
export class MemberOptionsComponent implements OnInit {
  queueId: string;

  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
    })
  }

}
