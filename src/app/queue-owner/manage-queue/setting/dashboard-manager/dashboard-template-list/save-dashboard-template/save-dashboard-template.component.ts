import {Component, OnInit, ViewChild} from '@angular/core';
import {DashboardItem, DashboardTemplate, QueueVo, DashboardEnum, TagMessage} from "../../../../../../models/QueueVo";
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../../../../../_services/queue.service";
import {ToastService} from "../../../../../../_helpers/toast.service";
import {Location} from "@angular/common";
import Swal from "sweetalert2";
import {Clipboard} from '@angular/cdk/clipboard';
import {environment} from "../../../../../../../environments/environment";

import {DashboardTemplateComponent} from "./dashboard-template/dashboard-template.component";
import {TagVo} from "../../../../../../models/TagVo";
import * as bootstrap from "bootstrap";

@Component({
  selector: 'app-save-dashboard-template',
  templateUrl: './save-dashboard-template.component.html',
  styleUrls: ['./save-dashboard-template.component.css']
})
export class SaveDashboardTemplateComponent implements OnInit {
  queueId: string;
  index: number;
  templateList: DashboardTemplate[];
  itemList: DashboardItem[];
  queueVo: QueueVo;
  currentTemplate: DashboardTemplate = new DashboardTemplate();
  title = "";
  @ViewChild(DashboardTemplateComponent) dashboardTemplateComponent: DashboardTemplateComponent;
  url: string;
  dashboardEnum: DashboardEnum = DashboardEnum.TEMPLATE_EDIT;
  currentDashboardItem: DashboardItem = new DashboardItem();
  currentDashboardItemIndex: number | null;
  constructor(private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private toastService: ToastService,
              private location: Location,
              private clipboard: Clipboard,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['queueId'];
      this.index = params['index'];

      this.currentTemplate = new DashboardTemplate();
      this.queueService.findById(this.queueId).subscribe(
        {
          next: queueVo => {
            this.queueVo = queueVo;
            // console.log(this.queueVo)
            this.templateList = this.queueVo.dashboardManager.dashboardTemplateList;
            this.itemList = this.queueVo.dashboardManager.dashboardItemList;

            if (this.index) {
              this.title = 'Edit';
              this.currentTemplate = this.templateList[this.index];
            } else {
              this.title = 'Create';
              this.templateList.push(this.currentTemplate);
            }
            console.log(this.templateList)
          }
        }
      );
    });
  }

  copyUrl() {
    if (this.index) {
      let url = environment.domain + '/leader/dashboard/' + this.queueId + '/' + this.index;
      this.clipboard.copy(url);
      this.toastService.showSuccessToast('Copied Dashboard URL successfully');
    }
  }

  get currentTemplateJson() {
    return JSON.stringify(this.currentTemplate, null, 2);  // Convert to JSON string with pretty print
  }

  jsonCorrect: boolean = true;

  set currentTemplateJson(v: string) {
    try {
      this.currentTemplate = JSON.parse(v);  // Parse JSON string to object
      this.jsonCorrect = true;
    } catch (e) {
      this.jsonCorrect = false;
      this.toastService.showErrorToast("Format error!")
    }
  }

  copyJson() {
    this.clipboard.copy(this.currentTemplateJson);
    this.toastService.showSuccessToast('Copied successfully');
  }

  async addItem() {
    const map = this.itemList.map(x => x.title).reduce((result, item) => {
      result.set(item, item);
      return result;
    }, new Map<string, string>());
    const { value: value } = await Swal.fire({
      title: 'Add Component',
      input: 'select',
      inputOptions: map,
      inputPlaceholder: 'Select component',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      showCancelButton: true
    });
    if (value) {
      let dashboardItem = this.itemList.filter(x => x.title == value)[0];
      // this.currentTemplate.dashboardItemList.push(dashboardItem);
      this.currentDashboardItemIndex = null;
      this.currentDashboardItem = Object.assign({}, dashboardItem);
      this.showModal("dashboardItemModal");
    }
  }

  updateDashboardItemItem(item: DashboardItem, sameTagIndex: number) {
    console.log("updateItem", sameTagIndex)
    this.currentDashboardItemIndex = sameTagIndex;
    this.currentDashboardItem = item;
    this.showModal("dashboardItemModal");
  }

  removeDashboardItemItem(item: DashboardItem) {
    this.toastService.showConfirmAlert("Confirm Deletion?", () => {
      const index = this.currentTemplate.dashboardItemList.indexOf(item);
      if (index !== -1) {
        this.currentTemplate.dashboardItemList.splice(index, 1);
      }
    });
  }
  submitDashboardItem() {
    if (this.currentDashboardItemIndex != null) {
      //替换数组内元素
      this.currentTemplate.dashboardItemList[this.currentDashboardItemIndex] = this.currentDashboardItem;
      this.currentDashboardItemIndex = null;
    } else {
      this.currentTemplate.dashboardItemList.push(this.currentDashboardItem);
    }
    this.closeModal("dashboardItemModal");
  }

  showModal(id: string): void {
    const myModalEl = document.getElementById(id);
    if (myModalEl) {
      const modal = new bootstrap.Modal(myModalEl);
      modal.show();
    } else {
      console.error(`Modal element with ID ${id} not found.`);
    }
  }

  closeModal(id: string): void {
    var myModalEl = document.getElementById(id);
    if (myModalEl) {
      var modal = bootstrap.Modal.getInstance(myModalEl);
      if (modal) {
        modal.hide();
      }
    }
  }

  delete(): void {
    this.toastService.showConfirmAlert("Confirm Deletion?", () => {
      this.templateList.splice(this.index, 1);
      this.queueVo.dashboardManager.dashboardTemplateList = this.templateList;
      this.queueService.updateDashboardManager(this.queueVo).subscribe({
        next: queueVo => {
          console.log('Success', queueVo);
          this.toastService.showSuccessToast('Deleted Successfully');
          if (this.index) {
            this.router.navigate(['/leader/dashboard-template-list', this.queueId]);
          } else {
            this.router.navigate(['/leader/dashboard-template-list', this.queueId]);
          }
        },
        error: err => {
          this.toastService.showErrorToast("Operation Failed", "Server Error");
        }
      });
    });
  }

  submit(): void {
    if (!this.jsonCorrect) {
      this.toastService.showErrorToast("Configuration file format error");
      return;
    }
    if (!this.currentTemplate.title || !this.currentTemplate.title.trim()) {
      this.toastService.showErrorToast("Name cannot be empty");
      return;
    }
    let length = this.templateList.filter(x => x.title == this.currentTemplate.title).length;
    if (length > 1) {
      this.toastService.showErrorToast("Cannot have duplicate names");
      return;
    }
    if (this.index) {
      this.templateList[this.index] = this.currentTemplate;
    } else {
      this.templateList[this.templateList.length - 1] = this.currentTemplate;
    }
    this.queueVo.id = this.queueId;
    this.queueVo.dashboardManager.dashboardTemplateList = this.templateList;
    console.log(this.templateList);
    this.queueService.updateDashboardManager(this.queueVo).subscribe({
      next: queueVo => {
        console.log('Success', queueVo);
        this.toastService.showSuccessToast('Update Successful');
        if (this.index) {
          this.router.navigate(['/leader/save-dashboard-template', this.queueId, this.index]);
        } else {
          this.router.navigate(['/leader/save-dashboard-template', this.queueId, this.templateList.length - 1]);
        }
      },
      error: err => {
        this.toastService.showErrorToast("Operation Failed", "Server Error");
      }
    });
  }
}
