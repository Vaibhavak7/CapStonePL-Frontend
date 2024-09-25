import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PropertyListService } from 'src/app/Service/Property/property-list.service';
import { PropertyDTO } from '../models/Property';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';
import { ReviewDTO } from '../models/Review';
import { BookingService } from 'src/app/Service/Booking/booking.service';
import { BookingDate } from '../models/BookingDate';
import { BookMark } from '../models/BookMark';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {
  propertyId: number = 0;
  property: PropertyDTO | undefined;
  reviews: ReviewDTO[] = [];
  features!: string[];
  displayedReviews: ReviewDTO[] = [];
  currentSlide = 0;
  isWished: boolean = false;
  originalPrice!: string;
  rent!: number;
  discountedPrice!: string;
  checkInDate: Date = new Date(); // Default to today
  checkOutDate: Date | null = null; // No default value for check-out date
  guestsCount: number = 1;
  maxGuests!: number;
  guestOptions: number[] = [];
  totalPrice: string = '₹0';
  minDate: string;

  constructor(
    private route: ActivatedRoute,
    private propertyListService: PropertyListService,
    public auth: AuthService,
    private renderer: Renderer2,
    private router: Router,
    private bookingService: BookingService // Inject the booking service
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.propertyId = +params.get('propertyId')!;
      console.log(this.propertyId)
      this.getPropertyDetails();
      this.getPropertyFeedback();
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    this.updateGuestOptions();
  }

  onCheckInDateChange(newDate: string) {
    const newCheckInDate = new Date(newDate);
    if (this.checkOutDate && newCheckInDate >= this.checkOutDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Date',
        text: 'Check-in date must be before the check-out date.',
      });
      return;
    }
    this.checkInDate = newCheckInDate;
    this.updateTotalPrice();
  }

  onCheckOutDateChange(newDate: string) {
    const newCheckOutDate = new Date(newDate);
    if (newCheckOutDate <= this.checkInDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Date',
        text: 'Check-out date must be after the check-in date.',
      });
      return;
    }
    this.checkOutDate = newCheckOutDate;
    this.updateTotalPrice();
  }

  private updateGuestOptions() {
    this.guestOptions = Array.from({ length: this.maxGuests }, (_, i) => i + 1);
  }

  private updateTotalPrice() {
    this.totalPrice = this.calculateTotalPrice();
  }

  private calculateTotalPrice(): string {
    const pricePerNight = this.rent;
    const numberOfNights = this.calculateNights();
    return `₹${(pricePerNight * numberOfNights).toFixed(2)}`;
  }

  public calculateNights(): number {
    if (!this.checkOutDate) return 0;
    const diffTime = Math.abs(this.checkOutDate.getTime() - this.checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  onReserveClick() {
    if (!this.checkInDate || !this.checkOutDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Dates missing',
        text: 'Please select both check-in and check-out dates.',
      });
    } else {
      this.reserve(); // Call the reserve function if both dates are selected
    }
  }

  reserve() {
    const userId = this.auth.getUserDetails().userId;
    const bookingData: BookingDate = {
      startDate: this.checkInDate.toISOString().split('T')[0],
      endDate: this.checkOutDate ? this.checkOutDate.toISOString().split('T')[0] : null,
      property: { propertyId: this.propertyId },
      user: { userId: userId }
    };

    this.bookingService.createReservation(bookingData).subscribe({
      next: (response) => {
        console.log('Full Response:', response);
        if (response.status === 201 || response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Property booked successfully.',
          });
        } else {
          console.error('Unexpected status code:', response.status);
        }
      },
      error: (error) => {
        console.error('Error Response:', error);
        if (error.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Booking Error',
            text: 'This property is already booked for the selected dates.',
          });
        } else if (error.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Property booked successfully.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while booking the property. Please try again later.',
          });
        }
        this.checkInDate = new Date();
        this.checkOutDate = null;
      }
    });
  }

  getPropertyDetails(): void {
    this.propertyListService.getPropertyById(this.propertyId).subscribe(
      (data: PropertyDTO) => {
        this.property = data;
        this.features = data.features.split(',').map(feature => feature.trim());
        this.rent = data.rent;
        this.originalPrice = `₹${this.rent.toFixed(2)}`;
        this.discountedPrice = `₹${(this.rent).toFixed(2)}`;
        this.maxGuests = data.maxGuests;
        this.updateGuestOptions();
        this.updateTotalPrice();
        console.log(data);

        // Fetch average rating
        this.fetchAverageRating(this.propertyId);
      },
      error => {
        console.error('Error fetching property details', error);
      }
    );
  }

  fetchAverageRating(propertyId: number): void {
    this.propertyListService.fetchAverageRating(propertyId).subscribe(
      (avgRating: number) => {
        if (this.property) {
          this.property.avgRating = avgRating; // Assuming PropertyDTO has avgRating property
        }
        console.log('Average Rating:', avgRating);
      },
      error => {
        console.error('Error fetching average rating', error);
      }
    );
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

  getPropertyFeedback(): void {
    this.propertyListService.getPropertyReviews(this.propertyId).subscribe(
      (data: ReviewDTO[]) => {
        this.reviews = data;
        this.updateDisplayedReviews();
      },
      error => {
        console.error('Error fetching property reviews', error);
      }
    );
  }

  updateDisplayedReviews(): void {
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

  addDays(date: Date, days: number): string {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  }

  toggleWishlist(): void {
    const bookmarkData: BookMark = {
      bookmarkId: null,
      user: {
        userId: this.auth.getUserDetails().userId
      },
      property: {
        propertyId: this.propertyId
      }
    };

    this.propertyListService.addToWishlist(bookmarkData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        if (response.status === 201) {
          this.isWished = true;
          Swal.fire({
            icon: 'success',
            title: 'Added to Wishlist',
            text: 'Added to your wishlist!',
          });
        }
      },
      error: (err) => {
        console.error('Error adding to wishlist', err);
        if (err.status === 409) {
          Swal.fire({
            icon: 'warning',
            title: 'Already in Wishlist',
            text: 'This property is already in your wishlist.',
          });
        } else if (err.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Added to Wishlist',
            text: 'Added to your wishlist!',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Wishlist Error',
            text: 'Failed to add to wishlist. Please try again.',
          });
        }
      }
    });
  }
}
