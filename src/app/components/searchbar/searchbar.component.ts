import { Component, OnInit } from '@angular/core';
import { PropertyListService } from 'src/app/Service/Property/property-list.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {
  cityData: string = '';
  isActive: boolean = false;
  suggestions: string[] = [
    'Pune', 'Mumbai'
  ];
  filteredSuggestions: string[] = [];
  
  priceRanges: string[] = ['Under $50', '$50-$100', '$100-$200', 'Above $200'];
  sortOptions: string[] = ['Price: Low to High', 'Price: High to Low'];
  ratingSortOptions: string[] = ['Rating: High to Low', 'Rating: Low to High'];
  
  features: string[] = ['Feature 1', 'Feature 2', 'Feature 3'];
  
  selectedPriceRange: string = '';
  selectedSortBy: string = '';
  selectedRatingSortBy: string = '';
  selectedFeatures: string = '';

  constructor(private prop: PropertyListService) { }

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
    
      console.log(this.features);
    })
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

  updatePriceRange(event: any) {
    this.selectedPriceRange = event.target.value;
    console.log('Selected Price Range:', this.selectedPriceRange);
  }

  updateSortBy(event: any) {
    this.selectedSortBy = event.target.value;
    console.log('Selected Sort By (Price):', this.selectedSortBy);
  }

  updateRatingSort(event: any) {
    this.selectedRatingSortBy = event.target.value;
    console.log('Selected Sort By (Rating):', this.selectedRatingSortBy);
  }

  updateFeatures(event: any) {
    this.selectedFeatures = event.target.value;
    console.log('Selected Features:', this.selectedFeatures);
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

    // If cityData is empty, get all properties
    if (query.city === '' && !this.isActive) {
      this.prop.getPropertiesAll().subscribe(data => {
        this.prop.properties = data;
      });
      console.log('No city input. Proceeding with fetching all properties.');
    } else {
      // Call the service with the provided search query
      this.prop.getPropertiesLikeSearch(query.city).subscribe(data => {
        // Apply additional filtering if needed
        this.prop.properties = data;
      });
      console.log('Search Submitted:', query);
    }
  }
}
