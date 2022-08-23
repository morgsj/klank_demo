import React, { useEffect } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

import Navigator from "../navigator";
import Header from "../header";
import "./Search.css";

export default function Search() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
    }, [user, loading]);


    return (
        <div className="container m-0 p-0">
            <div className="row">
                <div className="col-sm-1">
                    <Navigator />
                </div>
                <div className="col-sm-11">
                    <Header title={"Search"}/>
                    <input type="text" id="search-bar" placeholder="Search..."></input>
                </div>
            </div>
        </div>
    );
}