import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ServiceRequestVo} from "../models/ServiceRequestVo";

const AUTH_API = environment.backendAddress + 'api/service-request';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {

  constructor(private http: HttpClient) {
  }

  save(serviceRequestVO: ServiceRequestVo): Observable<ServiceRequestVo> {
    return this.http.post(`${AUTH_API}/save`, serviceRequestVO, httpOptions).pipe(map(data => {
      return new ServiceRequestVo().deserialize(data);
    }));
  }

  appendContent(serviceRequestVO: ServiceRequestVo): Observable<ServiceRequestVo> {
    return this.http.post(`${AUTH_API}/append-content`, serviceRequestVO, httpOptions).pipe(map(data => {
      return new ServiceRequestVo().deserialize(data);
    }));
  }

  // markChecked(id: string, adminChecked?: boolean, userChecked?: boolean): Observable<ServiceRequestVo> {
  //   let serviceRequestVo1 = new ServiceRequestVo();
  //   serviceRequestVo1.id = id;
  //   if (adminChecked){
  //     serviceRequestVo1.adminChecked = adminChecked;
  //   }
  //   if (userChecked){
  //     serviceRequestVo1.userChecked = userChecked;
  //   }
  //   return this.http.post(`${AUTH_API}/mark-checked`, serviceRequestVo1, httpOptions).pipe(map(data => {
  //     return new ServiceRequestVo().deserialize(data);
  //   }));
  // }

  list(page: number, size: number): Observable<ServiceRequestVo> {
    return this.http.get(`${AUTH_API}/list` + '?page=' + page + '&size=' + size).pipe(map(data => {
      return new ServiceRequestVo().deserialize(data);
    }));
  }

  findById(id: string): Observable<ServiceRequestVo> {
    return this.http.get(`${AUTH_API}/${id}`).pipe(map(data => {
      return new ServiceRequestVo().deserialize(data);
    }));
  }
}
