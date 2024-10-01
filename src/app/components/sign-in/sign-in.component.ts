import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';
import { UserCredentials } from '../models/User';

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
       
        this.email = new FormControl('', [Validators.required, customEmailValidator()]);
    
        
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
      
      
      this.authService.loginUser(userCredentials).subscribe(data=>{
        this.authService.loginStatus$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          
          localStorage.setItem("jwt",this.authService.getUserDetails().jwt);
          this.router.navigate(['/']);  
        } else {
          console.error('Login failed');
        }
      });
      });

      
    }
  }
}
