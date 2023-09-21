import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { TokenStorageService } from "../../_services/token-storage.service";
import { UserService } from "../../_services/user.service";
import { UserRole } from "../../models/UserVo";
import { ToastService } from "../../_helpers/toast.service";

// import { AngularFireMessaging } from "@angular/fire/compat/messaging";

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.css']
})
export class SelectRoleComponent implements OnInit {
  return: string;
  // fcmToken: string | null;
  // isVisitor: boolean = false;
  isSuperAdmin: boolean = false;

  constructor(
    public router: Router,
    private activateRoute: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastService,
    private token: TokenStorageService,
    private tokenStorage: TokenStorageService,
    // private angularFireMessaging: AngularFireMessaging,
  ) {}

  ngOnInit(): void {
    let user = this.tokenStorage.getUser();
    // this.isVisitor = user?.registrationMethod == 'Guest Registration';
    console.log("user?.userRole", user?.userRole)
    this.isSuperAdmin = user?.userRole == UserRole.SUPER_ADMIN;
    console.log("isSuperAdmin", this.isSuperAdmin)
    // if (this.isVisitor) {
    //   this.router.navigate(['/member/home']);
    //   return;
    // }
    if ('serviceWorker' in navigator) {
      // Browser supports PWA
      // this.toastService.showInfoToast("Browser supports PWA")
      console.log("Browser supports PWA")
    } else {
      // Browser does not support PWA
      // this.toastService.showErrorToast("Browser does not support PWA")
      console.log("Browser does not support PWA")
    }

    this.activateRoute.queryParams.subscribe(params => {
      this.return = params['return']
      if (this.return) {
        this.router.navigateByUrl(this.return);
      } else {
        let role = params['role'];
        if (role) {
          if (role == 'leader') {
            this.router.navigate(['/leader/home']);
          }
          if (role == 'member') {
            this.router.navigate(['/member/home']);
          }
        }
      }
    });
  }

  logout(): void {
    this.toastService.showConfirmAlert("Are you sure you want to log out?",()=>{
      this.token.signOut();
      window.location.reload();
    })

  }
}
