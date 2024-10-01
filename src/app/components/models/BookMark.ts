export interface UserDTO {
    userId: number;
}

export interface PropertyDTO {
    propertyId: number;
}

export interface BookMark {
    bookmarkId: number | null; 
    user: UserDTO;
    property: PropertyDTO;
}
