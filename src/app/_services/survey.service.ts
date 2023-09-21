import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {SurveyVo} from "../models/SurveyVo";
import {Result} from "../models/Result";

const AUTH_API = environment.backendAddress + 'api/surveys/';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(private http: HttpClient) {
  }

  save(surveyVo: SurveyVo): Observable<SurveyVo> {
    return this.http.post(AUTH_API + 'save', surveyVo, httpOptions)
      .pipe(map(data => new SurveyVo().deserialize(data)));
  }

  makeUnEditable(surveyVo: SurveyVo): Observable<Result> {
    return this.http.post(AUTH_API + 'make-un-editable', surveyVo, httpOptions)
      .pipe(map(data => new Result().deserialize(data)));
  }

  findById(id: string): Observable<SurveyVo> {
    return this.http.get(AUTH_API + 'find-by-id/' + id)
      .pipe(map(data => new SurveyVo().deserialize(data)));
  }
  deleteById(id: string): Observable<Result> {
    return this.http.get(AUTH_API + 'delete-by-id/' + id)
      .pipe(map(data => new Result().deserialize(data)));
  }
  surveyList(queueId: string, page: number, size: number): Observable<any> {
    return this.http.get(AUTH_API + 'survey-list/' + queueId + '?page=' + page + '&size=' + size);
  }

}
