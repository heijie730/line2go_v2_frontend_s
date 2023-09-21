import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "../../_services/token-storage.service";
import {JwtResponse} from "../../models/JwtResponse";
import {UserService} from "../../_services/user.service";
import {ToastService} from 'src/app/_helpers/toast.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: JwtResponse;
  password: string;

  constructor(private tokenStorageService: TokenStorageService,
              private userService: UserService,
              private toastService: ToastService) {
  }


  ngOnInit(): void {
  }

}
