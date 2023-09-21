import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AwsService} from "../../../../../../../_services/aws-service.service";
import {AbsBaseDraggable} from "../base-draggable/AbsBaseDraggable";

@Component({
  selector: 'app-user-image-item[dashboardEnum][dashboardItem][imageKey]',
  templateUrl: './user-image-item.component.html',
  styleUrls: ['./user-image-item.component.css']
})
export class UserImageItemComponent extends AbsBaseDraggable implements OnChanges {

  @Input() imageKey: string;

  url: string;

  constructor(private awsService: AwsService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('imageKey' in changes) {
      console.log('myObject changed:', changes['imageKey'].currentValue);
      if (this.imageKey) {
        this.awsService.getFileUrl(this.imageKey).subscribe({
          next: data => {
            this.url = data;
            console.log("url = ", this.url)
          }
        })
      }
    }
  }
}
