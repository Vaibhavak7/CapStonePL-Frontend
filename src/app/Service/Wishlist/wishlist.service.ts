import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(public http: HttpClient) { }
  getWishlistPropertyById(id: number) {
    return this.http.get<any>(`http://localhost:8080/api/properties/bookmarks/user/${id}`);
  }
}
