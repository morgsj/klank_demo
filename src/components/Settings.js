import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

import Navigator from "./Navigator";
import Header from "./Header";
import "./Settings.css";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import { useFilePicker } from 'use-file-picker';
import { getUserDetails, deleteUserPhoto, getImage, removeProfilePhoto, uploadProfilePhoto  } from "../api/user-api";
import { ArrowRight } from "react-bootstrap-icons";

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
        <Container className="global-container">
            <Row>
                <Col md="auto" style={{padding: 0}}>
                    <Navigator uid={user ? user.uid : ""} />
                </Col>
                <Col style={{padding: 0}}>

                    <Header title={"Settings"}/>

                    <Form id="form">

                        <Container>
                            <Row className="settings-section">
                                <Col sm={4}>
                                    <p>Profile Photo</p>
                                </Col>
                                <Col sm={8} id="profile-photo">
                                    <Row>
                                    <div id="avatar-container">
                                        <img src={profilePhotoURL} className="rounded-circle" id="avatar" alt="Avatar" />
                                    </div>
                                    </Row>
                                    <Row className="settings-button-container">
                                        <Button className="settings-button" variant="secondary" onClick={handleChangePhoto}>Change Photo</Button>
                                    </Row>
                                    <Row className="settings-button-container">
                                        <Button className="settings-button" variant="secondary" onClick={handleRemovePhoto} disabled={!profilePhotoURL}>Remove Photo</Button>
                                    </Row>                                    
                                </Col>
                            </Row>
                            <hr />
                            <Row className="settings-section">
                                <Col sm={4}>
                                    <p>Name</p>
                                </Col>
                                <Col sm={8}>
                                    <Form.Control type="text" value={nameInput} onChange={handleNameInputChange} placeholder="Name" />
                                </Col>
                            </Row>
                            <hr />
                            <Row className="settings-section">
                                <Col sm={4}>
                                    <p>Date of Birth</p>
                                </Col>
                                <Col sm={8}>
                                    <Form.Control type="date"/>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="settings-section">
                                <Col sm={4}>
                                    <p>Push Notifications</p>
                                </Col>
                                <Col sm={8}>
                                    <Form.Check 
                                        type="switch"
                                        id="custom-switch"
                                        label="Email"
                                    />
                                    <Form.Check 
                                        type="switch"
                                        id="custom-switch"
                                        label="SMS"
                                    />
                                </Col>
                            </Row>
                            <hr />
                            <Row className="settings-section">
                                <Col sm={4}>
                                    <p>Notification Types</p>
                                </Col>
                                <Col sm={8}>
                                    <Form.Check 
                                        type="switch"
                                        id="custom-switch"
                                        label="Offers"
                                    />
                                    <Form.Check 
                                        type="switch"
                                        id="custom-switch"
                                        label="News"
                                    />
                                    <Form.Check 
                                        type="switch"
                                        id="custom-switch"
                                        label="Unread Messages"
                                    />
                                </Col>
                            </Row>
                            <hr />
                            <Row className="settings-section">
                                <Col sm={4}>
                                    Dark Mode
                                </Col>
                                <Col sm={8}>
                                    <Form.Check 
                                        type="switch"
                                        id="custom-switch"
                                    />
                                </Col>
                            </Row>
                            <hr />
                            <Row className="settings-section">
                                <Col sm={4}>
                                    Privacy
                                </Col>
                                <Col sm={8}>
                                    <a className="link">Privacy Policy <ArrowRight /></a>
                                    <a className="link">Cookie Policy <ArrowRight /></a>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="settings-section">
                                <Col sm={4}>
                                    Legal
                                </Col>
                                <Col sm={8}>
                                    <a className="link">Terms and Conditions <ArrowRight /></a>
                                    <a className="link">Licenses <ArrowRight /></a>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="settings-section">
                                <Col sm={4}>
                                    Other
                                </Col>
                                <Col sm={8}>
                                    <Row className="settings-button-container">
                                        <Button className="settings-button" variant="danger">Logout</Button>
                                    </Row>
                                    <Row className="settings-button-container">
                                        <Button className="settings-button" variant="danger">Delete Account</Button>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>


                    </Form>

                    <Button onClick={() => navigate("/venue/new-venue")}>Add Venue</Button>
                </Col>
            </Row>
        </Container>
    );
}