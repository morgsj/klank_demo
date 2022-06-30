import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

import Navigator from "./Navigator";
import Header from "./Header";
import "./Settings.css";
import { Button, Form } from "react-bootstrap";

import { useFilePicker } from 'use-file-picker';
import { getUserDetails, deleteUserPhoto, getImage, removeProfilePhoto, uploadProfilePhoto  } from "../api/user-api";

export default function Settings() {
    const [user, loading, error] = useAuthState(auth);
    const [userDetails, setUserDetails] = useState(null);

    const [nameInput, setNameInput] = useState("");

    const [profilePhotoURL, setProfilePhotoURL] = useState("");
    const [profilePhotoFilename, setProfilePhotoFilename] = useState("");

    const [hasMadeChanges, setHasMadeChanges] = useState({});

    const [openFileSelector, { plainFiles, fileSelectorLoading }] = useFilePicker({
        accept: ['.png', '.jpg', '.PNG', '.JPG'],
        // readFilesContent: false,
        limitFilesConfig: {max: 1},
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (loading || fileSelectorLoading) return;
        if (!user) return navigate("/login");
        setProfilePhotoURL(user.photoURL);
        getUserDetails(user.uid).then(data => {
            setUserDetails(data);
            setProfilePhotoFilename(data.photo);
        });
    }, [user, loading, fileSelectorLoading]);

    useEffect(() => {
        if (plainFiles.length) {
            if (profilePhotoFilename) deleteUserPhoto(user.uid, profilePhotoFilename);
            uploadProfilePhoto(user.uid, plainFiles[0]).then(url => setProfilePhotoURL(url));
            setProfilePhotoFilename(plainFiles[0].name);
        }
    }, [plainFiles]);

    const handleNameInputChange = e => {
        setHasMadeChanges(e.target.value == user.displayName);
        setNameInput(e.target.value);
        // canSave();
    }

    const handleChangePhoto = () => openFileSelector();
    const handleRemovePhoto = () => {
        removeProfilePhoto(user.uid, profilePhotoFilename);
        setProfilePhotoFilename("");
        setProfilePhotoURL("");
    };

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
                            
                            <Button variant="secondary" onClick={handleRemovePhoto} disabled={!profilePhotoURL}>Remove Photo</Button>
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