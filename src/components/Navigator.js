import React from "react";
import { House, Binoculars, ChatSquare, Person, CalendarWeek, Gear } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import './Navigator.css';

export default function Navigator() {
    return (
        <nav id="main-nav" className="nav flex-column">
            <Link to="/"><img id="logo" src={require("../images/logo_transparent.png")} style={{height: '5vw', minHeight: 65}}/></Link>
            <Link to="/dashboard"><House className="nav-icon" /></Link>
            <Link to="/search"><Binoculars className="nav-icon" /></Link>
            <Link to="/messages"><ChatSquare className="nav-icon" /></Link>
            <Link to="/calendar"><CalendarWeek className="nav-icon" /></Link>
            <Link to="/profile"><Person className="nav-icon" /></Link>
            <Link to="/settings"><Gear className="nav-icon" /></Link>
        </nav>
    );
}