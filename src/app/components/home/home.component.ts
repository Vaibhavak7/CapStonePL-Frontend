import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private auth: AuthService){}
  currentIndex = 0;
  slides = [
    { image: 'https://agarwalestates.com/images/blogs/property-management.jpg' },
    { image: 'https://www.constructionweekonline.in/cloud/2022/09/02/house-and-keys.jpeg' },
    { image:  '../../../assets/HomeDisplay1.png' },
    { image: 'https://www.constructionweekonline.in/cloud/2022/09/02/house-and-keys.jpeg' },
    { image: 'https://agarwsalestates.com/images/blogs/property-management.jpg' }
  ];
 
  get slideWidth(): string {
    return `${100 / this.slides.length}%`; // Calculate width of each slide
  }

  get transform(): string {
    return `translateX(-${this.currentIndex * 100}%)`; // Calculate the transform value
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  ngOnInit(): void {
    setInterval(() => {
      this.nextSlide();
    }, 100000); // Change slide every 5 seconds
  console.log("Home Userdetails",this.auth.getUserDetails())
  }
}
