import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TokenStorageService} from "../../../_services/token-storage.service";
import {JwtResponse} from "../../../models/JwtResponse";
import {DateTimeUtils} from "../../../_utils/dateTimeUtils";

@Component({
  selector: 'app-select-account',
  templateUrl: './select-account.component.html',
  styleUrls: ['./select-account.component.css']
})
export class SelectAccountComponent implements OnInit {
  return: string = '';
  jwtResponses: JwtResponse[];

  constructor(private activatedRoute: ActivatedRoute, private tokenStorage: TokenStorageService,
              private router: Router, public dateTimeUtils: DateTimeUtils,) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.return = params['return'];
      if (!this.return) {
        this.return = '/select-role';
      }
      this.jwtResponses = this.tokenStorage.getSessionInfoList();
      if ((!this.jwtResponses) || this.jwtResponses.length == 0) {
        this.router.navigateByUrl(this.return);
      }
    })
  }

  login(jwt: JwtResponse) {
    this.tokenStorage.saveSessionInfo(jwt);
    this.tokenStorage.removeSessionInfoList();
    this.router.navigateByUrl(this.return);
  }

  logout(): void {
    this.router.navigate(['/login']);
    this.tokenStorage.signOut();
  }
}
