import {GeoPoint, Timestamp} from "firebase/firestore";

export type UID = string;

interface FirestoreObject {
    uid: UID;
}

export interface Message extends FirestoreObject {
    host: UID;
    isHostSender: boolean;
    message: string;
    performer: UID;
    time: Timestamp;
}

export interface ConversationPreview {
    with: UID;
    message: string;
}

export type PortfolioDisplay = {
    description: string,
    url: string
}[];

export type PortfolioStore = {
    description: string,
    fileName: string
}[];

export type Reviews = {
    comment: string,
    rating: number,
    reviewer: string
}[];

export interface Address {
    addressLine1: string;
    addressLine2: string;
    city: string;
    postcode: string;
}

export interface Venue extends FirestoreObject {
    address: Address;
    description: string;
    location: GeoPoint;
    locationGuidance: string;
    name: string;
    organiser: UID;
    photos: string[];
}

export interface Booking extends FirestoreObject {
    artist: UID;
    startTime: Timestamp;
    endTime: Timestamp;
    fee: number;
    notes: string;
    venue: UID;
}

export interface NotificationTypes {
    news: boolean;
    offers: boolean;
    unreadMessages: boolean;
    sms: boolean;
    email: boolean;
}


export interface UserDetails extends FirestoreObject {
    authProvider: string;
    description: string;
    email: string;
    location: GeoPoint;
    name: string;
    dateOfBirth: Timestamp;
    photo: string;
    portfolio: PortfolioStore;
    reviews: Reviews;
    venues: UID[];
    type: string[];
    hasOnboarded: boolean;
    notifications: NotificationTypes;
}
