import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {TicketSearchVo, TicketVo} from "../models/TicketVo";
import {BoardCastLogVo} from "../models/BoardCastLogVo";
import {Result} from "../models/Result";
import {QueueVo, Tag} from "../models/QueueVo";
import {SurveyVo} from "../models/SurveyVo";
import {InformMembersVo} from "../models/InformMembersVo";
import {CreateQueueVo} from "../models/CreateQueueVo";
import {TagVo} from "../models/TagVo";
import {plainToClass} from "class-transformer";
import 'reflect-metadata';
import {NavigationExtras, Router} from "@angular/router";
import {ToastService} from "../_helpers/toast.service";
import {RichTextVo, TextType} from "../models/RichTextVo";
import {RuleResultVo} from "../models/RuleResultVo";
import {ChildQueueVo} from "../models/ChildQueueVo";
import {VerificationCodeVo} from "../models/VerificationCodeVo";

// const AUTH_API = 'http://localhost:8080/api/queues/';
const AUTH_API = environment.backendAddress + 'api/queues/';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private httpBack: HttpClient;

  public static listApiPath: string = 'current-user-queues';
  public static listApiPagePath: string = '/leader/home';

  constructor(private http: HttpClient, private httpBackend: HttpBackend, private router: Router,private toastService: ToastService,) {
    this.httpBack = new HttpClient(httpBackend);
  }

  create(createQueueVo: CreateQueueVo): Observable<any> {
    return this.http.post(AUTH_API + 'create', createQueueVo, httpOptions);
  }

  list(page: number, size: number): Observable<QueueVo> {
    return this.http.get(`${AUTH_API}${QueueService.listApiPath}?page=${page}&size=${size}`)
      .pipe(map(data => new QueueVo().deserialize(data)));
  }
  searchQueues(keyword:string,page: number, size: number): Observable<QueueVo> {
    return this.http.get(`${AUTH_API}search-queues?keyword=${keyword}&page=${page}&size=${size}`)
      .pipe(map(data => new QueueVo().deserialize(data)));
  }
  nearbyQueues(keyword:string,page: number, size: number, x: number, y: number, maxDistance: number): Observable<QueueVo> {
    return this.http.get(`${AUTH_API}nearby-queues?keyword=${keyword}&page=${page}&size=${size}&x=${x}&y=${y}&maxDistance=${maxDistance}`)
      .pipe(map(data => new QueueVo().deserialize(data)));
  }
  updateRichText(richTextVo:RichTextVo): Observable<RichTextVo> {
    return this.http.post(`${AUTH_API}update-rich-text`, richTextVo, httpOptions)
      .pipe(map(data => new RichTextVo().deserialize(data)));
  }
  findRichText(queueId:string, textType:TextType): Observable<RichTextVo> {
    return this.http.get(`${AUTH_API}find-rich-text/${queueId}/${textType}`, httpOptions)
      .pipe(map(data => new RichTextVo().deserialize(data)));
  }
  // updateSmsNotification(updateQueueVo: UpdateQueueVo): Observable<any> {
  //   return this.http.post(AUTH_API + 'update-sms-notification', updateQueueVo, httpOptions)
  //     .pipe(map(data => new Result().deserialize(data)));
  // }

  updateMemberOptions(queueVo: QueueVo): Observable<any> {
    return this.http.post(AUTH_API + 'update-member-options', queueVo, httpOptions)
      .pipe(map(data => new Result().deserialize(data)));
  }

  // updateVmsNotification(updateQueueVo: UpdateQueueVo): Observable<any> {
  //   return this.http.post(AUTH_API + 'update-vms-notification', updateQueueVo, httpOptions)
  //     .pipe(map(data => new Result().deserialize(data)));
  // }

  updateReminderText(data: QueueVo): Observable<Result> {
    return this.http.post(AUTH_API + 'update-reminder-text', data, httpOptions)
      .pipe(map(data => new Result().deserialize(data)));
  }
  updateDiscoveryManager(data: QueueVo): Observable<Result> {
    return this.http.post(AUTH_API + 'update-discovery-manager', data, httpOptions)
      .pipe(map(data => new Result().deserialize(data)));
  }
  // updateQueuePhone(queueId: string): Observable<Result> {
  //   return this.http.post(AUTH_API + `update-queue-phone/${queueId}`, httpOptions)
  //     .pipe(map(data => new Result().deserialize(data)));
  // }
  updateQueueEmail(queueId: string): Observable<Result> {
    return this.http.post(AUTH_API + `update-queue-email/${queueId}`, httpOptions)
      .pipe(map(data => new Result().deserialize(data)));
  }

  updateNickName(data: QueueVo): Observable<Result> {
    return this.http.post(AUTH_API + 'update-nick-name', data, httpOptions)
      .pipe(map(data => new Result().deserialize(data)));
  }
  updateQueueName(data: QueueVo): Observable<Result> {
    return this.http.post(AUTH_API + 'update-queue-name', data, httpOptions)
      .pipe(map(data => new Result().deserialize(data)));
  }
  updateSurveyId(surveyVo: SurveyVo): Observable<Result> {
    return this.http.post(AUTH_API + 'update-survey-id', surveyVo, httpOptions)
      .pipe(map(data => new Result().deserialize(data)));
  }

  findById(id: string): Observable<QueueVo> {
    let url = AUTH_API  +'find-one/'+ id;
    return this.http.get(url).pipe(
      map(data => {
        let queueVo = plainToClass(QueueVo, data);
        if (queueVo.errcode == 1035) {
          this.toastService.showErrorToast("Cannot find information for this queue");
        }
        return queueVo;
      })
    );
  }
  findByIdAndUserId(id: string): Observable<QueueVo> {
    let url = AUTH_API + 'find-one/owner/' + id;
    return this.http.get(url).pipe(
      map(data => {
        let queueVo = plainToClass(QueueVo, data);
        if (queueVo.errcode == 1035) {
          this.toastService.showErrorToast("Cannot find information for this queue");
        }
        return queueVo;
      })
    );
  }
  getDefaultInformItem(): Observable<InformMembersVo> {
    return this.http.get(AUTH_API + 'default-inform-item', httpOptions)
      .pipe(map(data => new InformMembersVo().deserialize(data)));
  }

  informMembers(informMembersVO: InformMembersVo): Observable<InformMembersVo> {
    return this.http.post(AUTH_API + 'inform-members', informMembersVO, httpOptions)
      .pipe(map(data => new InformMembersVo().deserialize(data)));
  }


  findTicketNoOfDay(data: TicketSearchVo, page: number, size: number): Observable<TicketVo> {
    return this.http.post(AUTH_API + 'find-ticket-no-of-day' + '?page=' + page + '&size=' + size, data, httpOptions)
      .pipe(map(data => new TicketVo().deserialize(data)));
    ;
  }

  deleteQueueById(queueId: string): Observable<QueueVo> {
    return this.http.delete(AUTH_API + 'queue/' + queueId)
      .pipe(map(data => new QueueVo().deserialize(data)));
  }

  updateManualInform(queueVo: QueueVo): Observable<QueueVo> {
    return this.http.post(AUTH_API + 'update-manual-inform', queueVo, httpOptions)
      .pipe(map(data => new QueueVo().deserialize(data)));
  }

  updateTicketTakenRule(queueVo: QueueVo): Observable<QueueVo> {
    return this.http.post(AUTH_API + 'update-ticket-taken-rule', queueVo, httpOptions)
      .pipe(map(data => new QueueVo().deserialize(data)));
  }

  updateDashboardManager(queueVo: QueueVo): Observable<QueueVo> {
    return this.http.post(AUTH_API + 'update-dashboard-manager', queueVo, httpOptions)
      .pipe(map(data => new QueueVo().deserialize(data)));
  }

  updateBoardCastManager(queueVo: QueueVo): Observable<QueueVo> {
    return this.http.post(AUTH_API + 'update-board-cast-manager', queueVo, httpOptions)
      .pipe(map(data => new QueueVo().deserialize(data)));
  }
  updateServiceTimeManager(queueVo: QueueVo): Observable<QueueVo> {
    return this.http.post(AUTH_API + 'update-service-time-manager', queueVo, httpOptions)
      .pipe(map(data => new QueueVo().deserialize(data)));
  }
  updateGenerateTicketManager(queueVo: QueueVo): Observable<QueueVo> {
    return this.http.post(AUTH_API + 'update-generate-ticket-manager', queueVo, httpOptions)
      .pipe(map(data => new QueueVo().deserialize(data)));
  }
  updateTagRules(queueVo: QueueVo): Observable<QueueVo> {
    return this.http.post(AUTH_API + 'update-tag-rules', queueVo, httpOptions)
      .pipe(map(data => new QueueVo().deserialize(data)));
  }


  updateStatusQuestions(queueVo: QueueVo): Observable<QueueVo> {
    return this.http.post(AUTH_API + 'update-status-questions', queueVo, httpOptions)
      .pipe(map(data => new QueueVo().deserialize(data)));
  }

  updateAllowUserCreateTicket(queueVo: QueueVo): Observable<Result> {
    return this.http.post(AUTH_API + 'update-allow-user-create-ticket', queueVo, httpOptions)
      .pipe(map(data => new Result().deserialize(data)));
  }

  saveTag(tagVo: TagVo): Observable<TagVo> {
    return this.http.post(AUTH_API + 'save-tag', tagVo, httpOptions)
      .pipe(map(data => new TagVo().deserialize(data)));
  }

  getDefaultTicketTakenRuleItem(): Observable<InformMembersVo> {
    return this.http.get(AUTH_API + 'default-ticket-taken-rule-item', httpOptions)
      .pipe(map(data => new InformMembersVo().deserialize(data)));
  }

  // refreshMiniAppQrCodeUrl(queueId:string): Observable<Result> {
  //   return this.http.post(AUTH_API + 'refresh-mini-app-url/'+queueId, httpOptions)
  //     .pipe(map(data => new Result().deserialize(data)));
  // }
  // getMiniAppUrl(queueId:string): Observable<QueueVo> {
  //   return this.http.get(AUTH_API + `mini-app-url/${queueId}`, httpOptions)
  //     .pipe(map(data => new QueueVo().deserialize(data)));
  // }
  preCheckTicketTaken(queueId:string,date:string): Observable<RuleResultVo> {
    return this.http.get(AUTH_API + `pre-check-ticket-taken/${queueId}/${date}`, httpOptions)
      .pipe(map(data => new RuleResultVo().deserialize(data)));
  }

  addChildQueue(childQueueVo: ChildQueueVo): Observable<ChildQueueVo> {
    return this.http.post(AUTH_API + `add-child-queue`, childQueueVo, httpOptions)
      .pipe(map(data => new ChildQueueVo().deserialize(data)));
  }
  updateChildQueueManager(queueVo: QueueVo): Observable<QueueVo> {
    return this.http.post(AUTH_API + 'update-child-queue-manager', queueVo, httpOptions)
      .pipe(map(data => new QueueVo().deserialize(data)));
  }
  updateChildQueuePassword(childQueueVo: ChildQueueVo): Observable<ChildQueueVo> {
    return this.http.post(AUTH_API + 'update-child-queue-password', childQueueVo, httpOptions)
      .pipe(map(data => new ChildQueueVo().deserialize(data)));
  }
  getTransferQueueCode(queueId:string): Observable<VerificationCodeVo> {
    return this.http.get(AUTH_API + `transfer-queue-code/${queueId}`, httpOptions)
      .pipe(map(data => new VerificationCodeVo().deserialize(data)));
  }
  generateTransferQueueCode(queueId:string): Observable<VerificationCodeVo> {
    return this.http.post(AUTH_API + `transfer-queue-code/${queueId}`, httpOptions)
      .pipe(map(data => new VerificationCodeVo().deserialize(data)));
  }
  verifyTransferQueueCode(verificationCodeVo: VerificationCodeVo): Observable<VerificationCodeVo> {
    return this.http.post(AUTH_API + 'verify-transfer-queue-code', verificationCodeVo, httpOptions)
      .pipe(map(data => new VerificationCodeVo().deserialize(data)));
  }
}
