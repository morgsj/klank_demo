import React from "react";
import { House, Binoculars, ChatSquare } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import './Navigator.css';

export default function Navigator() {
    return (
        <div className="container border ml-10" style={{height: '100vh', width: '6vw', minWidth: 75}}>
            <div className="row" style={{height: '6vw', minHeight: 75}}></div>

            <div className="row" style={{height: '6vw', minHeight: 75}}>
                <div className="col" id="logo">
                    <h1>K</h1>
                </div>
            </div>
            <div className="row">
                <div className="col" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Link to="/dashboard">
                        <House className="icon" />
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Link to="/search">
                        <Binoculars className="icon" />
                    </Link>
                </div>
            </div> 
            <div className="row">
                <div className="col">
                    <Link to="/messages">
                        <ChatSquare className="icon" />
                    </Link>
                </div>
            </div>
        </div>
    );
}