import React from "react";
import Navigator from "./Navigator";
import Header from "./Header";
import "./Search.css";

export default function Search() {
    return (
        <div className="container m-0 p-0">
            <div className="row">
                <div className="col-sm-1">
                    <Navigator />
                </div>
                <div className="col-sm-11">
                    <Header title={"Search "}/>
                    <input type="text" id="search-bar" placeholder="Search..."></input>
                </div>
            </div>
        </div>
    );
}