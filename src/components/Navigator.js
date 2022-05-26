import React from "react";
import { House, Binoculars, ChatSquare } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import './Navigator.css';

export default function Navigator() {
    return (
        <nav id="main-nav" className="nav flex-column">
            <Link to="/"><img id="logo" src={require("../images/logo.png")} style={{height: '5vw', minHeight: 65}}/></Link>
            <Link to="/dashboard"><House className="nav-icon" /></Link>
            <Link to="/search"><Binoculars className="nav-icon" /></Link>
            <Link to="/messages"><ChatSquare className="nav-icon" /></Link>
        </nav>
    );
}