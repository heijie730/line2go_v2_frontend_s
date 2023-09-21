import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ServiceRequestVo} from "../models/ServiceRequestVo";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {BoardCastLogVo} from "../models/BoardCastLogVo";

const AUTH_API = environment.backendAddress + 'api/board-cast-log';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class BoardCastLogService {

  constructor(private http: HttpClient) {
  }

  create(boardCastLogVo: BoardCastLogVo): Observable<BoardCastLogVo> {
    return this.http.post(`${AUTH_API}/create`, boardCastLogVo, httpOptions).pipe(map(data => {
      return new BoardCastLogVo().deserialize(data);
    }));
  }

  list(queueId: string, date: string, page: number, size: number): Observable<BoardCastLogVo> {
    return this.http.get(`${AUTH_API}/list/${queueId}/${date}` + '?page=' + page + '&size=' + size).pipe(map(data => {
      return new BoardCastLogVo().deserialize(data);
    }));
  }
  deleteByQueueIdAndDate(queueId: string, date: string): Observable<BoardCastLogVo> {
    return this.http.delete(`${AUTH_API}/${queueId}/${date}` )
      .pipe(map(data => new BoardCastLogVo().deserialize(data)));
  }
}
