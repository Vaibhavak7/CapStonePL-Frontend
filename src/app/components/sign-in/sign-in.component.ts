import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // Import Router
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

  successFlag: boolean;
  errorFlag: boolean;

  constructor(private authService: AuthService, private router: Router) {  // Inject Router
    this.email = new FormControl('', [Validators.required]);
    this.password = new FormControl('', [Validators.required]);
    this.successFlag = false;
    this.errorFlag = false;

    this.signInForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  handleLogin() {
    if (this.signInForm.valid) {
      const userCredentials = new UserCredentials(this.email.value, this.password.value);
      this.authService.loginUser(userCredentials).subscribe(
        response => {
          console.log('User logged in successfully', response);
          this.successFlag = true;
          this.errorFlag = false;

          // Navigate to home page after successful login
          this.router.navigate(['/']);
        },
        error => {
          console.error('Error logging in user', error);
          this.successFlag = false;
          this.errorFlag = true;
        }
      );
    }
  }
}
