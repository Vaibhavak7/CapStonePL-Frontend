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
  Category = [
    { id: 1, name: 'Residential' },
    { id: 2, name: 'Commercial' },
    { id: 3, name: 'Industrial' },
    { id: 4, name: 'Land' },
    { id: 5, name: 'Office Space' },
    { id: 6, name: 'Retail' },
    { id: 7, name: 'Warehouse' },
    { id: 8, name: 'Farm' },
    { id: 9, name: 'Mixed Use' },
    { id: 10, name: 'Vacation Rental' }
  ];
  Location = [
    { id: 1, city: 'New York' },
    { id: 2, city: 'Los Angeles' },
    { id: 3, city: 'Chicago' },
    { id: 4, city: 'Houston' },
    { id: 5, city: 'Phoenix' },
    { id: 6, city: 'Philadelphia' },
    { id: 7, city: 'San Antonio' },
    { id: 8, city: 'San Diego' },
    { id: 9, city: 'Dallas' },
    { id: 10, city: 'San Jose' }
  ];

  constructor(
    public propertylist: PropertyListService, 
    public route: ActivatedRoute,
    public router: Router,
    public auth: AuthService,
    private renderer: Renderer2
  ) {}

  // Method to handle search form submission
  searchByName(searchForm: NgForm) {
    const name = searchForm.value.propName;  // Get the property name from the form input
    if (name) {
      this.router.navigateByUrl("/listingsbyname/" + name);  // Navigate to the filtered listings page
    }
  }

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
      next: (data: PropertyDTO[]) => {
        this.propertylist.properties = data;
        console.log('Fetched Properties:', this.propertylist.properties);  // Log the fetched properties
      },
      error: (error) => {
        console.error('Error fetching properties:', error);
      }
    });
  }

  // Method to handle form submission
  sendFormToListings(filterForm: NgForm) {
    if (filterForm.valid) {
      // Log the entire form object to the console
      console.log('Form Data:', filterForm.value);

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
}
