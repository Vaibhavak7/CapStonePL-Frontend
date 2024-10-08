import { Owner } from "./Owner";

export class PropertyDTO {
    state: string;
    owner: Owner;
    description: string;
    propertyName: string;
    features: string;
    zipcode: string;
    securityDeposit: number;
    city: string;
    howOldProperty: number;
    rent: number;
    address1: string;
    address2: string;
    propertyId: number;
    typeOfProperty: string;
    imageUrl: string;
    area: string;
    postedOn: string; 
    maxGuests: number;
    avgRating?:number
  
    constructor() {
      this.state = '';
      this.owner = new Owner();
      this.description = '';
      this.propertyName = '';
      this.features = '';
      this.zipcode = '';
      this.securityDeposit = 0;
      this.city = '';
      this.howOldProperty = 0;
      this.rent = 0;
      this.address1 = '';
      this.address2 = '';
      this.propertyId = 0;
      this.typeOfProperty = '';
      this.imageUrl = '';
      this.area = '';
      this.postedOn = ''; 
      this.maxGuests = 0;
    }
  }