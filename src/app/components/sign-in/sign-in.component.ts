import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';
import { UserCredentials } from '../models/User';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  email: FormControl;
  password: FormControl;
  signInForm: FormGroup;
  success:boolean
  error:boolean;
  

  constructor(public authService: AuthService, private router: Router) {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required]);
    this.success=false;
    this.error=false;
    this.signInForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  handleLogin() {
    if (this.signInForm.valid) {
      const userCredentials = new UserCredentials(this.email.value, this.password.value);
      
      // Call the login method
      this.authService.loginUser(userCredentials).subscribe(data=>{
        this.authService.loginStatus$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          console.log('User logged in successfully');
          localStorage.setItem("jwt",this.authService.getUserDetails().jwt);
          this.router.navigate(['/']);  // Redirect after successful login
        } else {
          console.error('Login failed');
        }
      });
      });

      // Subscribe to the login status observable
      
    }
  }
}
