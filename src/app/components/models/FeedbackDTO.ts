export interface FeedbackDTO {
    user: {
        userId: number;
    };
    property: {
        propertyId: number;
    };
    rating: number;
    comment: string;
    postedDate: string; // or Date if you want to handle it as a Date object
}
