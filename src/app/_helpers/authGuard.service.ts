import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import {TokenStorageService} from "../_services/token-storage.service";
import {ToastService} from "./toast.service";

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private token:TokenStorageService,private userService: UserService,
              private toastService:ToastService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let user = this.token.getUser();
    if (!user) {
      console.log("AuthGuardService 未登录...");
      this.router.navigate(['/login'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    } else {
      console.log("AuthGuardService 已登录...");
      return true;
    }
  }
}
