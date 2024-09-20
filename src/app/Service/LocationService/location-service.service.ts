import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  locations: String[];

  constructor(public http: HttpClient) {
    this.locations = [];
  }

  setLocations() {
    this.http.get<String[]>("http://localhost:8080/cities").subscribe((data: String[]) => { this.locations = data });
  }

}