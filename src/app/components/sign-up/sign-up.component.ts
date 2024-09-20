import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // Import Router
import { User } from '../models/UserCredentials';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  username: FormControl; 
  email: FormControl; 
  password: FormControl;
  signUpForm: FormGroup;
  successFlag: boolean;
  errorFlag: boolean;

  constructor(private authService: AuthService, private router: Router) {  // Inject Router
    this.username = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required]);
    this.password = new FormControl('', [Validators.required]);
    this.successFlag = false;
    this.errorFlag = false;

    this.signUpForm = new FormGroup({
      username: this.username,
      email: this.email,
      password: this.password
    });
  }

  handleSignUp() {
    if (this.signUpForm.valid) {
      const user = new User(this.username.value, this.email.value, this.password.value, "USER");
      console.log(user);
      this.authService.register(user).subscribe(
        response => {
          console.log('User registered successfully', response);
          this.successFlag = true;
          this.errorFlag = false;

          // Redirect to login page after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/signin']);
          }, 1000000); // 3 seconds
        },
        error => {
          console.error('Error registering user', error);
          this.successFlag = false;
          this.errorFlag = true;
        }
      );
    }
  }
}
