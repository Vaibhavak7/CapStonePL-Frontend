import { Component, Renderer2 } from '@angular/core';
import { PropertyListService } from 'src/app/Service/Property/property-list.service';
import { PropertyDTO } from '../models/Property';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-propertylisting',
  templateUrl: './propertylisting.component.html',
  styleUrls: ['./propertylisting.component.css']
})
export class PropertylistingComponent {

  propName: string = '';  // Holds the search input value
  stars: string[] = [];   // Holds star rating classes
  properties: PropertyDTO[] = []; // Stores all properties fetched
  paginatedProperties: PropertyDTO[] = []; // Stores properties for the current page
  currentPage: number = 1; // Current page number
  itemsPerPage: number = 6; // Number of items per page

  // Pagination: track the total number of pages
  totalItems: number = 0;

  // Other variables remain unchanged

  constructor(
    public propertylist: PropertyListService, 
    public route: ActivatedRoute,  
    public router: Router,
    public auth: AuthService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.initializeStars();
    this.loadProperties();
  }

  // Initialize the star ratings with the correct classes for 5 stars
  initializeStars() {
    for (let i = 0; i < 5; i++) {
      this.stars[i] = "fa fa-star checked";  // Add star class
    }
  }

  // Method to load properties asynchronously
  loadProperties() {
    this.propertylist.getPropertiesAll().subscribe({
      next: (properties: PropertyDTO[]) => {
        this.propertylist.properties = properties; // Store all properties
        this.totalItems = properties.length; 
        console.log(this.totalItems)// Set total items for pagination
        console.log('Fetched Properties:', this.propertylist.properties);
        this.updatePaginatedProperties(); // Update paginated properties on load
        this.propertylist.cities = Array.from(new Set(this.propertylist.properties.map(property => property.city)));
        // Fetch average ratings for each property
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
  }

  // Update the paginated properties based on the current page
  updatePaginatedProperties() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProperties = this.properties.slice(startIndex, endIndex);
  }

  // Method to handle search form submission
  searchByName(searchForm: NgForm) {
    const name = searchForm.value.propName;  // Get the property name from the form input
    if (name) {
      this.router.navigateByUrl("/listingsbyname/" + name);  // Navigate to the filtered listings page
    }
  }

  // Method to handle form submission
  sendFormToListings(filterForm: NgForm) {
    if (filterForm.valid) {
      // Log the entire form object to the console
      console.log('Form Data:', filterForm.value);
      console.log("In propertyLIsting");

      // Optionally, you can access individual form fields
      const formValues = filterForm.value;
      console.log('Selected List For:', formValues.listFor);
      console.log('Selected City:', formValues.cities);
      console.log('Selected Category:', formValues.categories);
      console.log('Sort By:', formValues.sortBy);

      // Perform any additional actions here, such as making an API call
    } else {
      console.log('Form is not valid');
    }
  }

  getStars(rating?: number): string[] {
    // Use 0 if rating is undefined
    const validRating = rating ?? 0; 
    const fullStars = Math.floor(validRating);
    const halfStars = Math.round(validRating - fullStars);
    const totalStars = 5;

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push('bi bi-star-fill'); // Full star class
    }
    if (halfStars) {
      stars.push('bi bi-star-half'); // Half star class
    }
    for (let i = stars.length; i < totalStars; i++) {
      stars.push('bi bi-star'); // Empty star class
    }

    return stars;
  }
}
