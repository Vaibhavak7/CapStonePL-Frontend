import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userDetails: any; 
  isUpdateModalOpen: boolean = false;
  updatedUsername: string = ''; 
  updatedPassword: string = ''; 
  newPropertyMessage: string = '';

  hotelFunFacts: string[] = [
    "The world's tallest hotel, the JW Marriott Marquis in Dubai, stands at 1,164 feet and offers stunning views of the city's skyline and the Arabian Gulf.",
    "The famous Hotel del Coronado in California was featured in the classic film 'Some Like It Hot' and is said to be haunted by the ghost of a former guest.",
    "The Conrad Maldives Rangali Island features an underwater restaurant called Ithaa, providing diners with 180-degree views of the vibrant marine life surrounding them.",
    "In the 1960s, the St. Regis New York introduced the idea of butler service, revolutionizing the luxury hotel experience and setting a new standard for hospitality.",
    "The Chateau Marmont in Los Angeles has hosted numerous celebrities and has a no-photos policy, preserving guests' privacy and making it a legendary retreat.",
    "The Hotel Sorrento in Seattle has a ghost named 'the White Lady,' believed to be the spirit of a former guest who enjoys visiting guests in the night.",
    "The Hotel Monaco in Portland features a goldfish for every guest to borrow during their stay, providing a unique and comforting touch for travelers.",
    "The Bellagio Hotel in Las Vegas is home to the famous Fountains of Bellagio, which perform a choreographed water show set to music, attracting millions of visitors.",
    "The K Hotel in the UK is known for its quirky décor, featuring rooms with themes like 'Under the Sea' and 'Safari,' making each stay a unique adventure.",
    "The Icehotel in Sweden offers guests the chance to sleep on beds made of ice, complete with thermal sleeping bags, making for a truly unforgettable experience.",
    "In Hawaii, the Hilton Hawaiian Village features a weekly fireworks show, providing guests with a spectacular display to enjoy right from the resort.",
    "The Ritz-Carlton in San Francisco has a 'Living Room' with live piano music in the lobby, creating a warm and welcoming atmosphere for guests and visitors.",
    "The Hotel Bel-Air in Los Angeles is famous for its swan lake, where guests can relax and enjoy a tranquil setting surrounded by lush gardens.",
    "The W Hotel in Barcelona features a rooftop bar called 'Eclipse,' known for its stunning city views and vibrant atmosphere, making it a popular nightlife destination.",
    "The Grand Hotel Tremezzo on Lake Como boasts an outdoor floating pool, offering guests a unique swimming experience with breathtaking lake views.",
    "The Fairmont Hotel in Banff has its own resident ghost, a friendly spirit named 'The Lady in White,' who is said to roam the halls and visit guests.",
    "The Four Seasons Resort in Bora Bora features overwater bungalows that provide guests with direct access to the lagoon, blending luxury with breathtaking nature.",
    "The 21c Museum Hotel in Louisville doubles as an art museum, showcasing contemporary art installations throughout the hotel, providing a unique cultural experience.",
    "The Hotel Nacional de Cuba has a rich history, having hosted famous figures like Frank Sinatra and John Wayne, and features stunning views of Havana.",
    "The Burj Al Arab has a helipad at the top, which has hosted celebrity events, including a tennis match between Andre Agassi and Roger Federer."
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails(); 
    if (this.userDetails) {
      this.updatedUsername = this.userDetails.userName; 
     
    } else {
      console.error("User details not found");
    }
  
    this.randomizeFunFact();
  }

  randomizeFunFact(): void {
    const randomIndex = Math.floor(Math.random() * this.hotelFunFacts.length);
    this.newPropertyMessage = this.hotelFunFacts[randomIndex];
  }


  openUpdateModal(): void {
    this.isUpdateModalOpen = true;
  }

  closeUpdateModal(): void {
    this.isUpdateModalOpen = false;
  }

  updateProfile(): void {
   
   
    this.authService.updateUserProfile(this.updatedUsername, this.updatedPassword);
    this.closeUpdateModal(); 
  }
}
