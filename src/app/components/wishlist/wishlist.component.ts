import { Component, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';
import { PropertyListService } from 'src/app/Service/Property/property-list.service';
import { PropertyDTO } from '../models/Property';
import { WishlistService } from 'src/app/Service/Wishlist/wishlist.service';
import { wishlist } from '../models/wishlist';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {


  bookmarks: wishlist[] = []; 
  userId!: number
  constructor(public auth: AuthService, private yourService: WishlistService) { }

  ngOnInit() {
    this.userId = this.auth.getUserDetails().userId; 
    this.getWishlistProperties(this.userId);
  }

  getWishlistProperties(userId: number) {
    this.yourService.getWishlistPropertyById(userId).subscribe(
      (response: any[]) => {
        this.bookmarks = response.reverse(); 
    
      },
      error => {
        console.error('Error fetching wishlist properties:', error);
      }
    );
  }
  removeReview(propertyId: number) {

    this.yourService.deleteBookmark(this.userId, propertyId).subscribe({
      next: (response) => {
      
        if (response.status === 200) {
          this.bookmarks = this.bookmarks.filter(bookmark => bookmark.property.propertyId !== propertyId);
          Swal.fire({
            icon: 'success',
            title: 'Bookmark removed successfully!',
            text: 'Your Bookmark has been successfully removed.',
            confirmButtonText: 'OK'
          });
         
        }
      },
      error: (error) => {
        if (error.status === 404) {  
         
          Swal.fire({
            icon: 'warning',
            title: 'Bookmark not found',
            text: 'No review found for this property.',
            confirmButtonText: 'OK'
          });
        } else {
         
          Swal.fire({
            icon: 'error',
            title: 'Failed to remove review',
            text: 'Could not remove review. Please try again later.',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  }

}

