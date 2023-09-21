import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ServiceRequestVo} from "../models/ServiceRequestVo";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ParameterType, SystemParameterVo} from "../models/SystemParameterVo";
import {UserVo} from "../models/UserVo";
// import {SmsSubscriptionVo} from "../models/SmsSubscriptionVo";

const AUTH_API = environment.backendAddress + 'api/super-admin';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {

  constructor(private http: HttpClient) {
  }

  serviceRequestAppendContent(serviceRequestVO: ServiceRequestVo): Observable<ServiceRequestVo> {
    return this.http.post(`${AUTH_API}/service-request/append-content`, serviceRequestVO, httpOptions).pipe(map(data => {
      return new ServiceRequestVo().deserialize(data);
    }));
  }


  serviceRequestList(page: number, size: number): Observable<ServiceRequestVo> {
    return this.http.get(`${AUTH_API}/service-request` + '?page=' + page + '&size=' + size).pipe(map(data => {
      return new ServiceRequestVo().deserialize(data);
    }));
  }


  serviceRequestFindById(id:string): Observable<ServiceRequestVo> {
    return this.http.get(`${AUTH_API}/service-request/${id}`).pipe(map(data => {
      return new ServiceRequestVo().deserialize(data);
    }));
  }

  save(systemParameterVo: SystemParameterVo): Observable<SystemParameterVo> {
    return this.http.post(`${AUTH_API}/system-parameter/save`, systemParameterVo, httpOptions).pipe(
      map(data => new SystemParameterVo().deserialize(data))
    );
  }

  findLatestByType(type:ParameterType): Observable<SystemParameterVo> {
    return this.http.get(`${AUTH_API}/system-parameter/latest/${type}`).pipe(
      map(data => new SystemParameterVo().deserialize(data))
    );
  }

  userList(page: number, size: number,keyword:string): Observable<UserVo> {
    return this.http.get(`${AUTH_API}/user` + '?page=' + page + '&size=' + size+ '&keyword=' + keyword).pipe(map(data => {
      return new UserVo().deserialize(data);
    }));
  }
  userById(id:string): Observable<UserVo> {
    return this.http.get(`${AUTH_API}/user/${id}`).pipe(map(data => {
      return new UserVo().deserialize(data);
    }));
  }

  // addSms(superAdminVo: SuperAdminVo): Observable<SuperAdminVo> {
  //   return this.http.post(AUTH_API + '/user/sms/add', superAdminVo, httpOptions).pipe(map(data => {
  //     return new SuperAdminVo().deserialize(data);
  //   }));
  // }
}
