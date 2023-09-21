import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ParameterType, SystemParameterVo} from "../models/SystemParameterVo";

const AUTH_API = environment.backendAddress + 'api/system-parameter';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SystemParameterService {

  constructor(private http: HttpClient) { }

  findByType(type:ParameterType): Observable<SystemParameterVo> {
    return this.http.get(`${AUTH_API}/latest/${type}`).pipe(
      map(data => new SystemParameterVo().deserialize(data))
    );
  }
}
