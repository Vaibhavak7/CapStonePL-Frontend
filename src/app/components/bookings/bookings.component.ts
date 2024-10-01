import { Component } from '@angular/core';
import { Booking } from '../models/Booking';
import { BookingService } from 'src/app/Service/Booking/booking.service';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';
import { FeedbackDTO } from '../models/FeedbackDTO';
import Swal from 'sweetalert2';  // Import SweetAlert

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
  selectedRating: number = 0; 
  hoveredRating: number = 0; 

  constructor(private auth: AuthService, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.userId = this.auth.getUserDetails().userId;
    this.loadBookings(this.userId);
  }

  loadBookings(userId: number): void {
    this.bookingService.getBookingWithPropertyById(userId).subscribe(
      (response: Booking[]) => {
        this.bookings = response.reverse();
       
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
    this.reviewText = '';
    this.selectedRating = 0;
    this.isReviewModalOpen = false;
  }

  postedDate: string = new Date().toISOString(); 

  submitReview(): void {
   
    if (!this.reviewText.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Review Required',
        text: 'Please enter your review text.',
        confirmButtonText: 'OK'
      });
      return; 
    }

    if (this.selectedRating === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Rating Required',
        text: 'Please select a rating.',
        confirmButtonText: 'OK'
      });
      return; 
    }

    const feedbackData: FeedbackDTO = {
      user: { userId: this.userId },
      property: { propertyId: this.currentPropertyId },
      rating: this.selectedRating,
      comment: this.reviewText,
      postedDate: this.postedDate
    };

  

    this.bookingService.submitFeedback(feedbackData).subscribe({
      next: (response) => {
        if (response.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Feedback submitted!',
            text: 'Your feedback has been successfully submitted.',
            confirmButtonText: 'OK'
          });
        }
      },
      error: (error) => {
        if (error.status === 409) {
       
          Swal.fire({
            icon: 'warning',
            title: 'Feedback already submitted',
            text: 'You have already submitted feedback for this property.',
            confirmButtonText: 'OK'
          });
        } else {
          console.error('Error submitting feedback', error);
          Swal.fire({
            icon: 'error',
            title: 'Failed to submit',
            text: 'Could not submit feedback. Please try again later.',
            confirmButtonText: 'OK'
          });
        }
      }
    });

    this.closeReviewModal();
  }

  hoverRating(rating: number): void {
    this.hoveredRating = rating;
  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
  }
  isFutureDate(endDate: string): boolean {
    const today = new Date();
    const bookingEndDate = new Date(endDate);
    return bookingEndDate > today;
  }
}
