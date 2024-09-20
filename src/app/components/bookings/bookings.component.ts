import { Component } from '@angular/core';
import { Booking } from '../models/Booking';
import { BookingService } from 'src/app/Service/Booking/booking.service';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent {
  bookings: Booking[] = [];
  userId!: number;
  isReviewModalOpen: boolean = false;
  reviewText: string = '';
  currentPropertyId!: number;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedRating: number = 0; // To store the selected rating
  hoveredRating: number = 0;  // To handle hover effect

  constructor(private auth: AuthService, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.userId = this.auth.getUserDetails().userId;
    this.loadBookings(this.userId);
  }

  loadBookings(userId: number): void {
    this.bookingService.getBookingWithPropertyById(userId).subscribe(
      (response: Booking[]) => {
        this.bookings = response;
        console.log(this.bookings);
      },
      (error) => {
        console.error('Error fetching bookings', error);
      }
    );
  }

  openReviewModal(propertyId: number): void {
    this.currentPropertyId = propertyId;
    this.isReviewModalOpen = true;
  }

  closeReviewModal(): void {
    this.reviewText=""
    this.selectedRating=0
    this.isReviewModalOpen = false;
  }

  submitReview(): void {
    console.log('Submitting review for property', this.currentPropertyId);
    console.log('Review:', this.reviewText);
    console.log('Rating:', this.selectedRating); // Get the selected rating

    // Logic for submitting the review goes here (e.g., sending data to the backend)
    this.closeReviewModal();
  }

  hoverRating(rating: number): void {
    this.hoveredRating = rating;
  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
  }
}

