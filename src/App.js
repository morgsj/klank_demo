import React from "react";
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import Navigator from "./components/Navigator";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from "./components/Dashboard";
import Messages from "./components/Messages";
import Search from "./components/Search";
import Login from "./components/Login";
import Register from "./components/Register";
import Reset from "./components/Reset";
import Calendar from "./components/Calendar";
import Profile from "./components/Profile";
import BookingOutline from "./components/BookingOutline";


export default function App() {
  
  return (
    <BrowserRouter>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="messages" element={<Messages />} />
          <Route path="search" element={<Search />} />
          <Route path="reset" element={<Reset />} />
          <Route path="profile" element={<Profile />} />
          <Route path="calendar" element={<Calendar />} />

          
          <Route path="bi" element={<BookingOutline />} />

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