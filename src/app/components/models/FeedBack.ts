export interface FeedBack {
    property: PropertyDTO;
    comment: string;
    feedbackId: number;
    rating: number;
    postedDate: string; // You can also use Date if you convert it later
    user: UserDTO;
  }
  

export interface UserDTO {
    userName: string;
    userId: number;
  }
  
export interface PropertyDTO {
    propertyName: string;
    propertyId: number;
  }
  