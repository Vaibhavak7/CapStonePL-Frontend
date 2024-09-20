
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imageUrls: string[] = [
    'https://agarwalestates.com/images/blogs/property-management.jpg',
    'https://agarwalestates.com/images/blogs/property-management.jpg',
    'https://agarwalestates.com/images/blogs/property-management.jpg',
    'https://agarwalestates.com/images/blogs/property-management.jpg',
    'https://agarwalestates.com/images/blogs/property-management.jpg'
  ];

  getImages(): Observable<string[]> {
    return of(this.imageUrls);
  }
}
