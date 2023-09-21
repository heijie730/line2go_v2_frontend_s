import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../../_services/queue.service";
import {ToastService} from "../../_helpers/toast.service";
import {InformItem, QueueVo, Tag} from "../../models/QueueVo";
import {DateTimeUtils} from "../../_utils/dateTimeUtils";
import * as bootstrap from 'bootstrap';
import {TicketService} from "../../_services/ticket.service";
import {FilterTagOption, SearchOption, SearchOptionVo, TicketSearchVo, TicketVo} from "../../models/TicketVo";
import {InformMembersVo} from "../../models/InformMembersVo";
import {GenerateTicketsVo} from "../../models/GenerateTicketsVo";
import {TagTicketVo} from "../../models/TagTicketVo";
import {AppComponent} from "../../app.component";
import {TagVo} from "../../models/TagVo";
// import * as moment from "moment/moment";
// import {NgxPrinterService} from "ngx-printer";
import {environment} from "../../../environments/environment";
import {Title} from '@angular/platform-browser';
import {StateService} from "../../_services/state.service";
import Swal from 'sweetalert2'
import {TtsService} from "../../_helpers/tts.service";
// import {TicketSubscriptionService} from "../../_services/ticket-subscription.service";
import {AwsService} from "../../_services/aws-service.service";
import {BoardCastType, RoleEnum} from "../../models/BoardCastLogVo";
import {BoardCastComponent} from "../../share/board-cast/board-cast.component";
import {CustomUtils} from "../../_utils/CustomUtils";
import {TokenStorageService} from "../../_services/token-storage.service";
import {JwtResponse} from "../../models/JwtResponse";
import flatpickr from "flatpickr";
import {timer, pipe, tap, Observable, Subscription} from 'rxjs';
import {concatMap, delayWhen, filter} from 'rxjs/operators';
import {PollingUtil} from "../../_helpers/PollingUtil";

@Component({
  selector: 'app-manage-queue',
  templateUrl: './manage-queue.component.html',
  styleUrls: ['./manage-queue.component.css']
})
export class ManageQueueComponent implements OnInit, OnDestroy, AfterViewInit {
  active = 1;
  queue: QueueVo;
  // boardCast: any;
  queueId: any;
  rangeValue: number = 1;
  members: any;
  date: string;
  ticketInterval: any;

  ticketVos: TicketVo[] = [];
  checkedTicketsOfPage: TicketVo[] = [];
  allCheckedTicketsOfPage: TicketVo[][] = [];
  allCheckedTickets: TicketVo[] = [];
  informItems: InformItem[] = [];
  // allTags: Tag[] = [];
  tags: Tag[] = [];
  // excludeTagVos: TagVo[] = [];
  filterTagVos: TagVo[] = [];
  // allTagVos: TagVo[] = [];
  // excludeTags: Tag[] = [];
  filterTags: Tag[] = [];
  filterText: string = "";
  page: number = 0;
  size: number = 35;
  singleItem: TicketVo;
  activeTabIndex: number = 3;
  generateTicketNums: number;
  generateByTicketNo: GenerateByTicketNo = new GenerateByTicketNo();
  // dateStr: string;
  domain: string = environment.domain;
  queueUpUrl: string;
  // miniAppPath: string;
  @ViewChild(BoardCastComponent) boardCastComponent: BoardCastComponent;
  generateType: string = 'BY_TICKET_COUNT';
  searchOptionVoList: SearchOptionVo[] = SearchOptionVo.toDefaultSearchOptionVoList();
  searchOption: SearchOption = new SearchOption();
  allowReceiveGifted: boolean = false;
  remainingCount: number;
  miniAppQrCodeUrl: string;
  filterTagOption: FilterTagOption = FilterTagOption.EXCLUDE; // 默认选中 "exclude"
  RoleEnum = RoleEnum;
  user: JwtResponse | null;
  @ViewChild('datePicker') datePicker: ElementRef;

  constructor(public router: Router,
              private activateRoute: ActivatedRoute,
              private queueService: QueueService,
              private ticketService: TicketService,
              private toastService: ToastService,
              private ttsService: TtsService,
              // private printerService: NgxPrinterService,
              private titleService: Title,
              private tokenStorageService: TokenStorageService,
              public dateTimeUtils: DateTimeUtils,
              // private ticketSubscriptionService: TicketSubscriptionService,
              private stateService: StateService,
              private customUtils: CustomUtils,
              private awsService: AwsService) {
  }

  showTab() {
    let triggerEl;
    if (this.activeTabIndex == 1) {
      triggerEl = document.getElementById("nav-home-tab");
    } else if (this.activeTabIndex == 2) {
      triggerEl = document.getElementById("nav-setting-tab");
    } else if (this.activeTabIndex == 3) {
      triggerEl = document.getElementById("nav-contact-tab");
    }
    if (triggerEl) {
      bootstrap.Tab.getOrCreateInstance(triggerEl).show();
    }
  }

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
    this.activeTabIndex = AppComponent.activeTabIndex;
    this.showTab();
    this.activateRoute.params.subscribe(params => {
      this.queueId = params['id'];
      let date = params['date'];
      //有时候当没有date时，且在微信环境好像会把缓存清理掉，微信会如果隔了一天就会加载到最新的日期，而不是昨天的日期。
      if (date) {
        // this.date = this.dateTimeUtils.yyyyMMdd(moment(date).toDate());
        this.date = date;
      } else {
        // let stringState = this.stateService.getManageQueueState(this.queueId);
        // if (stringState) {
        //   this.date = stringState;
        // } else {
        //   this.date = this.dateTimeUtils.yyyyMMdd(new Date());
        // }
      }
      let loadDateFn = () => {
        if (!this.date) {
          let stringState = this.stateService.getManageQueueState(this.queueId);
          if (stringState) {
            this.date = stringState;
          } else {
            this.date = this.dateTimeUtils.yyyyMMdd(new Date(),this.queue.timeZone);
          }
        }
        this.stateService.setManageQueueState(this.queueId, this.date);
      };
      // this.stateService.setManageQueueState(this.queueId, this.date);
      // this.dateStr = moment(this.date).format('YYYY-MM-DD');
      this.loadTickets();
      this.loadQueue(loadDateFn);
    });
    this.offCanvasCloseListener();
    this.activeTabListener();
    // this.loadToolTip();

    this.loadTicketsInterval();
  }

  loadQueue(loadDateFn?:() => void) {
    // Swal.showLoading();
    this.queueService.findByIdAndUserId(this.queueId).subscribe({
      next: queueVO => {
        // Swal.close();
        console.log('data', queueVO);
        this.queue = queueVO;
        if (loadDateFn){
          loadDateFn();
        }
        // this.titleService.setTitle(this.queue.queueName);

        // let memberLoginOptions = this.queue.memberOptions.memberLoginOptions;
        // let urlParam = memberLoginOptions.toUrlParam();
        // let param = urlParam ? '?' + urlParam : '';
        // this.queueUpUrl = environment.domain + '/member/queue-up/' + this.queue?.id + '/' + this.date + param;

        this.queueUpUrl = this.customUtils.buildQueueUpUrl(this.queue, this.date);
        // this.miniAppPath = this.customUtils.buildMiniAppPath(this.queueId, this.date);
        if (!this.queue) {
          this.router.navigate(['/leader/home']);
          return;
        }
        if (this.queue.manualNotification.informItems && this.queue.manualNotification.informItems.length > 0) {
          this.informItems = this.queue.manualNotification.informItems;
        }
        if (this.queue.tags && this.queue.tags.length > 0) {
          // this.allTags = this.queue.tags;
          this.tags = this.queue.tags.filter(x => x.showInCanvas);
          //获取filterTagVos
          let filterState = this.stateService.getFilterState(this.queueId);
          console.log("filterState", filterState)
          if (filterState) {
            this.filterTagVos = filterState.filterTagVos;
            this.filterTagOption = filterState.filterTagOption;
          } else {
            this.filterTagVos = this.tags.map(x => {
              let tagVo = x.toTagVo();
              if (tagVo.tagContent == 'Ended') {
                tagVo.checked = true;
              }
              return tagVo;
            });
            this.filterTagOption = FilterTagOption.EXCLUDE;
          }
          this.filterTags = this.filterTagVos.filter(item => item.checked).map(x => x.toTag());
        }
        // this.loadMiniAppQrCodeUrl();
      },
      error: err => {
        // Swal.close();
        this.toastService.showErrorToast("Operation failed", "Server error");
        console.log('Fail', err);
      }
    });
  }

  // loadMiniAppQrCodeUrl() {
  //   // if (this.queue.miniAppS3Key) {
  //   this.queueService.getMiniAppUrl(this.queueId).subscribe({
  //     next: data => {
  //       this.miniAppQrCodeUrl = data.miniAppUrl;
  //       console.log(this.miniAppQrCodeUrl);
  //     }
  //   })
  // }

  pollingUtil = new PollingUtil();

  loadTicketsInterval() {
    this.pollingUtil.poll(
      () => this.loadTicketsObservable(),
      environment.leaderTicketInterval,
      60000,
      1.1,
      () => AppComponent.hidden
    );
  }


  // private subscription: Subscription | null = null;
  //
  // loadTicketsInterval() {
  //   let delay = environment.leaderTicketInterval; // initial delay
  //   const maxDelay = 60000; // maximum delay
  //   const delayFactor = 1.1; // delay increases by a factor of 2 each time
  //   let lastIntervalData: any;
  //   const source$ = timer(0, delay).pipe(
  //     filter(() => !AppComponent.hidden), // skip polling when the app is hidden
  //     concatMap(val => this.loadTickets().pipe(
  //       delayWhen((x, y) => {
  //         let b = JSON.stringify(lastIntervalData) == JSON.stringify(x);
  //         if (b) {
  //           delay = Math.min(delay * delayFactor, maxDelay); // increase delay if the data has not changed
  //         } else {
  //           delay = environment.leaderTicketInterval; // reset delay if the data has changed
  //         }
  //         lastIntervalData = x;
  //         console.log(`Next poll in ${delay}ms`); // print the time till the next poll
  //         return timer(delay);
  //       })
  //     ))
  //   );
  //
  //   this.subscription = source$.subscribe();
  // }

  // loadTicketsInterval(): void {
  //   this.ticketInterval = setInterval(() => {
  //     if (!AppComponent.hidden) {
  //       this.loadTickets();
  //     }
  //   }, environment.leaderTicketInterval);
  //   console.log("ticketInterval", this.ticketInterval);
  // }


  ngOnDestroy(): void {
    // clearInterval(this.ticketInterval);
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    //   this.subscription = null;
    // }
    this.pollingUtil.stop();
    console.log("ngOnDestroy subscription");

  }


  //
  // loadToolTip(): void {
  //     const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  //     tooltipTriggerList.forEach(function (tooltipTriggerEl) {
  //         new bootstrap.Tooltip(tooltipTriggerEl);
  //     });
  // }

  // loadTickets(): void {
  //   let ticketSearchVo = new TicketSearchVo();
  //   ticketSearchVo.queueId = this.queueId;
  //   ticketSearchVo.ticketDate = this.date;
  //   ticketSearchVo.filterTags = this.filterTags;
  //   // ticketSearchVo.excludeTags = this.excludeTags;
  //   ticketSearchVo.keyword = this.filterText;
  //   ticketSearchVo.searchOption = this.searchOption;
  //   ticketSearchVo.filterTagOption = this.filterTagOption;
  //   //fixme
  //   this.queueService.findTicketNoOfDay(ticketSearchVo, this.page, this.size).subscribe({
  //     next: result => {
  //       console.log('Success findTicketNoOfDay', result);
  //       this.ticketVos = result.ticketVos;
  //       for (let ticketVo of this.ticketVos) {
  //         if (this.allCheckedTicketsOfPage[this.page]) {
  //           if (this.allCheckedTicketsOfPage[this.page].map(x => x.id).includes(ticketVo.id)) {
  //             ticketVo.checked = true;
  //           }
  //         }
  //       }
  //       this.onCheckItemChange();
  //     }
  //   })
  // }
  loadTickets(): void {
    this.loadTicketsObservable().subscribe();
  }

  loadTicketsObservable(): Observable<any> {
    let ticketSearchVo = new TicketSearchVo();
    ticketSearchVo.queueId = this.queueId;
    ticketSearchVo.ticketDate = this.date;
    ticketSearchVo.filterTags = this.filterTags;
    // ticketSearchVo.excludeTags = this.excludeTags;
    ticketSearchVo.keyword = this.filterText;
    ticketSearchVo.searchOption = this.searchOption;
    ticketSearchVo.filterTagOption = this.filterTagOption;
    //fixme
    return this.queueService.findTicketNoOfDay(ticketSearchVo, this.page, this.size)
      .pipe(
        tap(result => {
          console.log('Success findTicketNoOfDay', result);
          this.ticketVos = result.ticketVos;
          for (let ticketVo of this.ticketVos) {
            if (this.allCheckedTicketsOfPage[this.page]) {
              if (this.allCheckedTicketsOfPage[this.page].map(x => x.id).includes(ticketVo.id)) {
                ticketVo.checked = true;
              }
            }
          }
          this.onCheckItemChange();
        })
      );
  }

  tagTicket(tag: Tag): void {
    let tagTicketVo = new TagTicketVo();
    tagTicketVo.ids = this.allCheckedTickets.map(x => x.id);
    tagTicketVo.tags = [tag];
    tagTicketVo.queueId = this.queueId;
    this.ticketService.tagTicket(tagTicketVo).subscribe({
      next: result => {
        console.log('tagTicket Success', result);
        this.loadTickets();
        this.toastService.showSuccessToast('Updated successfully');
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });
  }

  inform(informItem: InformItem): void {
    let informMembersVO = new InformMembersVo();
    informMembersVO.members = this.allCheckedTickets.map(x => x.ticketNo);
    informMembersVO.date = this.date;
    informMembersVO.id = this.queueId;
    informMembersVO.informItem = informItem;
    informMembersVO.ticketIds = this.allCheckedTickets.map(x => x.id);
    informMembersVO.type = BoardCastType.QUEUE_INFO;
    informMembersVO.nickName = this.queue.nickName;
    informMembersVO.role = RoleEnum.LEADER;

    let voiceBoardCast = informItem.voiceBoardCast;
    if (voiceBoardCast.enable) {
      let template = voiceBoardCast.template;
      let textArray = [];
      for (let checkedTicket of this.allCheckedTickets) {
        let voiceText = template.toVoiceText(checkedTicket);
        textArray.push(voiceText);
      }
      let join = textArray.join("，");
      console.log("voiceText", join);
      this.ttsService.speak(join, voiceBoardCast.volume, voiceBoardCast.rate, voiceBoardCast.pitch, voiceBoardCast.playTimes);
    }

    Swal.showLoading();
    this.queueService.informMembers(informMembersVO).subscribe({
      next: informMembersVO => {
        Swal.close();
        console.log("informMembers", informMembersVO)
        this.loadTickets();
        this.toastService.showSuccessToast('Notification successful');
        this.updateBoardCast();
        if (informMembersVO.members.length > 0) {
          this.toastService.showWarningToast("Tickets " + informMembersVO.members.join(",") + " have not been claimed yet.");
        }
      },
      error: err => {
        Swal.close();
        this.toastService.showErrorToast("Notification failed due to server error");
      }
    });
  }

  activeTabListener(): void {
    // const tabEl = document.getElementById('navTab');
    const tabEl = document.querySelectorAll('button[data-bs-toggle="tab"]');
    tabEl.forEach((el: any) => {
      el.addEventListener('show.bs.tab', (event: any) => {
        // this.active = event.target.dataset.bsTarget;
        let bsTarget = event.target.dataset.bsTarget;
        console.log('event.target.dataset.bsTarget', bsTarget);
        if (bsTarget == '#nav-home') {
          this.activeTabIndex = 1;
        }
        if (bsTarget == '#nav-setting') {
          this.activeTabIndex = 2;
        }
        if (bsTarget == '#nav-contact') {
          this.activeTabIndex = 3;
        }
        AppComponent.activeTabIndex = this.activeTabIndex;
      });
    });
  }

  ngAfterViewInit() {
    // const currentDate = new Date();
    // let maxDate = currentDate.setMonth(currentDate.getMonth()+6);
    // const currentDate2 = new Date();
    // let minDate = currentDate2.setMonth(currentDate2.getMonth()-1);
    let flatpickrInstance = flatpickr(this.datePicker.nativeElement, {
      mode: 'single',
      // minDate: minDate,
      // maxDate: maxDate,
      defaultDate: this.date,
      dateFormat: 'Y-m-d',
      allowInput: false,
      disableMobile: true,
      onChange: (selectedDates) => {
        console.log(selectedDates);
        this.afterDateChecked(selectedDates[0]);
      }
    });
  }

  offCanvasCloseListener(): void {
    const offCanvas = document.getElementById('offcanvasScrolling');
    if (offCanvas) {
      offCanvas.addEventListener('hide.bs.offcanvas', event => {
        console.log('offcanvasScrolling hidden');
        this.ticketVos.forEach((ticketItem: TicketVo) => {
          ticketItem.checked = false;
        });
        this.checkedTicketsOfPage = [];
        this.allCheckedTickets = [];
        this.allCheckedTicketsOfPage = [];
      });
    }
  }

  ticketClick(ticketVo: TicketVo) {
    ticketVo.checked = !ticketVo.checked;
    this.onCheckItemChange();
  }

  onCheckItemChange(): void {
    // console.log("event", event.target.checked);
    this.checkedTicketsOfPage = this.ticketVos.filter(item => item.checked);
    this.allCheckedTicketsOfPage[this.page] = this.checkedTicketsOfPage;
    this.allCheckedTickets = this.allCheckedTicketsOfPage.flatMap(x => x);
    let length = this.allCheckedTickets.length;
    const element = document.getElementById('offcanvasScrolling');
    if (element) {
      const offcanvasScrolling = bootstrap.Offcanvas.getOrCreateInstance(element);
      if (length > 0) {
        // this.checkedTicketNos = this.checkedTicketItems.map(item => item.ticketNo);
        if (length == 1) {
          this.singleItem = this.allCheckedTickets[0];
        } else {
          this.singleItem = new TicketVo();
        }
        offcanvasScrolling?.show();
      } else {
        offcanvasScrolling?.hide();
      }
    }
    // const offcanvasScrolling = bootstrap.Offcanvas.getOrCreateInstance('#offcanvasScrolling') // Returns a Bootstrap popover instance
    // if (length > 0) {
    //   // this.checkedTicketNos = this.checkedTicketItems.map(item => item.ticketNo);
    //   if (length == 1) {
    //     this.singleItem = this.allCheckedTickets[0];
    //   } else {
    //     this.singleItem = new TicketVo();
    //   }
    //   offcanvasScrolling?.show();
    // } else {
    //   offcanvasScrolling?.hide();
    // }
  }

  toPage(page: number): void {
    this.page = page;
    this.loadTickets();
  }

  closeModal(id: string): void {
    var myModalEl = document.getElementById(id);
    if (myModalEl) {
      var modal = bootstrap.Modal.getInstance(myModalEl);
      if (modal) {
        modal.hide();
      }
    }
  }

  generateTicketByCount(): void {
    console.log("generateTicket", this.generateTicketNums);
    this.generateTicketNums = parseInt(this.generateTicketNums + "");
    if (!this.generateTicketNums) {
      this.toastService.showErrorToast('Please enter the number of tickets to generate');
      return;
    }
    if (this.generateTicketNums <= 0) {
      this.toastService.showErrorToast('The number of tickets to generate must be greater than 0');
      return;
    }
    if (this.generateTicketNums > 50) {
      this.toastService.showErrorToast('The number of tickets to generate cannot exceed 50');
      return;
    }
    let generateTicketsVo = new GenerateTicketsVo();
    generateTicketsVo.queueId = this.queueId;
    generateTicketsVo.date = this.date;
    generateTicketsVo.count = this.generateTicketNums;
    generateTicketsVo.generateType = this.generateType;
    generateTicketsVo.userId = this.queue.userId;
    this.ticketService.generateTickets(generateTicketsVo).subscribe({
      next: result => {
        console.log('Success', result);
        if (result.errcode == 0) {
          this.toastService.showSuccessToast('Generation successful, please wait...');
          this.close();
          this.loadTickets();
        } else {
          this.toastService.showErrorToast(result.errmsg);
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  generateTicketByTicketNo(): void {
    console.log("generateTicket", this.generateByTicketNo);
    let startTicketNo = parseInt(this.generateByTicketNo.startTicketNo + "");
    let endTicketNo = parseInt(this.generateByTicketNo.endTicketNo + "");
    if (!startTicketNo) {
      this.toastService.showErrorToast('Please enter the starting ticket number');
      return;
    }
    if (!endTicketNo) {
      this.toastService.showErrorToast('Please enter the ending ticket number');
      return;
    }
    if (startTicketNo <= 0 || endTicketNo <= 0) {
      this.toastService.showErrorToast('Ticket number must be greater than 0');
      return;
    }
    if (startTicketNo > endTicketNo) {
      this.toastService.showErrorToast('The starting ticket number cannot be greater than the ending ticket number');
      return;
    }
    let ticketNoArray = this.generateTicketNoArray(startTicketNo, endTicketNo);
    if (ticketNoArray.length > 50) {
      this.toastService.showErrorToast('The number of generated tickets cannot exceed 50');
      return;
    }
    let generateTicketsVo = new GenerateTicketsVo();
    generateTicketsVo.queueId = this.queueId;
    generateTicketsVo.date = this.date;
    generateTicketsVo.ticketNoArray = ticketNoArray;
    generateTicketsVo.generateType = this.generateType;
    generateTicketsVo.userId = this.queue.userId;
    this.ticketService.generateTickets(generateTicketsVo).subscribe({
      next: result => {
        console.log('Success', result);
        if (result.errcode == 0) {
          this.toastService.showSuccessToast('Generation successful, please wait...');
          this.close();
          this.loadTickets();
        } else {
          this.toastService.showErrorToast(result.errmsg);
        }
      }
    });
  }


  generateTicketNoArray(start: number, end: number) {
    const numbers = [];

    for (let i = start; i <= end; i++) {
      numbers.push(i);
    }

    return numbers;
  }


  close() {
    const myModalEl = document.getElementById('advanceModal');
    if (myModalEl) {
      const modal = bootstrap.Modal.getInstance(myModalEl);
      if (modal) {
        modal.hide();
      }
    }
  }

  onGenerateCheckChange(event: any) {
    console.log("onGenerateCheckChange", event.target.checked);
    let queueVo = new QueueVo();
    queueVo.id = this.queueId;
    queueVo.allowUserCreateTicket = event.target.checked;
    this.queueService.updateAllowUserCreateTicket(queueVo).subscribe({
      next: result => {
        console.log('Success', result);
        this.toastService.showSuccessToast('Updated successfully');
      },
      error: err => {
        this.toastService.showErrorToast("Operation failed", "Server error");
      }
    });

  }


  getTicketNos() {
    // return this.checkedTicketsOfPage.map(item => item.ticketNo).join(",");
    return this.allCheckedTickets.map(item => item.ticketNo).join(",");
  }


  updateBoardCast(): void {
    this.boardCastComponent.loadBoardCast();
  }

  includeTagsChange(): void {
    console.log("selectedTagOption", this.filterTagOption);
    this.stateService.setFilterState(this.queueId, this.filterTagVos, this.filterTagOption);
    this.filterTags = this.filterTagVos.filter(item => item.checked).map(x => x.toTag());
    this.loadTickets();
  }

  // excludeTagsChange(): void {
  //   let tagVos = this.excludeTagVos.filter(item => item.checked);
  //   this.excludeTags = tagVos.map(x => x.toTag());
  //   this.loadTickets();
  // }

  onChange(): void {
    let searchOptionVos = this.searchOptionVoList.filter(item => item.checked);
    this.searchOption.searchOptionEnumList = searchOptionVos.map(x => x.key);
    this.loadTickets();
  }

  onFilterTextChange(): void {
    // this.loadTagVos();
    // this.tagVos = this.tagVos.filter(item => item.tagContent.includes(this.filterText));
    this.onChange();
    console.log(this.filterText)
    // let searchTicketVo = new SearchTicketVo();
    // searchTicketVo.searchText = this.filterText;
    // searchTicketVo.date = this.date;
    // this.ticketService·.search(searchTicketVo).subscribe({
    //   next: ticketVo => {
    //     console.log('Success', ticketVo);
    //   },
    //   error: err => {
    //   }
    // })
  }

  afterDateChecked(date: Date): void {
    let yyyyMMdd = this.dateTimeUtils.yyyyMMddOrigin(date);
    console.log("afterDateChecked", yyyyMMdd);
    window.location.href = '/leader/manage-queue/' + this.queueId + "/" + yyyyMMdd;
    // this.toastService.showSuccessToast("Success", "Switched to " + this.dateTimeUtils.yyyyMMdd(date));
  }

  triggerDeleteTag(event: { tag: Tag, ticketVo: TicketVo }): void {
    this.toastService.showConfirmAlert(`Delete tag "${event.tag.tagContent}"?`,
      () => this.deleteTag(event.tag, event.ticketVo));
  }

  deleteTag(tag: Tag, singleItem: TicketVo): void {
    let tagTicketVo = new TagTicketVo();
    tagTicketVo.ids = [singleItem.id];
    tagTicketVo.tags = [tag];
    tagTicketVo.queueId = singleItem.queueId;
    this.ticketService.deleteTag(tagTicketVo).subscribe({
      next: result => {
        console.log('Success', result);
        this.toastService.showSuccessToast("Tag deleted successfully");
        this.loadTickets();
        singleItem.tags = singleItem.tags.filter(obj => obj !== tag);
      }
    });
  }

  deleteTickets(event: { ticketVos: TicketVo[] }): void {
    this.toastService.showConfirmAlert("Are you sure you want to delete?", () => {
      let ticketVo = new TicketVo();
      ticketVo.ticketVos = event.ticketVos;
      this.ticketService.deleteTickets(ticketVo).subscribe({
        next: result => {
          this.toastService.showSuccessToast("Deletion successful");
          this.closeModal("ticketDetailModal");
          this.loadTickets();
          const offcanvasScrolling = bootstrap.Offcanvas.getOrCreateInstance('#offcanvasScrolling');
          offcanvasScrolling?.hide();
        }
      });
    });
  }

  printer(): void {
    // this.printerService.printImg('assets/bratwurst.jpg');
    let numbers = this.allCheckedTickets.map(item => item.ticketNo).join(",");
    this.router.navigate(['/leader/ticket-list', this.queueId], {queryParams: {date: this.date, ticketNos: numbers}})
      .then(() => {
          console.log("router success");
        }
      );
  }

  exportExcel(): void {
    let numbers = this.allCheckedTickets.map(item => item.ticketNo).join(",");
    this.router.navigate(['/leader/export-excel', this.queueId],
      {
        state: {allCheckedTickets: this.allCheckedTickets},
        queryParams: {date: this.date, ticketNos: numbers}
      })
      .then(() => {
          console.log("router success");
        }
      );
  }

  selectAll(): void {
    for (let ticketVo of this.ticketVos) {
      ticketVo.checked = true;
    }
    this.onCheckItemChange();
  }

  copyChecked: boolean = false;

  copyUrl(): void {
    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = this.queueUpUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    // Display a success message for copying
    this.toastService.showAlertWithSuccess('Copy successful, you can share the URL with others for queuing');
    this.copyChecked = true;
  }
}

class GenerateByTicketNo {
  startTicketNo: number;
  endTicketNo: number;
}
