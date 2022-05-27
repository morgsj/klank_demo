import React from "react";
import { logout } from "../firebase";
import "./Header.css";

export default function Header(props) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light p-3 w-100">
            <h3 className="m-3">{props.title}</h3>
            
            <form className="form-inline my-2 my-lg-0">
            <button className="btn my-2 my-sm-0" onClick={logout} id="logout">Logout</button>
            </form>
        </nav>
    );
}