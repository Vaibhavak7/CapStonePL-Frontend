
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

  propName: string = '';  
  stars: string[] = [];  
  properties: PropertyDTO[] = []; 
  paginatedProperties: PropertyDTO[] = []; 
  currentPage: number = 1;
  itemsPerPage: number = 6; 
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
      this.features = Array.from(
        new Set(
          data
            .map(item => item.split(',')) 
            .flat() 
            .map(feature => feature.trim().toUpperCase()) 
        )
      );
    this.properties=this.propertylist.properties;
    this.suggestions=this.propertylist.cities;
   
    })
    this.initializeStars();
    this.loadProperties();
  }

  initializeStars() {
    for (let i = 0; i < 5; i++) {
      this.stars[i] = "fa fa-star checked";  
    }
  }
    loadProperties() {
      this.propertylist.getPropertiesAll().subscribe({
        next: (properties: PropertyDTO[]) => {
          this.propertylist.properties = properties;
          this.properties=properties
          this.totalItems = properties.length; 
         
          this.updatePaginatedProperties(); 
          this.propertylist.cities = Array.from(new Set(this.propertylist.properties.map(property => property.city)));
          this.suggestions=this.propertylist.cities
          properties.forEach(property => {
            this.propertylist.fetchAverageRating(property.propertyId).subscribe({
              next: (avgRating: number) => {
                property.avgRating = avgRating; 
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
    
    this.update();
  }

  NupdateSortBy(event: any) {
    this.selectedSortBy = event.target.value;
    
    if(this.selectedSortBy.length!=0)
    {
      this.selectedRatingSortBy='';
    }
    this.update();
  }

  NupdateRatingSort(event: any) {
    this.selectedRatingSortBy = event.target.value;
    
    if(this.selectedRatingSortBy.length!=0)
      {
        this.selectedSortBy='';
      }
    this.update();
  }

  NupdateFeatures(event: any) {
    this.selectedFeatures = event.target.value;
    
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
         
        }
        else{
          this.propertylist.properties.sort((a, b) => b.rent - a.rent);
         
        }
    }
    if(this.selectedRatingSortBy.length!=0)
    {
      if (this.selectedRatingSortBy === 'Rating: Low to High') {
       
        this.propertylist.properties.sort((a, b) => {
          const ratingA = a.avgRating || 0; 
          const ratingB = b.avgRating || 0; 
          return ratingA - ratingB; 
        });
        
      } else {
        
        this.propertylist.properties.sort((a, b) => {
          const ratingA = a.avgRating || 0; 
          const ratingB = b.avgRating || 0; 
          return ratingB - ratingA; 
        });
        
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
  }

  updatePriceRange(event: Event): void {
    const inputElement = event.target as HTMLSelectElement;
    this.selectedPriceRange = inputElement.value;
    
    this.clearOtherSelections('priceRange');
    this.currentPage=1;
    this.propertylist.properties=this.properties;
    this.filterPropertiesByPriceRange();
  }
  
  filterPropertiesByPriceRange(): void {
    const [minPrice, maxPrice] = this.getPriceRange();
  
    this.propertylist.properties  = this.propertylist.properties.filter(property => {
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
    this.propertylist.properties=this.properties;
    this.selectedSortBy = event.target.value;
    this.clearOtherSelections('sortBy');
    this.currentPage=1;
    
    if(this.selectedSortBy==='Price: Low to High')
    {
      this.propertylist.properties.sort((a, b) => a.rent - b.rent);
      
    }
    else{
      this.propertylist.properties.sort((a, b) => b.rent - a.rent);
      
    }
  }

  updateRatingSort(event: any): void {
    this.propertylist.properties=this.properties;
    this.selectedRatingSortBy = event.target.value;
    this.clearOtherSelections('ratingSort');
    
    
  
    if (this.selectedRatingSortBy === 'Rating: Low to High') {
     
      this.propertylist.properties.sort((a, b) => {
        const ratingA = a.avgRating || 0; 
        const ratingB = b.avgRating || 0; 
        return ratingA - ratingB; 
      });
     
    } else {
      this.propertylist.properties.sort((a, b) => {
        const ratingA = a.avgRating || 0; 
        const ratingB = b.avgRating || 0; 
        return ratingB - ratingA; 
      });
      
    }
  }
  

  
updateFeatures(event: any): void {
  this.selectedFeatures = event.target.value; 
  
  this.propertylist.properties=this.properties;
  this.clearOtherSelections('features');
  this.currentPage=1;
  this.filterPropertiesByFeatures();
}

filterPropertiesByFeatures(): void {
  const selectedFeature = this.selectedFeatures;

  this.propertylist.properties = this.propertylist.properties.filter(property => {
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
    this.currentPage=1;
    
    if (query.city === '' && !this.isActive) {
      this.propertylist.getPropertiesAll().subscribe(data => {
        this.propertylist.properties = data;
        this.properties=data;
      });
      
    } else {
      
      this.propertylist.getPropertiesLikeSearch(query.city).subscribe(data => {
       
        this.propertylist.properties = data;
        this.properties=data;
      });
     
    }
  }
 
  updatePaginatedProperties() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProperties = this.properties.slice(startIndex, endIndex);
  }

  searchByName(searchForm: NgForm) {
    const name = searchForm.value.propName;  
    if (name) {
      this.router.navigateByUrl("/listingsbyname/" + name);  
    }
  }

  sendFormToListings(filterForm: NgForm) {
    if (filterForm.valid) {
      
      const formValues = filterForm.value;
     

    } else {
      console.log('Form is not valid');
    }
  }

  getStars(rating?: number): string[] {
    const validRating = rating ?? 0; 
    const fullStars = Math.floor(validRating);
    const halfStars = Math.round(validRating - fullStars);
    const totalStars = 5;

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push('bi bi-star-fill'); 
    }
    if (halfStars) {
      stars.push('bi bi-star-half'); 
    }
    for (let i = stars.length; i < totalStars; i++) {
      stars.push('bi bi-star'); 
    }

    return stars;
  }
}
