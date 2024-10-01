import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistComponent } from './wishlist.component';

describe('WishlistComponent', () => {
  let component: WishlistComponent;
  let fixture: ComponentFixture<WishlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WishlistComponent]
    });
    fixture = TestBed.createComponent(WishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { WishlistService } from './wishlist.service';
// import { wishlist } from '../models/wishlist';

// describe('WishlistService', () => {
//   let service: WishlistService;
//   let httpMock: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [WishlistService]
//     });
//     service = TestBed.inject(WishlistService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should retrieve wishlist properties by userId', () => {
//     const mockResponse: wishlist[] = [
//       {
//         property: {
//           propertyId: 1,
//           propertyName: 'Villa',
//           city: 'Los Angeles',
//           rent: 5000,
//           imageUrl: 'url/to/image.jpg',
//           typeOfProperty: 'Residential',
//           area: '500 sq ft',
//           maxGuests: 4,
//         },
//         user: {
//           userId: 1,
//           userName: 'John Doe'
//         },
//         bookmarkId: 1
//       },
//       {
//         property: {
//           propertyId: 2,
//           propertyName: 'Apartment',
//           city: 'New York',
//           rent: 3000,
//           imageUrl: 'url/to/image.jpg',
//           typeOfProperty: 'Residential',
//           area: '300 sq ft',
//           maxGuests: 2,
//         },
//         user: {
//           userId: 2,
//           userName: 'Jane Smith'
//         },
//         bookmarkId: 2
//       }
//     ];

//     service.getWishlistPropertyById(1).subscribe((bookmarks) => {
//       expect(bookmarks.length).toBe(2);
//       expect(bookmarks).toEqual(mockResponse);
//     });

//     const req = httpMock.expectOne('your/api/url/for/wishlist/1'); 
//     expect(req.request.method).toBe('GET');
//     req.flush(mockResponse); 
//   });

//   it('should delete a bookmark', () => {
//     const mockBookmarkId = 1; 
//     service.deleteBookmark(1, mockBookmarkId).subscribe((response) => {
//       expect(response.status).toBe(200); 
//     });

//     const req = httpMock.expectOne(`your/api/url/for/delete/bookmark/1/${mockBookmarkId}`);
//     expect(req.request.method).toBe('DELETE');
//     req.flush({ status: 200 }); 
//   });
// });
