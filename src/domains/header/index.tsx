import React from "react";
import { Button } from "react-bootstrap";
import { logout } from "../../api/auth-api";
import "./Header.css";

interface HeaderProps {
    title: string
}
export default function Header(props: HeaderProps) {
    return (
        <nav className="navbar justify-content-between navbar-light p-3 w-100" id="header-nav">
            <h3 className="m-3">{props.title}</h3>
            
            <form className="form-inline my-2 my-lg-0">
                <Button variant="primary" onClick={logout}>Logout</Button> 
            </form>
        </nav>
    );
}