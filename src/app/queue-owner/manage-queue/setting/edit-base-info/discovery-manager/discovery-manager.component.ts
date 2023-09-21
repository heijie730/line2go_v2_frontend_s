import {Component, OnInit} from '@angular/core';
import {DiscoveryManager, LocationItem, QueueVo, TicketDateRulePo} from "../../../../../models/QueueVo";
import {ActivatedRoute} from "@angular/router";
import {ToastService} from "../../../../../_helpers/toast.service";
import {QueueService} from "../../../../../_services/queue.service";
import Swal from "sweetalert2";
import {TokenStorageService} from "../../../../../_services/token-storage.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Point} from "@zxing/library/es2015/core/aztec/detector/Detector";

@Component({
  selector: 'app-discovery-manager',
  templateUrl: './discovery-manager.component.html',
  styleUrls: ['./discovery-manager.component.css']
})
export class DiscoveryManagerComponent implements OnInit {
  queue: QueueVo;
  discoveryManager: DiscoveryManager = new DiscoveryManager();
  // isBindPhone: boolean = false;
  isBindEmail: boolean = false;
  queueId: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private toastService: ToastService,
    private tokenStorageService: TokenStorageService,
    private modalService: NgbModal,
    private queueService: QueueService
  ) {
  }

  ngOnInit(): void {
    let user = this.tokenStorageService.getUser();
    // this.isBindPhone = user?.phone != null;
    this.isBindEmail = user?.email != null;
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['id'];
      Swal.showLoading();
      this.loadQueue();
    });
  }

  loadQueue() {
    this.queueService.findById(this.queueId).subscribe({
      next: queueVO => {
        Swal.close();
        console.log('data', queueVO);
        this.queue = queueVO;
        this.discoveryManager = this.queue.discoveryManager;

      },
      error: err => {
        Swal.close();
        console.log('Fail', err);
        this.toastService.showErrorToast("Server error");
      }
    });
  }

  editDiscoveryManager(): void {
    if (this.queue.discoveryManager.locationItem.enable) {
      if (!this.queue.discoveryManager.locationItem.geoJsonPoint ||
        !this.queue.discoveryManager.locationItem.geoJsonPoint.x
        || !this.queue.discoveryManager.locationItem.geoJsonPoint.y) {
        this.toastService.showErrorToast("Please load location first.");
        return;
      }
      if (!this.queue.discoveryManager.locationItem.address) {
        this.toastService.showErrorToast("Address is required.");
        return;
      }
    }
    this.queueService.updateDiscoveryManager(this.queue).subscribe({
      next: result => {
        console.log('Success', result);
        this.toastService.showSuccessToast('Update successful');
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }

  // refreshPhone() {
  //   this.queueService.updateQueuePhone(this.queue.id).subscribe({
  //     next: result => {
  //       console.log('Success', result);
  //       if (result.errcode == 0) {
  //         this.toastService.showToast('Update successful');
  //         this.loadQueue();
  //       } else {
  //         this.toastService.showErrorToast(result.errmsg);
  //       }
  //     },
  //     error: err => {
  //       this.toastService.showErrorToast("Operation failed", "Server error");
  //     }
  //   });
  // }

  refreshEmail() {
    this.queueService.updateQueueEmail(this.queue.id).subscribe({
      next: result => {
        console.log('Success', result);
        if (result.errcode == 0) {
          this.toastService.showToast('Update successful');
          this.loadQueue();
        } else {
          this.toastService.showErrorToast(result.errmsg);
        }
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");

      }
    });
  }

  //
  // addLocation(modal: any) {
  //   this.currentLocationIndex = null;
  //   this.currentLocation = new LocationItem();
  //   this.modalService.open(modal);
  //   this.refreshLocation();
  // }
  //
  // updateLocation(item: LocationItem, ticketDateIndex: number, modal: any) {
  //   console.log("updateItem", ticketDateIndex, item)
  //   this.currentLocationIndex = ticketDateIndex;
  //   this.currentLocation = JSON.parse(JSON.stringify(item));//深度拷贝
  //   this.modalService.open(modal);
  //
  // }

  // removeLocation(item: LocationItem, modal: any) {
  //   this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
  //     const index = this.discoveryManager.locationItems.indexOf(item);
  //     if (index !== -1) {
  //       this.discoveryManager.locationItems.splice(index, 1);
  //       this.editDiscoveryManager();
  //     }
  //   });
  // }

  refreshLocation() {
    if ('geolocation' in navigator) {
      Swal.showLoading();
      navigator.geolocation.getCurrentPosition(
        (position) => {

          this.discoveryManager.locationItem.geoJsonPoint =
            {
              x: position.coords.longitude,
              y: position.coords.latitude
            }
          Swal.close();
          this.toastService.showToast('Load Successfully.');
        },
        (error) => {
          console.error('Error getting location:', error);
          this.toastService.showAlertWithError('Error getting location.');
          Swal.close();
        }
      );
    } else {
      this.toastService.showAlertWithError('Geolocation is not available in this browser.');
    }

  }

  // submitLocation() {
  //   if (!this.currentLocation.address || !this.currentLocation.address.trim()) {
  //     this.toastService.showErrorToast("You must enter a address.");
  //     return;
  //   }
  //   if (this.currentLocationIndex != null) {
  //     this.discoveryManager.locationItems[this.currentLocationIndex] = this.currentLocation;
  //     this.currentLocationIndex = null;
  //   } else {
  //     console.log(this.currentLocation);
  //     this.discoveryManager.locationItems.push(this.currentLocation);
  //   }
  //   this.editDiscoveryManager();
  //   this.modalService.dismissAll();
  // }

}
