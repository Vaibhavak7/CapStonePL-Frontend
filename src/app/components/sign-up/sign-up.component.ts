import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';  // Import Router
import { User } from '../models/UserCredentials';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';

export function customEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    
    if (!email) {
      return null; 
    }

    const atSymbolIndex = email.indexOf('@');
    const dotSymbolIndex = email.lastIndexOf('.');

    const isValid =
      atSymbolIndex > 0 && 
      dotSymbolIndex > atSymbolIndex + 1 && 
      dotSymbolIndex < email.length - 1; 

    return isValid ? null : { invalidEmail: true }; 
  };
}

export function customPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;

    if (!password) {
      return null; 
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;

    const isValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isValidLength;

    return isValid ? null : { invalidPassword: true }; 
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

  constructor(private authService: AuthService, private router: Router) { 
    this.username = new FormControl('', [Validators.required]);
    
    this.email = new FormControl('', [Validators.required, customEmailValidator()]);
    
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
     
      this.authService.register(user).subscribe(
        response => {
        
          this.successFlag = true;
          this.errorFlag = false;

          setTimeout(() => {
            this.router.navigate(['/signin']);
          }, 3000); 
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
