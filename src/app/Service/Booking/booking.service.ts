import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../Authenticate/auth.service';
import { BookingDate } from 'src/app/components/models/BookingDate';
import { Observable } from 'rxjs';
import { FeedbackDTO } from 'src/app/components/models/FeedbackDTO';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  buildHeader() {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private apiUrl = 'http://localhost:8080/api/property/booking/create';
  constructor(public http: HttpClient) { }
  getBookingWithPropertyById(id: number) {
    const header = this.buildHeader();
    return this.http.get<any>(`http://localhost:8080/api/property/booking/user/${id}`,{headers:header});
  }

  createReservation(bookingData: BookingDate): Observable<HttpResponse<any>> {
    const header = this.buildHeader();

    return this.http.post<any>(this.apiUrl, bookingData, {
      headers:header,
      observe: 'response',
      responseType: 'json' 
    });
  }

  submitFeedback(feedbackData: FeedbackDTO): Observable<any> {
    return this.http.post<any>("HTTP://localhost:8080/feedbacks/create", feedbackData, {
      observe: 'response', 
      responseType: 'json'
    });

  }
}
