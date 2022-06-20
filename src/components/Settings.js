import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";

import Navigator from "./Navigator";
import Header from "./Header";
import "./Settings.css";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import { useFilePicker } from 'use-file-picker';
import { uploadProfilePhoto } from "../api/profile-api";

export default function Search() {
    const [user, loading, error] = useAuthState(auth);

    const [nameInput, setNameInput] = useState("");

    const [profilePhotoURL, setProfilePhotoURL] = useState("");

    const [hasMadeChanges, setHasMadeChanges] = useState({});

    const [openFileSelector, { filesContent, fileSelectorLoading }] = useFilePicker({
        accept: '.png',
    });

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

    const handleChangePhoto = e => {
        openFileSelector();
    }


    if (fileSelectorLoading) {
        return <>Loading</>;
    }

    // if (filesContent.length > 0) {
    //     // we have a new profile image
    //     uploadProfilePhoto(user.uid, filesContent[0]);
    //     filesContent = [];
    // }

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

                    <Form>

                        <Form.Group>
                            <div id="avatar-container">
                                <img src={profilePhotoURL} className="rounded-circle" id="avatar" alt="Avatar" />
                            </div>
                            <Button variant="secondary" onClick={handleChangePhoto}>Change Photo</Button>
                            
                            <Button variant="secondary">Remove Photo</Button>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={nameInput} onChange={handleNameInputChange} placeholder="Name" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control type="date"/>
                        </Form.Group>


                    </Form>

                    <Button onClick={() => navigate("/venue/new-venue")}>Add Venue</Button>
                </div>
            </div>
        </div>
    );
}