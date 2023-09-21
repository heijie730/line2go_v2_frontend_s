import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-header-v2',
  templateUrl: './header-v2.component.html',
  styleUrls: ['./header-v2.component.css']
})
export class HeaderV2Component implements OnInit {
  @Input() headerName: string;
  @Output() toBackTrigger: EventEmitter<void> = new EventEmitter();


  constructor(private location: Location,) {
  }

  ngOnInit(): void {
    let observed = this.toBackTrigger.observed;
    console.log("observed", observed);
  }

  toBack(): void {
    if (this.toBackTrigger.observed) { // 使用辅助变量判断是否监听
      this.toBackTrigger.emit();
    } else {
      this.location.back();
    }
  }
}
