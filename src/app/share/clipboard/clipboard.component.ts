import { Component, Input, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Clipboard } from "@angular/cdk/clipboard";
import { ToastService } from "../../_helpers/toast.service";

@Component({
  selector: 'app-clipboard',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.css']
})
export class ClipboardComponent implements OnInit {
  @Input() value: string;

  copyChecked: boolean = false;

  constructor(private clipboard: Clipboard, private toastService: ToastService) {
  }

  ngOnInit(): void {
  }

  copy() {
    var textField = document.createElement('textarea');
    textField.innerText = this.value;
    document.body.appendChild(textField);
    textField.select();
    textField.focus(); //SET FOCUS on the TEXTFIELD
    document.execCommand('copy');
    textField.remove();
    this.toastService.showSuccessToast('Copied successfully');
    this.copyChecked = true;
  }
}
