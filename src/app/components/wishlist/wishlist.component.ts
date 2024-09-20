import { Component, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';
import { PropertyListService } from 'src/app/Service/Property/property-list.service';
import { PropertyDTO } from '../models/Property';
import { WishlistService } from 'src/app/Service/Wishlist/wishlist.service';
import { wishlist } from '../models/wishlist';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent { 


  bookmarks: wishlist[] = []; // Array to hold bookmarks
  userId!: number
  constructor(public auth: AuthService, private yourService:  WishlistService) {}

  ngOnInit() {
    this.userId = this.auth.getUserDetails().userId; // Replace with dynamic user ID as needed
    this.getWishlistProperties(this.userId);
  }

  getWishlistProperties(userId: number) {
    this.yourService.getWishlistPropertyById(userId).subscribe(
      (response: any[]) => {
        this.bookmarks = response; //
        console.log() 
      },
      error => {
        console.error('Error fetching wishlist properties:', error);
      }
    );
  }
}
