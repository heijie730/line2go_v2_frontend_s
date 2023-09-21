import {Component, HostListener, OnInit} from '@angular/core';
import {TokenStorageService} from './_services/token-storage.service';
import {HttpClient} from "@angular/common/http";
// import {AngularFireMessaging} from "@angular/fire/compat/messaging";
import {UserService} from "./_services/user.service";
import {ToastService} from './_helpers/toast.service';
// import {AngularFireAuth} from "@angular/fire/compat/auth";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../environments/environment";
import 'reflect-metadata';
import {UserRole} from "./models/UserVo";
import Quill from "quill";
import {AwsService} from "./_services/aws-service.service";
import {AngularFireMessaging} from "@angular/fire/compat/messaging";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  username?: string;
  title: string | undefined;
  static activeTabIndex: number = 3;
  static hidden: boolean;

  constructor(private tokenStorageService: TokenStorageService,
              private userService: UserService,
              private angularFireMessaging: AngularFireMessaging,
              private http: HttpClient,
              private toastService: ToastService,
              // private angularFireAuth: AngularFireAuth,
              private awsService:AwsService,
              private route: ActivatedRoute, private router: Router
  ) {
  }

  ngOnInit(): void {
    this.angularFireMessaging.messages.subscribe((payload) => {
        if (payload) {
          let notification1 = payload.notification;
          if (notification1) {
            const notification = new Notification(<string>notification1.title, {
              body: notification1.body,
            });
          }
        }
      }
    );
    this.logConfig();
  }

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    this.checkHiddenDocument();
  }

  checkHiddenDocument() {
    AppComponent.hidden = document.hidden;
  }

  logConfig() {
    if (environment.production) {
      let user = this.tokenStorageService.getUser();
      let isSuperAdmin = false;
      if (user != null) {
        let userRole = user.userRole;
        if (userRole == UserRole.SUPER_ADMIN) {
          isSuperAdmin = true;
        }
      }
      if (!isSuperAdmin) {
        window.console.log = function () {
        };   // disable any console.log debugging statements in production mode
      }
    }
  }
}
