import React from "react";
import "./PageNotFound.css";

export function PageNotFound() {
    return (
        <div id="404">
            <div id="404-container">
                <img id="login-logo" alt="Klank Logo" src={require("../../images/logo_transparent.png")}/>
                <p>
                    Page Not Found
                </p>
            </div>
        </div>
    );
}
