import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";
import {UserVo} from "../models/UserVo";
import {map} from "rxjs/operators";
import {TicketVo} from "../models/TicketVo";
import {Result} from "../models/Result";
import {plainToClass} from "class-transformer";
import {QueueVo} from "../models/QueueVo";
// const API_URL = 'http://localhost:8080/api/users/';
const API_URL = environment.backendAddress + 'api/users/';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  // updateFcmToken(data: any): Observable<any> {
  //   return this.http.post(API_URL + 'fcm-token', data, httpOptions);
  // }
  //
  // resetPassword(password: string): Observable<any> {
  //   return this.http.post(API_URL + 'reset-password', {password: password}, httpOptions);
  // }
  updateBgNotify(data: UserVo): Observable<Result> {
    return this.http.post(API_URL + 'update-bg-notify', data, httpOptions)
      .pipe(map(data => new Result().deserialize(data)));
  }
  // updateFgNotify(data: UserVo): Observable<Result> {
  //   return this.http.post(API_URL + 'update-fg-notify', data, httpOptions)
  //     .pipe(map(data => new Result().deserialize(data)));
  // }
  updateEmailNotify(data: UserVo): Observable<Result> {
    return this.http.post(API_URL + 'update-email-notify', data, httpOptions)
      .pipe(map(data => new Result().deserialize(data)));
  }
  // isUserExist(userVo: UserVO): Observable<UserVO> {
  //   return this.http.post(API_URL + 'isUserExist', userVo, httpOptions)
  //     .pipe(map(data => new UserVO().deserialize(data)));
  // }

  userInfo(): Observable<UserVo> {
    return this.http.get(API_URL + 'user-info').pipe(map(data => {
      let userVo = plainToClass(UserVo, data);
      return userVo;
      // return new UserVo().deserialize(data);
    }));
  }

}
