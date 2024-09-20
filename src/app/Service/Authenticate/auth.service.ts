import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserCredentials } from 'src/app/components/models/User';
import { UserDetails } from 'src/app/components/models/UserDetails';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userDetails: UserDetails = { userName: '', email: '', role: '', jwt: '', userId: 0 }; // Initialize userDetails
  public successFlag: boolean = false;
  public errorFlag: boolean = false;
  public isLoggedIn: boolean = false;

  // Use BehaviorSubject to track login status
  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatusSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // Method to register a user
  register(user: UserCredentials): Observable<any> {
    return this.http.post<any>("http://localhost:8080/api/users/register", user);
  }

  // Method to log in a user
  loginUser(user: UserCredentials): Observable<any> {
    return this.http.post<any>("http://localhost:8080/api/users/login", user).pipe(
      map(response => {
        if (response && response.token) {
          this.userDetails = {
            userName: response.userName,
            email: response.email,
            role: response.role,
            jwt: response.token,
            userId: response.userId
          };

          this.successFlag = true;
          this.errorFlag = false;
          this.isLoggedIn = true;
          this.loginStatusSubject.next(true);

          const storedUser: any = { ...response, password: user.password };
          localStorage.setItem('currentUser', JSON.stringify(storedUser));

          console.log('User details set:', response); // Debug log

          return response;
        } else {
          this.errorFlag = true;
          this.handleLoginError('Login failed: Invalid response');
        }
      }),
      catchError(error => {
        this.errorFlag = true;
        this.handleLoginError('Login error: ' + error.message);
        throw new Error(error);
      }));
  }

  // Method to handle login errors
  private handleLoginError(message: string): void {
    console.error(message);
    this.successFlag = false;
    this.errorFlag = true;
    this.isLoggedIn = false;

    // Emit login failure
    this.loginStatusSubject.next(false);
  }

  // Expose user details if needed
  getUserDetails(): UserDetails {
    console.log("Get User Details:", this.userDetails); // Debug log
    return this.userDetails;
  }

  getDetailsFromToken() {
    const currentUser: any = localStorage.getItem('currentUser');
    if (currentUser) {
      this.userDetails = JSON.parse(currentUser) as UserDetails;
      console.log("User Details from Token:", this.userDetails); // Debug log
    }
    return this.userDetails;
  }

  checkTokenValidity(): Observable<boolean> {
    const token = localStorage.getItem('jwt');
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      const userId = JSON.parse(currentUser).userId;

      if (token) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any>(`http://localhost:8080/api/users/${userId}`, { headers })
          .pipe(
            map(response => {
              this.userDetails = {
                userName: response.userName,
                email: response.email,
                role: JSON.parse(currentUser).role,
                jwt: token,
                userId: response.userId
              };
              this.isLoggedIn = true;
              console.log('Token is valid', response);
              return true; // Token is valid
            }),
            catchError(error => {
              console.error('Error fetching user:', this.userDetails);
              this.logout(); // Logout if there's an error
              return of(false); // Token is not valid
            })
          );
      } else {
        console.log("Token is not valid");
        this.logout();
        return of(false); // Token is not valid
      }
    } else {
      console.log("Token is not valid");
      this.logout();
      return of(false); // Token is not valid
    }
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.userDetails = { userName: '', email: '', role: '', jwt: '', userId: 0 }; // Reset userDetails
    this.router.navigate(['/signup']);
  }


  updateUserProfile(username: string, password: string): Observable<any> {
    const userId = this.userDetails.userId;
    const updateData = { userName: username, password: password };
  
    return this.http.put<any>(`http://localhost:8080/api/users/${userId}`, updateData);
  }
  
  canActivate(): Promise<boolean> {
    return this.checkTokenValidity().toPromise().then(isValid => {
      if (isValid) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    });
  }
}
