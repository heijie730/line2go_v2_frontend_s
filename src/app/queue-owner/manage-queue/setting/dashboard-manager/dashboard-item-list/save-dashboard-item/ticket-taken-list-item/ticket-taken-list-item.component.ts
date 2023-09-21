import {Component, Input, OnDestroy} from '@angular/core';
import {QueueVo, TicketTakenListSetting} from "../../../../../../../models/QueueVo";
import {TicketService} from "../../../../../../../_services/ticket.service";
import {DateTimeUtils} from "../../../../../../../_utils/dateTimeUtils";
import {TicketVo} from "../../../../../../../models/TicketVo";
import {QuestionType} from "../../../../../../../models/survey/Question";
import {TtsService} from "../../../../../../../_helpers/tts.service";
import {AppComponent} from "../../../../../../../app.component";
import {environment} from "../../../../../../../../environments/environment";
import {Result} from "../../../../../../../models/Result";
import {AbsBaseDraggable} from "../base-draggable/AbsBaseDraggable";
import {PollingUtil} from "../../../../../../../_helpers/PollingUtil";
import {Observable, tap} from "rxjs";

@Component({
  selector: 'app-ticket-taken-list-item[dashboardEnum][dashboardItem][queueVo]',
  templateUrl: './ticket-taken-list-item.component.html',
  styleUrls: ['./ticket-taken-list-item.component.css']
})
export class TicketTakenListItemComponent extends AbsBaseDraggable implements OnDestroy {
  @Input() queueVo: QueueVo;
  // date: string;
  ticketVo: TicketVo = new TicketVo();
  ticketTakenListSetting: TicketTakenListSetting;
  ticketInterval: any;
  haveBeenPlayList: string[] = [];

  constructor(private ticketService: TicketService, public dateTimeUtils: DateTimeUtils,
              private ttsService: TtsService) {
    super();
  }

  ngOnInit(): void {
    // this.date = this.dateTimeUtils.yyyyMMdd(new Date(),this.queueVo.timeZone);
    this.ticketTakenListSetting = this.dashboardItem.ticketTakenListSetting;
    this.loadQueueInfo();
    this.loadTicketsInterval();
  }

  // loadTicketsInterval(): void {
  //   this.ticketInterval = setInterval(() => {
  //     if (!AppComponent.hidden) {
  //       this.loadQueueInfo();
  //     }
  //   }, environment.dashboardTicketInterval);
  //   console.log("ticketInterval", this.ticketInterval);
  // }

  pollingUtil = new PollingUtil();

  loadTicketsInterval() {
    this.pollingUtil.poll(
      () => this.loadQueueInfoObservable(),
      environment.dashboardTicketInterval,
      60000,
      1.1,
      () => AppComponent.hidden
    );
  }

  ngOnDestroy(): void {
    this.pollingUtil.stop();
    console.log("ngOnDestroy subscription");
    // clearInterval(this.ticketInterval);
    // console.log("ngOnDestroy ticketInterval", this.ticketInterval);
  }
  loadQueueInfo(): void {
    this.loadQueueInfoObservable().subscribe();
  }
  loadQueueInfoObservable(): Observable<any> {
    return this.ticketService.dashboardQueueInfoItem(this.queueVo.id, this.ticketTakenListSetting).pipe(
      tap(data => {
        this.ticketVo = data;
        // console.log(this.ticketVo);
        for (let ticketVo of this.ticketVo.ticketVos) {
          let tagMessages1 = this.ticketTakenListSetting.tagMessages;
          let tagMessages = tagMessages1.filter(item => item.tags.every(tag => ticketVo.tags.map(x => x.tagContent).includes(tag.tagContent)));
          if (tagMessages.length > 0) {
            //若有多个，选择最后一个
            let tagMessage = tagMessages[tagMessages.length - 1];
            let tags1 = tagMessage.tags;
            //找ticket的符合tags1的tags,检查tag的设置时间，超过一定时间则不播放语音。
            let tags2 = ticketVo.tags.filter(x => tags1.map(t => t.tagContent).includes(x.tagContent));
            let tags2Element = tags2[tags2.length - 1];
            // console.log(tags2Element);
            let dateTime = tags2Element.createDateTime;
            // 创建一个新的时间，比当前时间早30秒
            let diffNowSeconds = this.dateTimeUtils.diffNowSeconds(dateTime);
            let expired = diffNowSeconds < -30;
            console.log(diffNowSeconds, expired);
            ticketVo.dashboardMessage = tagMessage.message;
            let voiceBoardCast = tagMessage.voiceBoardCast;
            if (voiceBoardCast.enable && !expired) {
              let template = voiceBoardCast.template;
              let ticketNo = ticketVo.ticketNo;
              let voiceText = template.toVoiceText(ticketVo);
              // let notificationParams = template.notificationParams;
              // let voiceText = template.template;
              // let ticketNo = ticketVo.ticketNo;
              // for (let notificationParam of notificationParams) {
              //   let tags = notificationParam.tags;
              //   let filledSurveyVo = ticketVo.ticketUserInfo.filledSurveyVo;
              //   if (notificationParam.placeholder == "{0}") {
              //     voiceText = voiceText.replace(notificationParam.placeholder, ticketNo + "");
              //     continue;
              //   }
              //   if (filledSurveyVo) {
              //     for (let page of filledSurveyVo.survey.pages) {
              //       let element = page.elements[0];
              //       let question = element.question;
              //       if (question.type == QuestionType.SHORT_TEXT) {
              //         const shortText = question.shortText;
              //         let shortTextTags = shortText.tags;
              //         let every = tags.every(tag => shortTextTags.map(x => x.tagContent).includes(tag.tagContent));
              //         if (every) {
              //           voiceText = voiceText.replace(notificationParam.placeholder, shortText.answer);
              //           break;
              //         }
              //       }
              //     }
              //   }
              // }
              if (voiceText) {
                let key = ticketNo + dateTime.toString();
                if (!this.haveBeenPlayList.includes(key)) {
                  console.log("voiceText", voiceText);
                  this.ttsService.speak(voiceText, voiceBoardCast.volume, voiceBoardCast.rate, voiceBoardCast.pitch, voiceBoardCast.playTimes);
                  this.haveBeenPlayList.push(key);
                }
              }
            }
          } else {
            ticketVo.dashboardMessage = '';
          }

        }
      })
    );
  }
}
