import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from './Service/Authenticate/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });

  formSubmit() {
    console.log(this.profileForm);
  }
  constructor(private authService:AuthService,private router: Router){
    this.authService.getDetailsFromToken();
  }
  ngOnInit() {
    this.authService.checkTokenValidity().subscribe(isTokenValid => {
      if (!isTokenValid) {
          this.router.navigateByUrl("/signin");
          console.log(isTokenValid)
      }
  });

    // this.authService.getUserDetails().userId
 
    // this.authService.getUserById(Number(localStorage.getItem('userId'))).subscribe()
 
  }
}
