import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  errorMessage: string;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void { // 获取错误信息
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.errorMessage = navigation.extras.state['error'];
    }
  }
  navigateHome() {
    this.router.navigate(['/']); // Assumes the home page route is '/'
  }
}
