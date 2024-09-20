import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PropertyListService } from 'src/app/Service/Property/property-list.service';
import { PropertyDTO } from '../models/Property';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';
import { ReviewDTO } from '../models/Review';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {
  propertyId: number = 0;
  property: PropertyDTO | undefined;
  reviews: ReviewDTO[] = [];
  features!: String[];
  displayedReviews: ReviewDTO[] = [];
  currentSlide = 0;

  constructor(
    private route: ActivatedRoute,
    private propertyListService: PropertyListService,
    public auth: AuthService,private renderer: Renderer2,private router: Router
  ) { }

  ngOnInit(): void {
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    this.route.paramMap.subscribe(params => {
      this.propertyId = +params.get('propertyId')!;
      this.getPropertyDetails();
      this.getPropertyFeedback();
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Scroll to the top of the page after navigation
        window.scrollTo(0, 0);
      }
    });
  }
  scrollToTop(): void {
    this.renderer.setProperty(window, 'scrollTo', { top: 0, behavior: 'smooth' });
  }
  getPropertyDetails(): void {
    this.propertyListService.getPropertyById(this.propertyId).subscribe(
      (data: PropertyDTO) => {
        this.property = data;
        this.features = data.features.split(',').map(feature => feature.trim()); // Corrected variable name
        console.log('Property Details:', data);
        console.log('Features:', this.features); // Updated log to use correct variable name
      },
      error => {
        console.error('Error fetching property details', error);
      }
    );
  }
  

  getPropertyFeedback(): void {
    this.propertyListService.getPropertyReviews(this.propertyId).subscribe(
      (data: ReviewDTO[]) => {
        this.reviews = data;
        this.updateDisplayedReviews();
        console.log('Property Reviews:', this.reviews);
        // this.autoSlide();
      },
      error => {
        console.error('Error fetching property reviews', error);
      }
    );
  }

  updateDisplayedReviews(): void {
    // Always display 3 reviews
    this.displayedReviews = this.reviews.slice(this.currentSlide, this.currentSlide + 3);
    if (this.reviews.length < 3) {
      while (this.displayedReviews.length < 3) {
        this.displayedReviews.push(...this.reviews);
      }
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.reviews.length;
    this.updateDisplayedReviews();
  }

  previousSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.reviews.length) % this.reviews.length;
    this.updateDisplayedReviews();
  }

  // autoSlide() {
  //   setInterval(() => {
  //     this.nextSlide();
  //   }, 15000);  // Change slide every 15 seconds
  // }
}
