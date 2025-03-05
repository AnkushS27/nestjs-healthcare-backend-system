export interface AbacAttributes {
    time?: {
        gte?: string; // e.g., "09:00"
        lte?: string; // e.g., "17:00"
    };
    location?: string; // e.g., "NY"
    [key: string]: any; // Allow other attributes for flexibility
}