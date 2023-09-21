import * as moment from "moment/moment";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import 'moment-timezone';

@Injectable({
  providedIn: 'root',
})
export class DateTimeUtils {

  constructor() {
  }

  toCalendar(date: any, timeZone?: string): string {
    moment.locale('en-US');
    if (timeZone) {
      return moment(date).tz(timeZone).calendar();
    } else {
      return moment(date).calendar();
    }
  }

  //正数表示大于当前时间
  diffNowSeconds(target: Date): number {
    const currentTime = moment(); // 当前时间
    const targetTime = moment(target); // 指定时间
    return targetTime.diff(currentTime, 'seconds');
  }

//我使用的是 'HH:mm:ss'，而不是 'hh:mm:ss'，因为 'HH' 代表24小时制的小时数，而 'hh' 代表12小时制的小时数。
  yyyyMMddHHmmss(date?: Date, timeZone?: string) {
    if (!date){
      return "";
    }
    if (timeZone) {
      return moment(date).tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
    } else {
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }
  }

  yyyyMMdd(date: Date, timeZone?: string) {
    if (timeZone) {
      return moment(date).tz(timeZone).format('YYYY-MM-DD');
    } else {
      return moment(date).format('YYYY-MM-DD');

    }
  }

  static yyyyMMddFormat(date: Date, timeZone?: string) {
    if (timeZone) {
      return moment(date).tz(timeZone).format('YYYY-MM-DD');
    } else {
      return moment(date).format('YYYY-MM-DD');
    }
  }

  HHmmDate(date: Date, timeZone?: string) {
    if (timeZone){
      return  moment(date).tz(timeZone).format('MM-DD HH:mm');
    }else{
      return  moment(date).format('MM-DD HH:mm');
    }


  }

  yyyyMMddOrigin(date: Date) {
    return moment(date).format('YYYY-MM-DD');
  }

  parse(date: string, timeZone?: string) {
    if (timeZone){
      return moment(date).tz(timeZone).toDate();
    }else {
      return moment(date).toDate();
    }
  }

}
