export interface UserDTO {
    userName: string;
    userId: number;
  }
  
  export interface PropertyDTO {
    propertyName: string;
    propertyId: number;
  }
  
  export interface ReviewDTO {
    property: PropertyDTO;
    comment: string;
    feedbackId: number;
    rating: number;
    postedDate: string; 
    user: UserDTO;
  }
  