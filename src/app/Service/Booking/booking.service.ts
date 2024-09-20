import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../Authenticate/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(public http: HttpClient) { }
  getBookingWithPropertyById(id: number) {
   
    return this.http.get<any>(`http://localhost:8080/api/properties/booking/user/${id}`);
  }
}
