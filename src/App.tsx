import React from "react";
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from "./domains/dashboard";
import Messages from "./domains/messages";
import Search from "./domains/search";
import Login from "./domains/auth/login";
import Register from "./domains/auth/register";
import Index from "./domains/auth/reset-password";
import Calendar from "./domains/calendar";
import Profile from "./domains/profile";
import BookingView from "./domains/booking";
import VenueViewer from "./domains/venue";
import Settings from "./domains/settings";
import Onboarding from "./domains/auth/additional-onboarding";
import EnableNotifications from "./domains/auth/notification-onboarding/EnableNotifications";
import { PageNotFound } from "./domains/404";
import "./theme.css";
import './messaging_get_token';

export default function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="messages" element={<Messages />} />
          <Route path="search" element={<Search />} />
          <Route path="reset" element={<Index />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="settings" element={<Settings />} />
          <Route path="booking/:bookingID" element={<BookingView />} />
          <Route path="venue/:venueID" element={<VenueViewer />} />
          <Route path="complete-registration" element={<Onboarding />} />
          <Route path="enable-notifications" element={<EnableNotifications />} />

          <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}