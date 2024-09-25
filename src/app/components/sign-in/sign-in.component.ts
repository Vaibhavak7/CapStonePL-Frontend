import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';
import { UserCredentials } from '../models/User';

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
        // Use custom email validator here
        this.email = new FormControl('', [Validators.required, customEmailValidator()]);
    
        // Use custom password validator
        this.password = new FormControl('', [Validators.required, customPasswordValidator()]);
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
