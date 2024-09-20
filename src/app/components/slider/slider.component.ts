import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  slides = [
    { imageUrl: 'https://agarwalestates.com/images/blogs/property-management.jpg' },
    { imageUrl: 'https://agarwalestates.com/images/blogs/property-management.jpg' },
    { imageUrl: 'https://agarwalestates.com/images/blogs/property-management.jpg' },
    { imageUrl: 'https://agarwalestates.com/images/blogs/property-management.jpg' },
    { imageUrl: 'https://agarwalestates.com/images/blogs/property-management.jpg' },
    { imageUrl: 'https://agarwalestates.com/images/blogs/property-management.jpg' },
    { imageUrl: 'https://agarwalestates.com/images/blogs/property-management.jpg' }
  ];

  activeSlide = 3; // Set initial active slide to 3 (centered)

  constructor() {}

  ngOnInit(): void {}

  getSlideStyle(index: number): any {
    const distance = Math.abs(this.activeSlide - index);
    if (distance === 0) {
      return {
        transform: 'none',
        zIndex: 1,
        filter: 'none',
        opacity: 1
      };
    } else if (index > this.activeSlide) {
      return {
        transform: `translateX(${120 * distance}px) scale(${1 - 0.2 * distance}) perspective(16px) rotateY(-1deg)`,
        zIndex: -distance,
        filter: 'blur(5px)',
        opacity: distance > 2 ? 0 : 0.6
      };
    } else {
      return {
        transform: `translateX(${-120 * distance}px) scale(${1 - 0.2 * distance}) perspective(16px) rotateY(1deg)`,
        zIndex: -distance,
        filter: 'blur(5px)',
        opacity: distance > 2 ? 0 : 0.6
      };
    }
  }

  nextSlide(): void {
    if (this.activeSlide < this.slides.length - 1) {
      this.activeSlide++; // Increment the activeSlide
    }
  }

  prevSlide(): void {
    if (this.activeSlide > 0) {
      this.activeSlide--; // Decrement the activeSlide
    }
  }
}
