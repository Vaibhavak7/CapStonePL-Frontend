import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(public http: HttpClient) { }
  getWishlistPropertyById(id: number) {
    return this.http.get<any>(`http://localhost:8080/api/properties/bookmarks/user/${id}`);
  }

  deleteBookmark(userId: number, propertyId: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`http://localhost:8080/api/properties/bookmarks/delete?userId=${userId}&propertyId=${propertyId}`, { observe: 'response' });
}
}
