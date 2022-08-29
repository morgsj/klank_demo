import { GeoPoint, Timestamp } from "firebase/firestore";

export type UID = string;

interface FirestoreObject {
  uid: UID;
}
//
// export interface Message extends FirestoreObject {
//   host: UID;
//   isHostSender: boolean;
//   message: string;
//   performer: UID;
//   time: Timestamp;
// }

export interface ConversationPreview {
  with: UID;
  message: string;
}

export interface Message {
  isHostSender: boolean;
  message: string;
  time: Timestamp;
}

export interface Conversation extends FirestoreObject{
  host: UID;
  performer: UID;
  messages: Message[]
}

export type PortfolioDisplay = {
  description: string;
  url: string;
}[];

export interface PortfolioItem {
  description: string;
  fileName: string;
}

export interface Review {
  comment: string;
  rating: number;
  reviewer: string;
}

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

export interface NotificationMethods {
  sms: boolean;
  email: boolean;
}

export interface NotificationTypes {
  news: boolean;
  offers: boolean;
  unreadMessages: boolean;
}

export interface UserDetails extends FirestoreObject {
  authProvider: string;
  description: string;
  email: string;
  location: GeoPoint;
  name: string;
  dateOfBirth: Timestamp;
  photo: string;
  portfolio: PortfolioItem[];
  reviews: Review[];
  venues: UID[];
  type: string[];
  hasOnboarded: boolean;
  notifications: NotificationMethods;
  notificationTypes: NotificationTypes;
}

export interface UserDetailsUpdater {
  authProvider?: string;
  description?: string;
  email?: string;
  location?: GeoPoint;
  name?: string;
  dateOfBirth?: Timestamp;
  photo?: string;
  portfolio?: PortfolioItem[];
  reviews?: Review[];
  venues?: UID[];
  type?: string[];
  hasOnboarded?: boolean;
  notifications?: NotificationMethods;
  notificationTypes?: NotificationTypes;
}
