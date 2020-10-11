import { Injectable } from '@angular/core';
import {Promotion} from '../shared/promotion';
import {PROMOTIONS} from '../shared/promotions';
import { resolve } from 'url';
import { of,Observable} from 'rxjs';
import { delay} from 'rxjs/operators';
import { LEADERS } from '../shared/leaders';
import { ProcessHTTPmsgService} from "./process-httpmsg.service";
import { HttpHeaders} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map , catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPmsgService) { }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(baseURL + 'promotions')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getPromotion(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promotions/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion[]>(baseURL + 'promotions?featured=true').pipe(map(Promotions => Promotions[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getPromotionIds(): Observable<number[] | any> {
    return this.getPromotions().pipe(map(Promotions => Promotions.map(promotion => promotion.id)))
      .pipe(catchError(error => error));
  }
  putPromotion(promotion: Promotion): Observable<Promotion> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Promotion>(baseURL + 'promotions/' + promotion.id, promotion, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
