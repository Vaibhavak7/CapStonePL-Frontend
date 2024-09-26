// import { Component, Renderer2 } from '@angular/core';
// import { PropertyListService } from 'src/app/Service/Property/property-list.service';
// import { PropertyDTO } from '../models/Property';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AuthService } from 'src/app/Service/Authenticate/auth.service';
// import { NgForm } from '@angular/forms';

// @Component({
//   selector: 'app-propertylisting',
//   templateUrl: './propertylisting.component.html',
//   styleUrls: ['./propertylisting.component.css']
// })
// export class PropertylistingComponent {

//   propName: string = '';  // Holds the search input value
//   stars: string[] = [];   // Holds star rating classes
//   properties: PropertyDTO[] = []; // Stores all properties fetched
//   paginatedProperties: PropertyDTO[] = []; // Stores properties for the current page
//   currentPage: number = 1; // Current page number
//   itemsPerPage: number = 6; // Number of items per page

//   // Pagination: track the total number of pages
//   totalItems: number = 0;

//   cityData: string = '';
//   isActive: boolean = false;
//   suggestions: string[] = [
//     'Pune', 'Mumbai','Kolhapur'
//   ];
//   filteredSuggestions: string[] = [];
  
//   priceRanges: string[] = ['Under ₹5000', '₹5001-₹15000', '₹15001-₹30000', 'Above ₹30001'];
//   sortOptions: string[] = ['Price: Low to High', 'Price: High to Low'];
//   ratingSortOptions: string[] = ['Rating: Low to High','Rating: High to Low'];
  
//   features: string[] = ['Feature 1', 'Feature 2', 'Feature 3'];
  
//   selectedPriceRange: string = '';
//   selectedSortBy: string = '';
//   selectedRatingSortBy: string = '';
//   selectedFeatures: string = '';
//   // properties:any;

//   // Other variables remain unchanged

//   constructor(
//     public propertylist: PropertyListService, 
//     public route: ActivatedRoute,  
//     public router: Router,
//     public auth: AuthService,
//     private renderer: Renderer2
//   ) {

//     this.cityData='';
//   }

//   ngOnInit(): void {

//     this.propertylist.getFeatuers().subscribe(data => {
//       // Assuming data is an array of strings, each potentially containing features separated by commas
//       this.features = Array.from(
//         new Set(
//           data
//             .map(item => item.split(',')) // Split each string by commas
//             .flat() // Flatten the resulting arrays into a single array
//             .map(feature => feature.trim().toUpperCase()) // Trim spaces and convert to lowercase
//         )
//       );
//     this.properties=this.propertylist.properties;
//     this.suggestions=this.propertylist.cities;
//     console.log(this.features);
//     console.log("Property in Search",this.propertylist.properties)
//     })
//     this.initializeStars();
//     this.loadProperties();
//   }

//   // Initialize the star ratings with the correct classes for 5 stars
//   initializeStars() {
//     for (let i = 0; i < 5; i++) {
//       this.stars[i] = "fa fa-star checked";  // Add star class
//     }
//   }

//     // Method to load properties asynchronously
//     loadProperties() {
//       this.propertylist.getPropertiesAll().subscribe({
//         next: (properties: PropertyDTO[]) => {
//           this.propertylist.properties = properties; // Store all properties
//           this.properties=properties
//           this.totalItems = properties.length; 
//           console.log(this.totalItems)// Set total items for pagination
//           console.log('Fetched Properties:', this.propertylist.properties);
//           this.updatePaginatedProperties(); // Update paginated properties on load
//           this.propertylist.cities = Array.from(new Set(this.propertylist.properties.map(property => property.city)));
//           this.suggestions=this.propertylist.cities
//           // Fetch average ratings for each property
//           properties.forEach(property => {
//             this.propertylist.fetchAverageRating(property.propertyId).subscribe({
//               next: (avgRating: number) => {
//                 property.avgRating = avgRating; // Assign the average rating
//               },
//               error: (error) => {
//                 console.error(`Error fetching average rating for property ID ${property.propertyId}:`, error);
//               }
//             });
//           });
//         },
//         error: (error) => {
//           console.error('Error fetching properties:', error);
//         }
//       });
//     } 


//   onKeyUp(field: string) {
//     if (field === 'city') {
//       this.filteredSuggestions = this.suggestions.filter(suggestion =>
//         suggestion.toLowerCase().startsWith(this.cityData.toLowerCase())
//       );
//     } 

//     this.isActive = this.cityData ? true : false;
//   }
//   selectSuggestion(suggestion: string) {
//     this.cityData = suggestion;
//     this.isActive = false;
//   }

//   updatePriceRange(event: Event): void {
//     const inputElement = event.target as HTMLSelectElement;
//     this.selectedPriceRange = inputElement.value;
//     console.log('Selected Price Range:', this.selectedPriceRange); 
//     this.clearOtherSelections('priceRange');
//     this.currentPage=1;
//     this.propertylist.properties=this.properties;
//     // Now filter the properties based on the selected price range
//     this.filterPropertiesByPriceRange();
//   }
  
//   filterPropertiesByPriceRange(): void {
//     const [minPrice, maxPrice] = this.getPriceRange();
  
//     this.propertylist.properties  = this.propertylist.properties.filter(property => {
//       const rent = property.rent;
//       // Handle the case where maxPrice is undefined (for "Above ₹30001" range)
//       if (maxPrice === undefined) {
//         return rent >= minPrice;
//       }
//       return rent >= minPrice && rent <= maxPrice;
//     });
//   }
  
//   getPriceRange(): [number, number | undefined] {
//     let minPrice: number;
//     let maxPrice: number | undefined;
  
//     // Parse the selected price range
//     switch (this.selectedPriceRange) {
//       case 'Under ₹5000':
//         minPrice = 0;
//         maxPrice = 5000;
//         break;
//       case '₹5001-₹15000':
//         minPrice = 5001;
//         maxPrice = 15000;
//         break;
//       case '₹15001-₹30000':
//         minPrice = 15001;
//         maxPrice = 30000;
//         break;
//       case 'Above ₹30001':
//         minPrice = 30001;
//         maxPrice = undefined; // No upper limit
//         break;
//       default:
//         minPrice = 0;
//         maxPrice = undefined;
//         break;
//     }
  
//     return [minPrice, maxPrice];
//   }


//   updateSortBy(event: any) {
//     this.propertylist.properties=this.properties;
//     this.selectedSortBy = event.target.value;
//     this.clearOtherSelections('sortBy');
//     this.currentPage=1;
//     console.log('Selected Sort By (Price):', this.selectedSortBy);
//     if(this.selectedSortBy==='Price: Low to High')
//     {
//       this.propertylist.properties.sort((a, b) => a.rent - b.rent);
//       console.log('Sorted numbers (ascending):', this.propertylist.properties);
//     }
//     else{
//       this.propertylist.properties.sort((a, b) => b.rent - a.rent);
//       console.log('Sorted numbers (descending):', this.propertylist.properties);
//     }
//   }

//   updateRatingSort(event: any): void {
//     this.propertylist.properties=this.properties;
//     this.selectedRatingSortBy = event.target.value;
//     this.clearOtherSelections('ratingSort');
//     console.log('Selected Sort By (Rating):', this.selectedRatingSortBy);
    
  
//     if (this.selectedRatingSortBy === 'Rating: Low to High') {
//       // Sort by avgRating, providing a fallback for undefined values
//       this.propertylist.properties.sort((a, b) => {
//         const ratingA = a.avgRating || 0; // Fallback to 0 if undefined
//         const ratingB = b.avgRating || 0; // Fallback to 0 if undefined
//         return ratingA - ratingB; // Ascending order
//       });
//       console.log('Sorted by rating (ascending):', this.propertylist.properties);
//     } else {
//       // Sort by rent in descending order
//       this.propertylist.properties.sort((a, b) => {
//         const ratingA = a.avgRating || 0; // Fallback to 0 if undefined
//         const ratingB = b.avgRating || 0; 
//         return ratingB - ratingA; 
//       });
//       console.log('Sorted by rating (descending):', this.propertylist.properties);
//     }
//   }
  

  
// updateFeatures(event: any): void {
//   this.selectedFeatures = event.target.value; // Capture the selected feature directly
//   console.log('Selected Feature:', this.selectedFeatures);
//   this.propertylist.properties=this.properties;
//   this.clearOtherSelections('features');
//   this.currentPage=1;
//   // Call the method to filter properties based on selected features
//   this.filterPropertiesByFeatures();
// }

// filterPropertiesByFeatures(): void {
//   const selectedFeature = this.selectedFeatures; // Use the selected feature as is (no trimming)

//   this.propertylist.properties = this.propertylist.properties.filter(property => {
//     // Split the property's features string into an array and trim each feature
//     const propertyFeatures = property.features.split(',').map(feature => feature.trim().toLowerCase());

//     // Check if the selected feature (trimmed for comparison) is included in the property's features (case-insensitive)
//     return propertyFeatures.includes(selectedFeature.trim().toLowerCase());
//   });

//   console.log('Filtered Properties:', this.propertylist.properties);
// }
// clearOtherSelections(caller: string): void {
//   switch (caller) {
//     case 'priceRange':
//       this.selectedSortBy = ''; // Clear sort by price
//       this.selectedRatingSortBy = ''; // Clear sort by rating
//       this.selectedFeatures = ''; // Clear selected features
//       break;
//     case 'sortBy':
//       this.selectedPriceRange = ''; // Clear price range
//       this.selectedRatingSortBy = ''; // Clear sort by rating
//       this.selectedFeatures = ''; // Clear selected features
//       break;
//     case 'ratingSort':
//       this.selectedPriceRange = ''; // Clear price range
//       this.selectedSortBy = ''; // Clear sort by price
//       this.selectedFeatures = ''; // Clear selected features
//       break;
//     case 'features':
//       this.selectedPriceRange = ''; // Clear price range
//       this.selectedSortBy = ''; // Clear sort by price
//       this.selectedRatingSortBy = ''; // Clear sort by rating
//       break;
//       case 'start':
//       this.selectedPriceRange = ''; // Clear price range
//       this.selectedSortBy = ''; // Clear sort by price
//       this.selectedRatingSortBy = ''; // Clear sort by rating
//       this.selectedFeatures = '';
//       break;
//   }
// }
//   onSubmit() {
//     // Build the search query based on selected filters
//     let query = {
//       city: this.cityData.trim(),
//       priceRange: this.selectedPriceRange,
//       sortBy: this.selectedSortBy,
//       ratingSortBy: this.selectedRatingSortBy,
//       features: this.selectedFeatures
//     };
//     this.clearOtherSelections('start');
//     this.currentPage=1;
//     // If cityData is empty, get all properties
//     if (query.city === '' && !this.isActive) {
//       this.propertylist.getPropertiesAll().subscribe(data => {
//         this.propertylist.properties = data;
//         this.properties=data;
//       });
//       console.log('No city input. Proceeding with fetching all properties.');
//     } else {
//       // Call the service with the provided search query
//       this.propertylist.getPropertiesLikeSearch(query.city).subscribe(data => {
//         // Apply additional filtering if needed
//         this.propertylist.properties = data;
//         this.properties=data;
//       });
//       console.log('Search Submitted:', query);
//     }
//   }
 


//   // Update the paginated properties based on the current page
//   updatePaginatedProperties() {
//     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//     const endIndex = startIndex + this.itemsPerPage;
//     this.paginatedProperties = this.properties.slice(startIndex, endIndex);
//   }

//   // Method to handle search form submission
//   searchByName(searchForm: NgForm) {
//     const name = searchForm.value.propName;  // Get the property name from the form input
//     if (name) {
//       this.router.navigateByUrl("/listingsbyname/" + name);  // Navigate to the filtered listings page
//     }
//   }

//   // Method to handle form submission
//   sendFormToListings(filterForm: NgForm) {
//     if (filterForm.valid) {
//       // Log the entire form object to the console
//       console.log('Form Data:', filterForm.value);
//       console.log("In propertyLIsting");

//       // Optionally, you can access individual form fields
//       const formValues = filterForm.value;
//       console.log('Selected List For:', formValues.listFor);
//       console.log('Selected City:', formValues.cities);
//       console.log('Selected Category:', formValues.categories);
//       console.log('Sort By:', formValues.sortBy);

//       // Perform any additional actions here, such as making an API call
//     } else {
//       console.log('Form is not valid');
//     }
//   }

//   getStars(rating?: number): string[] {
//     // Use 0 if rating is undefined
//     const validRating = rating ?? 0; 
//     const fullStars = Math.floor(validRating);
//     const halfStars = Math.round(validRating - fullStars);
//     const totalStars = 5;

//     const stars = [];
//     for (let i = 0; i < fullStars; i++) {
//       stars.push('bi bi-star-fill'); // Full star class
//     }
//     if (halfStars) {
//       stars.push('bi bi-star-half'); // Half star class
//     }
//     for (let i = stars.length; i < totalStars; i++) {
//       stars.push('bi bi-star'); // Empty star class
//     }

//     return stars;
//   }
// }


// ------------CHANGSE-----------------
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

  cityData: string = '';
  isActive: boolean = false;
  suggestions: string[] = [
    'Pune', 'Mumbai','Kolhapur'
  ];
  filteredSuggestions: string[] = [];
  
  priceRanges: string[] = ['Under ₹5000', '₹5001-₹15000', '₹15001-₹30000', 'Above ₹30001'];
  sortOptions: string[] = ['Price: Low to High', 'Price: High to Low'];
  ratingSortOptions: string[] = ['Rating: Low to High','Rating: High to Low'];
  
  features: string[] = ['Feature 1', 'Feature 2', 'Feature 3'];
  
  selectedPriceRange: string = '';
  selectedSortBy: string = '';
  selectedRatingSortBy: string = '';
  selectedFeatures: string = '';
  // properties:any;

  // Other variables remain unchanged

  constructor(
    public propertylist: PropertyListService, 
    public route: ActivatedRoute,  
    public router: Router,
    public auth: AuthService,
    private renderer: Renderer2
  ) {

    this.cityData='';
  }

  ngOnInit(): void {

    this.propertylist.getFeatuers().subscribe(data => {
      // Assuming data is an array of strings, each potentially containing features separated by commas
      this.features = Array.from(
        new Set(
          data
            .map(item => item.split(',')) // Split each string by commas
            .flat() // Flatten the resulting arrays into a single array
            .map(feature => feature.trim().toUpperCase()) // Trim spaces and convert to lowercase
        )
      );
    this.properties=this.propertylist.properties;
    this.suggestions=this.propertylist.cities;
    console.log(this.features);
    console.log("Property in Search",this.propertylist.properties)
    })
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
          this.properties=properties
          this.totalItems = properties.length; 
          console.log(this.totalItems)// Set total items for pagination
          console.log('Fetched Properties:', this.propertylist.properties);
          this.updatePaginatedProperties(); // Update paginated properties on load
          this.propertylist.cities = Array.from(new Set(this.propertylist.properties.map(property => property.city)));
          this.suggestions=this.propertylist.cities
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


  onKeyUp(field: string) {
    if (field === 'city') {
      this.filteredSuggestions = this.suggestions.filter(suggestion =>
        suggestion.toLowerCase().startsWith(this.cityData.toLowerCase())
      );
    } 

    this.isActive = this.cityData ? true : false;
  }
  selectSuggestion(suggestion: string) {
    this.cityData = suggestion;
    this.isActive = false;
  }

  NupdatePriceRange(event: any) {
    this.selectedPriceRange = event.target.value;
    console.log('Selected Price Range:', this.selectedPriceRange);
    this.update();
  }

  NupdateSortBy(event: any) {
    this.selectedSortBy = event.target.value;
    console.log('Selected Sort By (Price):', this.selectedSortBy);
    if(this.selectedSortBy.length!=0)
    {
      this.selectedRatingSortBy='';
    }
    this.update();
  }

  NupdateRatingSort(event: any) {
    this.selectedRatingSortBy = event.target.value;
    console.log('Selected Sort By (Rating):', this.selectedRatingSortBy);
    if(this.selectedRatingSortBy.length!=0)
      {
        this.selectedSortBy='';
      }
    this.update();
  }

  NupdateFeatures(event: any) {
    this.selectedFeatures = event.target.value;
    console.log('Selected Features:', this.selectedFeatures);
    this.update();
  }

  update():void{
    this.propertylist.properties=this.properties;
    this.currentPage=1;
    if(this.selectedSortBy.length!=0)
    {
      if(this.selectedSortBy==='Price: Low to High')
        {
          this.propertylist.properties.sort((a, b) => a.rent - b.rent);
          console.log('Sorted numbers (ascending):', this.propertylist.properties);
        }
        else{
          this.propertylist.properties.sort((a, b) => b.rent - a.rent);
          console.log('Sorted numbers (descending):', this.propertylist.properties);
        }
    }
    if(this.selectedRatingSortBy.length!=0)
    {
      if (this.selectedRatingSortBy === 'Rating: Low to High') {
        // Sort by avgRating, providing a fallback for undefined values
        this.propertylist.properties.sort((a, b) => {
          const ratingA = a.avgRating || 0; // Fallback to 0 if undefined
          const ratingB = b.avgRating || 0; // Fallback to 0 if undefined
          return ratingA - ratingB; // Ascending order
        });
        console.log('Sorted by rating (ascending):', this.propertylist.properties);
      } else {
        // Sort by rent in descending order
        this.propertylist.properties.sort((a, b) => {
          const ratingA = a.avgRating || 0; // Fallback to 0 if undefined
          const ratingB = b.avgRating || 0; 
          return ratingB - ratingA; 
        });
        console.log('Sorted by rating (descending):', this.propertylist.properties);
      }
    }
    if(this.selectedPriceRange.length!=0)
    {
      this.filterPropertiesByPriceRange();
    }
    if(this.selectedFeatures.length!=0)
    {
      this.filterPropertiesByFeatures();
    }
    console.log("AFTER ALL",this.propertylist.properties)
  }

  updatePriceRange(event: Event): void {
    const inputElement = event.target as HTMLSelectElement;
    this.selectedPriceRange = inputElement.value;
    console.log('Selected Price Range:', this.selectedPriceRange.length); 
    this.clearOtherSelections('priceRange');
    this.currentPage=1;
    this.propertylist.properties=this.properties;
    // Now filter the properties based on the selected price range
    this.filterPropertiesByPriceRange();
  }
  
  filterPropertiesByPriceRange(): void {
    const [minPrice, maxPrice] = this.getPriceRange();
  
    this.propertylist.properties  = this.propertylist.properties.filter(property => {
      const rent = property.rent;
      // Handle the case where maxPrice is undefined (for "Above ₹30001" range)
      if (maxPrice === undefined) {
        return rent >= minPrice;
      }
      return rent >= minPrice && rent <= maxPrice;
    });
  }
  
  getPriceRange(): [number, number | undefined] {
    let minPrice: number;
    let maxPrice: number | undefined;
  
    // Parse the selected price range
    switch (this.selectedPriceRange) {
      case 'Under ₹5000':
        minPrice = 0;
        maxPrice = 5000;
        break;
      case '₹5001-₹15000':
        minPrice = 5001;
        maxPrice = 15000;
        break;
      case '₹15001-₹30000':
        minPrice = 15001;
        maxPrice = 30000;
        break;
      case 'Above ₹30001':
        minPrice = 30001;
        maxPrice = undefined; // No upper limit
        break;
      default:
        minPrice = 0;
        maxPrice = undefined;
        break;
    }
  
    return [minPrice, maxPrice];
  }


  updateSortBy(event: any) {
    this.propertylist.properties=this.properties;
    this.selectedSortBy = event.target.value;
    this.clearOtherSelections('sortBy');
    this.currentPage=1;
    console.log('Selected Sort By (Price):', this.selectedSortBy);
    if(this.selectedSortBy==='Price: Low to High')
    {
      this.propertylist.properties.sort((a, b) => a.rent - b.rent);
      console.log('Sorted numbers (ascending):', this.propertylist.properties);
    }
    else{
      this.propertylist.properties.sort((a, b) => b.rent - a.rent);
      console.log('Sorted numbers (descending):', this.propertylist.properties);
    }
  }

  updateRatingSort(event: any): void {
    this.propertylist.properties=this.properties;
    this.selectedRatingSortBy = event.target.value;
    this.clearOtherSelections('ratingSort');
    console.log('Selected Sort By (Rating):', this.selectedRatingSortBy);
    
  
    if (this.selectedRatingSortBy === 'Rating: Low to High') {
      // Sort by avgRating, providing a fallback for undefined values
      this.propertylist.properties.sort((a, b) => {
        const ratingA = a.avgRating || 0; // Fallback to 0 if undefined
        const ratingB = b.avgRating || 0; // Fallback to 0 if undefined
        return ratingA - ratingB; // Ascending order
      });
      console.log('Sorted by rating (ascending):', this.propertylist.properties);
    } else {
      // Sort by rent in descending order
      this.propertylist.properties.sort((a, b) => {
        const ratingA = a.avgRating || 0; // Fallback to 0 if undefined
        const ratingB = b.avgRating || 0; 
        return ratingB - ratingA; 
      });
      console.log('Sorted by rating (descending):', this.propertylist.properties);
    }
  }
  

  
updateFeatures(event: any): void {
  this.selectedFeatures = event.target.value; // Capture the selected feature directly
  console.log('Selected Feature:', this.selectedFeatures);
  this.propertylist.properties=this.properties;
  this.clearOtherSelections('features');
  this.currentPage=1;
  // Call the method to filter properties based on selected features
  this.filterPropertiesByFeatures();
}

filterPropertiesByFeatures(): void {
  const selectedFeature = this.selectedFeatures; // Use the selected feature as is (no trimming)

  this.propertylist.properties = this.propertylist.properties.filter(property => {
    // Split the property's features string into an array and trim each feature
    const propertyFeatures = property.features.split(',').map(feature => feature.trim().toLowerCase());

    // Check if the selected feature (trimmed for comparison) is included in the property's features (case-insensitive)
    return propertyFeatures.includes(selectedFeature.trim().toLowerCase());
  });

  console.log('Filtered Properties:', this.propertylist.properties);
}
clearOtherSelections(caller: string): void {
  switch (caller) {
    case 'priceRange':
      this.selectedSortBy = ''; // Clear sort by price
      this.selectedRatingSortBy = ''; // Clear sort by rating
      this.selectedFeatures = ''; // Clear selected features
      break;
    case 'sortBy':
      this.selectedPriceRange = ''; // Clear price range
      this.selectedRatingSortBy = ''; // Clear sort by rating
      this.selectedFeatures = ''; // Clear selected features
      break;
    case 'ratingSort':
      this.selectedPriceRange = ''; // Clear price range
      this.selectedSortBy = ''; // Clear sort by price
      this.selectedFeatures = ''; // Clear selected features
      break;
    case 'features':
      this.selectedPriceRange = ''; // Clear price range
      this.selectedSortBy = ''; // Clear sort by price
      this.selectedRatingSortBy = ''; // Clear sort by rating
      break;
      case 'start':
      this.selectedPriceRange = ''; // Clear price range
      this.selectedSortBy = ''; // Clear sort by price
      this.selectedRatingSortBy = ''; // Clear sort by rating
      this.selectedFeatures = '';
      break;
  }
}
  onSubmit() {
    // Build the search query based on selected filters
    let query = {
      city: this.cityData.trim(),
      priceRange: this.selectedPriceRange,
      sortBy: this.selectedSortBy,
      ratingSortBy: this.selectedRatingSortBy,
      features: this.selectedFeatures
    };
    this.clearOtherSelections('start');
    this.currentPage=1;
    // If cityData is empty, get all properties
    if (query.city === '' && !this.isActive) {
      this.propertylist.getPropertiesAll().subscribe(data => {
        this.propertylist.properties = data;
        this.properties=data;
      });
      console.log('No city input. Proceeding with fetching all properties.');
    } else {
      // Call the service with the provided search query
      this.propertylist.getPropertiesLikeSearch(query.city).subscribe(data => {
        // Apply additional filtering if needed
        this.propertylist.properties = data;
        this.properties=data;
      });
      console.log('Search Submitted:', query);
    }
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
