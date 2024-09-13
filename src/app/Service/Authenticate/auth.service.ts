import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserCredentials } from 'src/app/components/models/User';
import { User } from 'src/app/components/models/UserCredentials';

@Injectable({
  providedIn: 'root'
})

  export class AuthService {
    constructor(public http: HttpClient) { }
  
    register(user: User): Observable<any> {
      return this.http.post<any>("http://localhost:8080/api/users/register", user);
    }
  
    loginUser(user: UserCredentials): Observable<any> {
      return this.http.post<any>("http://localhost:8080/api/users/login", user);
    }
  }
