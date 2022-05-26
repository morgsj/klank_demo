import React from "react";
import Navigator from "./Navigator";

export default function Messages() {
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <Navigator />
                </div>
                <div className="col">
                    Messages
                </div>
            </div>
        </div>
    );
}