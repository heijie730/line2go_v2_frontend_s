import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {TokenStorageService} from "../_services/token-storage.service";
import {UserService} from "../_services/user.service";
import {ToastService} from "./toast.service";
import {UserRole} from "../models/UserVo";
import {Location} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {
  constructor(private token: TokenStorageService, private userService: UserService,
              private toastService: ToastService,private location: Location,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let user = this.token.getUser();
    if (!user) {
      console.log("SuperAdminGuard 未登录...");
      this.router.navigate(['/login'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    } else {
      // if (user.userRole != UserRole.SUPER_ADMIN) {
      //   this.toastService.showErrorToast("没有权限！");
      //   return false;
      // }
      console.log("SuperAdminGuard 已登录...");
      return true;
    }
  }

}
