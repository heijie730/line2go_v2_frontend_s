import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {QueueService} from "../../../../_services/queue.service";
import {ActivatedRoute} from "@angular/router";
import {ToastService} from "../../../../_helpers/toast.service";
import {QueueVo} from "../../../../models/QueueVo";
import {RichTextVo, TextType} from "../../../../models/RichTextVo";
import {QuillEditorComponent} from "ngx-quill";
import {AwsService} from "../../../../_services/aws-service.service";
import * as bootstrap from "bootstrap";
import Swal from "sweetalert2";
import Quill from "quill";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {environment} from "../../../../../environments/environment";
import {CustomUtils} from "../../../../_utils/CustomUtils";
import Compressor from 'compressorjs';

@Component({
  selector: 'app-edit-base-info',
  templateUrl: './edit-base-info.component.html',
  styleUrls: ['./edit-base-info.component.css']

})
export class EditBaseInfoComponent implements OnInit, AfterViewInit {
  queueDesc: string = '';
  queue: QueueVo;
  queueId: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private toastService: ToastService,
    private awsService: AwsService, private customUtils: CustomUtils,
    private queueService: QueueService) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['id'];
    });
  }

  ngAfterViewInit() {
  }

}
