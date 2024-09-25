export interface UserDTO {
    userId: number;
}

export interface PropertyDTO {
    propertyId: number;
}

export interface BookMark {
    bookmarkId: number | null; // Allow null for bookmarkId
    user: UserDTO;
    property: PropertyDTO;
}
