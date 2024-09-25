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
          // this.router.navigateByUrl("/signin");
          console.log(isTokenValid)
      }

      this.propertylist.getPropertiesAll().subscribe({
        next: (properties: PropertyDTO[]) => {
          this.propertylist.properties = properties; 
          this.propertylist.cities = Array.from(new Set(this.propertylist.properties.map(property => property.city)));
          properties.forEach(property => {
            this.propertylist.fetchAverageRating(property.propertyId).subscribe({
              next: (avgRating: number) => {
                property.avgRating = avgRating; // Assign the average rating
              },
              error: (error) => {
                console.error(`Error fetching average rating for property ID ${property.propertyId}:`, error);
              }
            });
          });
        },
        error: (error) => {
          console.error('Error fetching properties:', error);
        }
      });
  });

    // this.authService.getUserDetails().userId
 
    // this.authService.getUserById(Number(localStorage.getItem('userId'))).subscribe()
 
  }
}
