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
    "Delhi",
    "Lucknow",
    "Bengaluru",
    "Girigram",
    "Mumbai",
    "Uttarakhand",
    "Nashik",
    "Nagpur",
    "Kolhapur",
    "Solapur",
    "Ratnagiri",
    "Karjat"
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
    
    this.clearOtherSelections('priceRange');
    this.prop.properties=this.properties;
    // Now filter the properties based on the selected price range
    this.filterPropertiesByPriceRange();
  }
  
  filterPropertiesByPriceRange(): void {
    const [minPrice, maxPrice] = this.getPriceRange();
  
    this.prop.properties  = this.prop.properties.filter(property => {
      const rent = property.rent;
      
      if (maxPrice === undefined) {
        return rent >= minPrice;
      }
      return rent >= minPrice && rent <= maxPrice;
    });
  }
  
  getPriceRange(): [number, number | undefined] {
    let minPrice: number;
    let maxPrice: number | undefined;
  
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
        maxPrice = undefined; 
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
   
    if(this.selectedSortBy==='Price: Low to High')
    {
      this.prop.properties.sort((a, b) => a.rent - b.rent);
     
    }
    else{
      this.prop.properties.sort((a, b) => b.rent - a.rent);
      
    }
  }

  updateRatingSort(event: any): void {
    this.prop.properties=this.properties;
    this.selectedRatingSortBy = event.target.value;
    this.clearOtherSelections('ratingSort');
   
    
  
    if (this.selectedRatingSortBy === 'Rating: Low to High') {
      
      this.prop.properties.sort((a, b) => {
        const ratingA = a.avgRating || 0;
        const ratingB = b.avgRating || 0; 
        return ratingA - ratingB; 
      });
      
    } else {
  
      this.prop.properties.sort((a, b) => {
        const ratingA = a.avgRating || 0;
        const ratingB = b.avgRating || 0; 
        return ratingB - ratingA; 
      });
     
    }
  }
  

  
updateFeatures(event: any): void {
  this.selectedFeatures = event.target.value; 
  
  this.prop.properties=this.properties;
  this.clearOtherSelections('features');
  this.filterPropertiesByFeatures();
}

filterPropertiesByFeatures(): void {
  const selectedFeature = this.selectedFeatures; 

  this.prop.properties = this.prop.properties.filter(property => {
    const propertyFeatures = property.features.split(',').map(feature => feature.trim().toLowerCase());

    
    return propertyFeatures.includes(selectedFeature.trim().toLowerCase());
  });

 
}
clearOtherSelections(caller: string): void {
  switch (caller) {
    case 'priceRange':
      this.selectedSortBy = ''; 
      this.selectedRatingSortBy = '';
      this.selectedFeatures = ''; 
      break;
    case 'sortBy':
      this.selectedPriceRange = ''; 
      this.selectedRatingSortBy = ''; 
      this.selectedFeatures = ''; 
      break;
    case 'ratingSort':
      this.selectedPriceRange = ''; 
      this.selectedSortBy = ''; 
      this.selectedFeatures = ''; 
      break;
    case 'features':
      this.selectedPriceRange = ''; 
      this.selectedSortBy = ''; 
      this.selectedRatingSortBy = '';
      break;
      case 'start':
      this.selectedPriceRange = ''; 
      this.selectedSortBy = '';
      this.selectedRatingSortBy = ''; 
      this.selectedFeatures = '';
      break;
  }
}
  onSubmit() {
    
    let query = {
      city: this.cityData.trim(),
      priceRange: this.selectedPriceRange,
      sortBy: this.selectedSortBy,
      ratingSortBy: this.selectedRatingSortBy,
      features: this.selectedFeatures
    };
    this.clearOtherSelections('start');
   
    if (query.city === '' && !this.isActive) {
      this.prop.getPropertiesAll().subscribe(data => {
        this.prop.properties = data;
        this.properties=data;
      });
      
    } else {
      
      this.prop.getPropertiesLikeSearch(query.city).subscribe(data => {
        
        this.prop.properties = data;
        this.properties=data;
      });
      
    }
  }
} 
