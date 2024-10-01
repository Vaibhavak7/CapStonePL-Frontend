export interface FeedBack {
    property: PropertyDTO;
    comment: string;
    feedbackId: number;
    rating: number;
    postedDate: string; 
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
  