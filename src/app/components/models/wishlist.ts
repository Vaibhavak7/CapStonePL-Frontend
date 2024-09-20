// bookmark.dto.ts
export interface Property {
    propertyName: string;
    city: string;
    rent: number;
    propertyId: number;
    imageUrl: string;
    typeOfProperty: string;
    area: string;
    maxGuests: number;
  }
  
  export interface User {
    userName: string;
    userId: number;
  }
  
  export interface wishlist {
    property: Property;
    user: User;
    bookmarkId: number;
  }
  