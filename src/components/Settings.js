import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";

import Navigator from "./Navigator";
import Header from "./Header";
import "./Search.css";

export default function Search() {
    const [user, loading, error] = useAuthState(auth);

    const [nameInput, setNameInput] = useState(user.displayName);

    const [hasMadeChanges, setHasMadeChanges] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
    }, [user, loading]);

    const handleNameInputChange = e => {
        setHasMadeChanges(e.target.value == user.displayName);
        setNameInput(e.target.value);
        // canSave();
    }

    return (
        <div className="container m-0 p-0">
            <div className="row">
                <div className="col-sm-1">
                    <Navigator uid={user ? user.uid : ""} />
                </div>
                <div className="col-sm-11">
                    <Header title={"Settings"}/>
                    
                    <div>
                        <button className="btn btn-primary" disabled={hasMadeChanges}>Save</button>
                    </div>

                    <div className="container">
                        <div className="row">
                            <div className="col">
                                Name
                            </div>
                            <div className="col">
                                <input type="text" value={nameInput} onChange={handleNameInputChange} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                Date of Birth
                            </div>
                            <div className="col">
                                <input type="text" />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                Location
                            </div>
                            <div className="col">
                                <input type="text" />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}