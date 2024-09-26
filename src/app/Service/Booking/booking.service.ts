import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../Authenticate/auth.service';
import { BookingDate } from 'src/app/components/models/BookingDate';
import { Observable } from 'rxjs';
import { FeedbackDTO } from 'src/app/components/models/FeedbackDTO';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = 'http://localhost:8080/api/properties/booking/create';
  constructor(public http: HttpClient) { }
  getBookingWithPropertyById(id: number) {
   
    return this.http.get<any>(`http://localhost:8080/api/properties/booking/user/${id}`);
  }

 createReservation(bookingData: BookingDate): Observable<HttpResponse<any>> {
  
  return this.http.post<any>(this.apiUrl, bookingData, {
    observe: 'response',
    responseType: 'json' // Or use 'text' if the response isn't JSON
  });
}

submitFeedback(feedbackData: FeedbackDTO): Observable<any> {
  return this.http.post<any>("HTTP://localhost:8080/feedbacks/create", feedbackData, {
    observe: 'response', // to get the full HTTP response
    responseType: 'json'
  });

}
}
