import React from "react";
import { House, Binoculars, ChatSquare } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import './Navigator.css';

export default function Navigator() {
    return (
        <nav id="main-nav" class="nav flex-column">
            <img id="logo" src={require("../images/logo.png")} style={{height: '5vw', minHeight: 65}}/>
            <Link to="/dashboard"><House className="icon" /></Link>
            <Link to="/search"><Binoculars className="icon" /></Link>
            <Link to="/messages"><ChatSquare className="icon" /></Link>
        </nav>
    );
}