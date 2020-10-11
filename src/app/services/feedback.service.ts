import { Injectable, Inject } from '@angular/core';
import { of, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPmsgService} from "./process-httpmsg.service";
import { HttpHeaders} from '@angular/common/http';
import { map , catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPmsgService,@Inject('BaseURL') private BaseURL) { }
    submitFeedback(feedback:Feedback): Observable<Feedback> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
      return this.http.post<Feedback>(baseURL + 'feedback' , feedback,httpOptions)
        .pipe(catchError(this.processHTTPMsgService.handleError));
    }
}
