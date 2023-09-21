import {Component, OnInit} from '@angular/core';
import {ServiceRequestVo} from "../../models/ServiceRequestVo";
import {ActivatedRoute} from "@angular/router";
import {SuperAdminService} from "../../_services/super-admin.service";
import {DateTimeUtils} from "../../_utils/dateTimeUtils";
import {Location} from "@angular/common";
import {ToastService} from "../../_helpers/toast.service";
import {TokenStorageService} from "../../_services/token-storage.service";
import {UserVo} from "../../models/UserVo";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  userVos: UserVo[] = [];
  page: number = 0;
  size: number = 20;
  keyword: string='';

  constructor(public activateRoute: ActivatedRoute,
              private superAdminService: SuperAdminService,
              public dateTimeUtils: DateTimeUtils,
              private location: Location,
              private toastService: ToastService,
              private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe(params => {
      let pageTmp = parseInt(params['page']);
      let sizeTmp = parseInt(params['size']);
      if (pageTmp >= 0) {
        this.page = pageTmp;
      }
      if (sizeTmp > 0) {
        this.size = sizeTmp;
      }
      this.loadUsers();

    });
  }

  onFilterTextChange() {
    this.loadUsers();
  }

  loadUsers() {
    this.superAdminService.userList(this.page, this.size, this.keyword).subscribe({
      next: userVo => {
        console.log('Success userVo', userVo);
        if (userVo.errcode == 0) {
          this.userVos = userVo.userVos;
        }
      },
      error: err => {
        this.toastService.showErrorToast("加载用户失败", "服务器出错");
      }
    })
  }

  toBack(): void {
    this.location.back()
  }
}
