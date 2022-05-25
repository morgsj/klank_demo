import React from "react";
import Header from "./Header";
import Navigator from "./Navigator";

export default function Dashboard() {
    return (
        <div class="container">
            <div class="row">
                <div class="col-sm-1">
                    <Navigator />
                </div>
                <div class="col-sm-11">
                    <Header title="Dashboard"/>
                </div>
            </div>
        </div>
    );
}