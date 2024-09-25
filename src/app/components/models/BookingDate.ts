export interface BookingDate {
  property: PropertyDTOB;
  endDate: any;
  startDate: any;
  user: UserDTOB;
}

export interface PropertyDTOB {
  propertyId: number;
}

export interface UserDTOB {
  userId: number;
}
