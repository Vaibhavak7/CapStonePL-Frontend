export interface Booking {
    property: PropertyDTOB;
    endDate: any;
    bookingId: number;
    startDate: any;
    user: UserDTOB;
  }
  
  export interface PropertyDTOB {
    propertyName: string;
    propertyId: number;
  }
  
  export interface UserDTOB {
    userName: string;
    userId: number;
  }
  