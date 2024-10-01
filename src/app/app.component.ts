import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from './Service/Authenticate/auth.service';
import { Router } from '@angular/router';
import { PropertyListService } from './Service/Property/property-list.service';
import { PropertyDTO } from './components/models/Property';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app'
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });

  formSubmit() {
    console.log(this.profileForm);
  }
  constructor(private authService:AuthService,private router: Router,private propertylist: PropertyListService){
    this.authService.getDetailsFromToken();
  }
  ngOnInit() {
    this.authService.checkTokenValidity().subscribe(isTokenValid => {
      if (!isTokenValid) {
          console.log(isTokenValid)
      }

  });
 
  }
}
