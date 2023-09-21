import { Component, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { AwsService } from "../../_services/aws-service.service";
import { ToastService } from "../../_helpers/toast.service";
import { UserImageInterface } from "../../models/QueueVo";

@Component({
  selector: 'app-user-upload[userImage]',
  templateUrl: './user-upload.component.html',
  styleUrls: ['./user-upload.component.css']
})
export class UserUploadComponent {
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input() userImage: UserImageInterface;

  isUploading = false;

  constructor(private awsService: AwsService, private toastService: ToastService) {
    console.log(this.userImage)
  }

  remove() {
    this.userImage.key = '';
    this.userImage.fileName = '';
  }

  uploadFile() {
    const file = this.fileInput.nativeElement.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.toastService.showErrorToast("Please select an image file");
        return;
      }
      if (file.size > 1024 * 1024 * 2) {
        this.toastService.showErrorToast("Image size should not exceed 2MB");
        return;
      }
      this.isUploading = true;
      this.awsService.uploadFile(file, 'dashboard_images').subscribe({
        next: data => {
          console.log('File uploaded:', data);
          // this.keyEmitter.emit(data.Key);
          this.isUploading = false;
          this.userImage.fileName = file.name;
          this.userImage.key = data.Key;
        },
        error: error => {
          console.error('Upload error:', error);
          this.isUploading = false;
        }
      });
    } else {
      console.error('No file selected');
    }
  }
}
