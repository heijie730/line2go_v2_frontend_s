import {Injectable} from '@angular/core';

import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  constructor() {
  }

  showToast(message: string, duration?: number, center?: boolean) {
    if (!duration) {
      duration = 2000;
    }

    const toast = document.createElement("div");
    toast.style.position = "fixed";

    if (center) {
      toast.style.top = "50%";
      toast.style.left = "50%";
      toast.style.transform = "translate(-50%, -50%)";
    } else {
      toast.style.bottom = "20px";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%)";
    }

    toast.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    toast.style.color = "white";
    toast.style.padding = "8px 16px";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "1000";
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
    }, duration);
  }


  showConfirmAlert(title: string, confirmFn: () => void,allowOutsideClick?:boolean) {
    Swal.fire({
      title: title,
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      allowOutsideClick: allowOutsideClick !== undefined ? allowOutsideClick : true
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        confirmFn();
      }
    })
  }

  showAlertWithSuccess(message: string) {
    Swal.fire({
      // title: "提示",
      text: message,
      icon: "success",
      showCloseButton: true,
      confirmButtonText: "Confirm",
      allowOutsideClick: false
    });
  }

  showAlertWithInfo(message: string) {
    Swal.fire({
      // title: "提示",
      text: message,
      icon: "info",
      showCloseButton: true,
      confirmButtonText: "Confirm",
      allowOutsideClick: false
    });
  }

  showAlertWithWarning(message: string) {
    Swal.fire({
      // title: "提示",
      text: message,
      icon: "warning",
      showCloseButton: true,
      confirmButtonText: "Confirm",
      allowOutsideClick: false
    });
  }

  showAlertWithError(message: string) {
    Swal.fire({
      // title: "提示",
      text: message,
      icon: "error",
      showCloseButton: true,
      confirmButtonText: "Confirm",
      allowOutsideClick: false
    });
  }

  showAlertWithQuestion(message: string) {
    Swal.fire({
      // title: "提示",
      text: message,
      icon: "question",
      showCloseButton: true,
      confirmButtonText: "Confirm",
      allowOutsideClick: false
    });
  }


  showSuccessToast(title: string, text?: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 1500,
      showCloseButton: true,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: title,
      text: text
    })
  }

  showInfoToast(title: string, text?: string) {

    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      showCloseButton: true,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'info',
      title: title,
      text: text
    })
  }

  showWarningToast(message: string, text?: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 4000,
      showCloseButton: true,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'warning',
      title: message,
      text: text
    })
  }


  showErrorToast(title: string, text?: string) {

    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'error',
      title: title,
      text: text
    })
  }
}
