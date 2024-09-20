import { Component } from '@angular/core';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userDetails: any; // Assuming this holds user details
  isUpdateModalOpen: boolean = false;
  updatedUsername: string = '';
  updatedPassword: string = '';

  constructor(private authService: AuthService) {
    this.userDetails = this.authService.getUserDetails();
    
    // Check if userDetails is defined and set updatedUsername accordingly
    if (this.userDetails) {
      console.log("Profile", this.userDetails.userId);
      this.updatedUsername = this.userDetails.userName; // Corrected from username to userName
    } else {
      console.error("User details not found");
    }
  }

  openUpdateModal(): void {
    this.isUpdateModalOpen = true;
  }

  closeUpdateModal(): void {
    this.isUpdateModalOpen = false;
  }

  updateProfile(): void {
    // Logic to update the user's profile (username and password)
    console.log('Updated Username:', this.updatedUsername);
    console.log('Updated Password:', this.updatedPassword);
    // Call a method in AuthService to update the username/password
    this.authService.updateUserProfile(this.updatedUsername, this.updatedPassword);
    this.closeUpdateModal(); // Close modal after updating
  }
}
