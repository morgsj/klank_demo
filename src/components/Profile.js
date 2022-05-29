import React, { useEffect } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";


import Navigator from "./Navigator";
import Header from "./Header";

export default function Calendar() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
    }, [user, loading]);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <Navigator />
                </div>
                <div className="col">
                    <Header title={"Profile"}/>
                </div>
            </div>
        </div>
    );
}