import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SurveyVo} from "../models/SurveyVo";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {FilledSurveyVo} from "../models/FilledSurveyVo";


const AUTH_API = environment.backendAddress + 'api/filled-surveys/';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class FilledSurveyService {

  constructor(private http: HttpClient) {
  }

  save(filledSurveyVo: FilledSurveyVo): Observable<FilledSurveyVo> {
    return this.http.post(AUTH_API + 'save', filledSurveyVo, httpOptions)
      .pipe(map(data => new FilledSurveyVo().deserialize(data)));
  }

  findById(id: string): Observable<FilledSurveyVo> {
    return this.http.get(AUTH_API + 'find-by-id/' + id)
      .pipe(map(data => new FilledSurveyVo().deserialize(data)));
  }
}
