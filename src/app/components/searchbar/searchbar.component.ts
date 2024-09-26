import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';
import { PropertyListService } from 'src/app/Service/Property/property-list.service';
import { SearchbarService } from 'src/app/Service/SearchBar/searchbar.service';
import { PropertyDTO } from '../models/Property';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {
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
  properties:any;
  constructor(private prop: PropertyListService,private search: SearchbarService) {
    this.cityData='';
   }

  ngOnInit(): void { 
    this.prop.getFeatuers().subscribe(data => {
      // Assuming data is an array of strings, each potentially containing features separated by commas
      this.features = Array.from(
        new Set(
          data
            .map(item => item.split(',')) // Split each string by commas
            .flat() // Flatten the resulting arrays into a single array
            .map(feature => feature.trim().toUpperCase()) // Trim spaces and convert to lowercase
        )
      );
    this.properties=this.prop.properties;
    this.suggestions=this.prop.cities;
    console.log(this.features);
    console.log("Property in Search",this.prop.properties)
    })
    this.loadProperties()
  }

  onKeyUp(field: string) {
    if (field === 'city') {
      this.filteredSuggestions = this.suggestions.filter(suggestion =>
        suggestion.toLowerCase().startsWith(this.cityData.toLowerCase())
      );
    } 

    this.isActive = this.cityData ? true : false;
  }
  loadProperties() {
    this.prop.getPropertiesAll().subscribe({
      next: (properties: PropertyDTO[]) => {
        this.prop.properties = properties; // Store all properties
        this.prop.cities = Array.from(new Set(this.prop.properties.map(property => property.city)));
        // Fetch average ratings for each property
        properties.forEach(property => {
          this.prop.fetchAverageRating(property.propertyId).subscribe({
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
  selectSuggestion(suggestion: string) {
    this.cityData = suggestion;
    this.isActive = false;
  }

  updatePriceRange(event: Event): void {
    const inputElement = event.target as HTMLSelectElement;
    this.selectedPriceRange = inputElement.value;
    console.log('Selected Price Range:', this.selectedPriceRange); 
    this.clearOtherSelections('priceRange');
    this.prop.properties=this.properties;
    // Now filter the properties based on the selected price range
    this.filterPropertiesByPriceRange();
  }
  
  filterPropertiesByPriceRange(): void {
    const [minPrice, maxPrice] = this.getPriceRange();
  
    this.prop.properties  = this.prop.properties.filter(property => {
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
    this.prop.properties=this.properties;
    this.selectedSortBy = event.target.value;
    this.clearOtherSelections('sortBy');
    console.log('Selected Sort By (Price):', this.selectedSortBy);
    if(this.selectedSortBy==='Price: Low to High')
    {
      this.prop.properties.sort((a, b) => a.rent - b.rent);
      console.log('Sorted numbers (ascending):', this.prop.properties);
    }
    else{
      this.prop.properties.sort((a, b) => b.rent - a.rent);
      console.log('Sorted numbers (descending):', this.prop.properties);
    }
  }

  updateRatingSort(event: any): void {
    this.prop.properties=this.properties;
    this.selectedRatingSortBy = event.target.value;
    this.clearOtherSelections('ratingSort');
    console.log('Selected Sort By (Rating):', this.selectedRatingSortBy);
    
  
    if (this.selectedRatingSortBy === 'Rating: Low to High') {
      // Sort by avgRating, providing a fallback for undefined values
      this.prop.properties.sort((a, b) => {
        const ratingA = a.avgRating || 0; // Fallback to 0 if undefined
        const ratingB = b.avgRating || 0; // Fallback to 0 if undefined
        return ratingA - ratingB; // Ascending order
      });
      console.log('Sorted by rating (ascending):', this.prop.properties);
    } else {
      // Sort by rent in descending order
      this.prop.properties.sort((a, b) => {
        const ratingA = a.avgRating || 0; // Fallback to 0 if undefined
        const ratingB = b.avgRating || 0; 
        return ratingB - ratingA; 
      });
      console.log('Sorted by rating (descending):', this.prop.properties);
    }
  }
  

  
updateFeatures(event: any): void {
  this.selectedFeatures = event.target.value; // Capture the selected feature directly
  console.log('Selected Feature:', this.selectedFeatures);
  this.prop.properties=this.properties;
  this.clearOtherSelections('features');
  // Call the method to filter properties based on selected features
  this.filterPropertiesByFeatures();
}

filterPropertiesByFeatures(): void {
  const selectedFeature = this.selectedFeatures; // Use the selected feature as is (no trimming)

  this.prop.properties = this.prop.properties.filter(property => {
    // Split the property's features string into an array and trim each feature
    const propertyFeatures = property.features.split(',').map(feature => feature.trim().toLowerCase());

    // Check if the selected feature (trimmed for comparison) is included in the property's features (case-insensitive)
    return propertyFeatures.includes(selectedFeature.trim().toLowerCase());
  });

  console.log('Filtered Properties:', this.prop.properties);
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
    // If cityData is empty, get all properties
    if (query.city === '' && !this.isActive) {
      this.prop.getPropertiesAll().subscribe(data => {
        this.prop.properties = data;
        this.properties=data;
      });
      console.log('No city input. Proceeding with fetching all properties.');
    } else {
      // Call the service with the provided search query
      this.prop.getPropertiesLikeSearch(query.city).subscribe(data => {
        // Apply additional filtering if needed
        this.prop.properties = data;
        this.properties=data;
      });
      console.log('Search Submitted:', query);
    }
  }
} 
