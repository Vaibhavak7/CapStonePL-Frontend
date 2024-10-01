export interface FeedbackDTO {
    user: {
        userId: number;
    };
    property: {
        propertyId: number;
    };
    rating: number;
    comment: string;
    postedDate: string; 
}
