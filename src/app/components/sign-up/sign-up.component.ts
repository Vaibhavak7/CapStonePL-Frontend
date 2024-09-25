import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';  // Import Router
import { User } from '../models/UserCredentials';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';

// Custom email validator
export function customEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    
    if (!email) {
      return null; // No validation error
    }

    const atSymbolIndex = email.indexOf('@');
    const dotSymbolIndex = email.lastIndexOf('.');

    const isValid =
      atSymbolIndex > 0 && // @ is not the first character
      dotSymbolIndex > atSymbolIndex + 1 && // . is after @ and not right after
      dotSymbolIndex < email.length - 1; // . is not the last character

    return isValid ? null : { invalidEmail: true }; // Return error if invalid
  };
}

// Custom password validator
export function customPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;

    if (!password) {
      return null; // No validation error
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;

    const isValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isValidLength;

    return isValid ? null : { invalidPassword: true }; // Return error if invalid
  };
}

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
    
    // Use custom email validator here
    this.email = new FormControl('', [Validators.required, customEmailValidator()]);
    
    // Use custom password validator
    this.password = new FormControl('', [Validators.required, customPasswordValidator()]);
    
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
          }, 3000); // 3 seconds
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
