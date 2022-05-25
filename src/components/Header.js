import React from "react";
import { logout } from "../firebase";

export default function Header(props) {
    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light p-3 w-100">
            <h3 class="m-3">{props.title}</h3>
            
            <form class="form-inline my-2 my-lg-0">
            <button class="btn btn-outline-success my-2 my-sm-0" onClick={logout}>Logout</button>
            </form>
        </nav>
    );
}