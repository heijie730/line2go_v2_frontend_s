import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {NotificationVo} from "../models/NotificationVo";
import {CountNotificationVo} from "../models/CountNotificationVo";
import {Result} from "../models/Result";
import {MarkNotificationVo} from "../models/MarkNotificationVo";
import {UpdateResultVo} from "../models/UpdateResultVo";

const AUTH_API = environment.backendAddress + 'api/notifications/';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {
  }

  list(page: number, size: number, onlyUnRead: boolean): Observable<any> {
    return this.http.get(AUTH_API + 'list' + '?page=' + page + '&size=' + size + '&onlyUnRead=' + onlyUnRead);
  }

  findById(id: string): Observable<NotificationVo> {
    return this.http.get(AUTH_API + 'find-by-id/' + id).pipe(map(data => {
      return new NotificationVo().deserialize(data);
    }));
  }

  countUnRead(): Observable<CountNotificationVo> {
    return this.http.get(AUTH_API + 'count-un-read').pipe(map(data => {
      return new CountNotificationVo().deserialize(data);
    }));
  }

  markChecked(data: MarkNotificationVo): Observable<any> {
    return this.http.post(AUTH_API + 'mark-checked', data, httpOptions)
      .pipe(map(data => new MarkNotificationVo().deserialize(data)));
  }

  delete(data: MarkNotificationVo): Observable<Result> {
    return this.http.post(AUTH_API + 'delete', data, httpOptions)
      .pipe(map(data => new Result().deserialize(data)));
  }
  markAllChecked(): Observable<UpdateResultVo> {
    return this.http.post(AUTH_API + 'mark-all-checked', {}, httpOptions)
      .pipe(map(data => new UpdateResultVo().deserialize(data)));
  }

  findFirstUnRead(): Observable<NotificationVo> {
    return this.http.get(AUTH_API + 'find-first-un-read').pipe(map(data => {
      return new NotificationVo().deserialize(data);
    }));
  }
}
