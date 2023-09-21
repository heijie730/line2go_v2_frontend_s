import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { TicketVo} from "../models/TicketVo";
import {map} from 'rxjs/operators'
import {Result} from "../models/Result";
import {GenerateTicketsVo} from "../models/GenerateTicketsVo";
import {FindMyTicketVo} from "../models/FindMyTicketVo";
import {TagTicketVo} from "../models/TagTicketVo";
import {CheckTicketVo} from "../models/CheckTicketVo";
import {TicketTakenListSetting} from "../models/QueueVo";
import {QueueUpVo} from "../models/QueueUpVo";

const AUTH_API = `${environment.backendAddress}api/tickets`;

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) {
  }

  generateTickets(data: GenerateTicketsVo): Observable<Result> {
    return this.http.post(`${AUTH_API}/generate-tickets`, data, httpOptions).pipe(map(data => {
      return new Result().deserialize(data);
    }));
  }

  refundTicket(id: string, queueId: string): Observable<Result> {
    return this.http.post(`${AUTH_API}/refund-ticket/${id}/${queueId}`, httpOptions).pipe(map(data => {
      return new Result().deserialize(data);
    }));
  }

  findById(id: string): Observable<TicketVo> {
    return this.http.get(`${AUTH_API}/find-by-id/${id}`).pipe(map(data => {
      return new TicketVo().deserialize(data);
    }));
  }

  findMyTicketList(data: FindMyTicketVo): Observable<TicketVo> {
    return this.http.get(`${AUTH_API}/find-my-tickets/${data.queueId}/${data.date}`).pipe(map(data => {
      return new TicketVo().deserialize(data);
    }));
  }

  findByTicketNos(queueId: string,date: string,ticketNos: number[]): Observable<TicketVo> {
    return this.http.get(`${AUTH_API}/find-by-ticket-nos/${queueId}/${date}/${ticketNos}`).pipe(map(data => {
      console.log(data)
      return new TicketVo().deserialize(data);
    }));
  }

  tagTicket(data: TagTicketVo): Observable<TagTicketVo> {
    return this.http.post(`${AUTH_API}/tag-ticket`, data, httpOptions).pipe(map(data => {
      return new TagTicketVo().deserialize(data);
    }));
  }

  deleteTag(data: TagTicketVo): Observable<TagTicketVo> {
    return this.http.post(`${AUTH_API}/delete-tag`, data, httpOptions).pipe(map(data => {
      return new TagTicketVo().deserialize(data);
    }));
  }

  memberHomeTickets(page: number, size: number): Observable<TicketVo> {
    return this.http.get(`${AUTH_API}/member-home-tickets?page=${page}&size=${size}`).pipe(map(data => {
      return new TicketVo().deserialize(data);
    }));
  }

  dashboardQueueInfoItem(queueId: string, ticketTakenListSetting:TicketTakenListSetting): Observable<TicketVo> {
    return this.http.post(`${AUTH_API}/dashboard-queue-info-item/${queueId}`,ticketTakenListSetting,httpOptions).pipe(map(data => {
      return new TicketVo().deserialize(data);
    }));
  }

  deleteTickets(ticketVo: TicketVo): Observable<Result> {
    return this.http.post(`${AUTH_API}/delete-tickets`, ticketVo, httpOptions).pipe(map(data => {
      return new Result().deserialize(data);
    }));
  }

  checkTicket(ticketId: string): Observable<CheckTicketVo> {
    return this.http.post(`${AUTH_API}/check-ticket/${ticketId}`, httpOptions).pipe(map(data => {
      return new CheckTicketVo().deserialize(data);
    }));
  }

  findUsableTickets(data: TicketVo, page: number, size: number, skip: number): Observable<TicketVo> {
    return this.http.post(`${AUTH_API}/find-usable-tickets?page=${page}&size=${size}&skip=${skip}`, data, httpOptions)
      .pipe(map(data => new TicketVo().deserialize(data)));
  }

  tryPickUpTicket(data: QueueUpVo): Observable<TicketVo> {
    return this.http.post(`${AUTH_API}/try-pickup-ticket`, data, httpOptions)
      .pipe(map(data => new TicketVo().deserialize(data)));
  }

  picketUpResult(queueId: string,requestId: string): Observable<TicketVo> {
    return this.http.get(`${AUTH_API}/picket-up-result/${queueId}/${requestId}`).pipe(map(data => {
      return new TicketVo().deserialize(data);
    }));
  }

  findByTicketDateAndSurveyId(ticketDate: string,surveyId: string): Observable<TicketVo> {
    return this.http.get(`${AUTH_API}/survey-stats/${ticketDate}/${surveyId}`).pipe(map(data => {
      return new TicketVo().deserialize(data);
    }));
  }
}
