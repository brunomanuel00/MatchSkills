export interface NotificationData {
    newMatchesCount?: number;
    message?: string;
    timestamp?: string;
    matchedUserId?: string;
    matchingSkills?: any[];
}

export interface Notification {
    id: string;
    user: string;
    type: 'new_message' | 'new_match';
    data: NotificationData;
    read: boolean;
    createdAt: string;
}