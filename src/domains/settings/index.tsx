import React, {ChangeEvent, useEffect, useState} from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

import Navigator from "../navigator";
import Header from "../header";
import "./Settings.css";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

import { useFilePicker } from 'use-file-picker';
import { getUserDetails, deleteUserPhoto, getImage, removeProfilePhoto, uploadProfilePhoto  } from "../../api/user-api";
import { ArrowRight } from "react-bootstrap-icons";
import { updateUserDetails } from "../../api/auth-api";
import { dateStringToTimestamp, toDateTime } from "../../api/helpers";
import {loadTheme} from "../../";
import {UserDetails} from "../../api/types";

export default function Settings() {
    const [user, userLoading, error] = useAuthState(auth);
    const [userDetails, setUserDetails] = useState<UserDetails>();

    const [profilePhotoURL, setProfilePhotoURL] = useState("");
    const [profilePhotoFilename, setProfilePhotoFilename] = useState("");

    const [nameInput, setNameInput] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);

    const [dateOfBirthInput, setDateOfBirthInput] = useState("");
    const [isEditingDob, setIsEditingDob] = useState(false);

    const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
    const [smsNotificationsEnabled, setSMSNotificationsEnabled] = useState(false);

    const [offersNotificationsEnabled, setOffersNotificationsEnabled] = useState(false);
    const [newsNotificationsEnabled, setNewsNotificationsEnabled] = useState(false);
    const [unreadMessagesNotificationsEnabled, setUnreadMessagesNotificationsEnabled] = useState(false);

    const [darkMode, setDarkMode] = useState(false);


    const [openFileSelector, { plainFiles, loading }] = useFilePicker({
        accept: ['.png', '.jpg', '.PNG', '.JPG'],
        // readFilesContent: false,
        limitFilesConfig: {max: 1},
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (userLoading || loading) return;
        if (!user) return navigate("/login");
        setProfilePhotoURL(user.photoURL!);

        getUserDetails(user.uid).then(data => {
            setUserDetails(data);
            setProfilePhotoFilename(data.photo);
            setNameInput(data.name);

            setDateOfBirthInput(toDateTime(data.dateOfBirth.seconds));

            setEmailNotificationsEnabled(data.notifications.email);
            setSMSNotificationsEnabled(data.notifications.sms);

            setOffersNotificationsEnabled(data.notifications.offers);
            setNewsNotificationsEnabled(data.notifications.news);
            setUnreadMessagesNotificationsEnabled(data.notifications.unreadMessages);

        });
    }, [user, userLoading, loading, navigate]);

    useEffect(() => {
        const colorTheme = localStorage.getItem("colorTheme");
        setDarkMode(colorTheme === "dark");
    }, [])

    useEffect(() => {
        if (plainFiles.length) {
            if (profilePhotoFilename && user) deleteUserPhoto(user.uid, profilePhotoFilename);
            if (user) uploadProfilePhoto(user.uid, plainFiles[0]).then((url: string) => setProfilePhotoURL(url));
            setProfilePhotoFilename(plainFiles[0].name);
        }
    }, [plainFiles, profilePhotoFilename, user]);

    const handleNameInputChange = (e: ChangeEvent<HTMLInputElement>) => setNameInput(e.target.value);

    const handleDobInputChange = (e: ChangeEvent<HTMLInputElement>) => setDateOfBirthInput(e.target.value);

    const handleChangePhoto = () => openFileSelector();
    const handleRemovePhoto = () => {
        if (user) removeProfilePhoto(user.uid, profilePhotoFilename);
        setProfilePhotoFilename("");
        setProfilePhotoURL("");
    };

    const handleEditingName = () => {

        if (isEditingName) {
            if (user && userDetails)
                updateUserDetails(user.uid, {name: nameInput})
                    .then(() => console.log("Updated"))
                    .catch(() => console.log("Failed to update"));
        }
        
        setIsEditingName(!isEditingName);
    }

    const handleEditingDob = () => {

        if (isEditingDob && user && userDetails) {
            updateUserDetails(user.uid, {dateOfBirth: dateStringToTimestamp(dateOfBirthInput)})
                .then(() => console.log("Updated"))
                .catch(() => console.log("Failed to update"));
        }

        setIsEditingDob(!isEditingDob);
    }

    const handleEmailNotificationClick = (e: ChangeEvent<HTMLInputElement>) => {
        setEmailNotificationsEnabled(e.target.checked);
        if (user && userDetails)
            updateUserDetails(user.uid, {notifications: {email: e.target.checked, sms: userDetails.notifications.sms}})
                .then(() => console.log("Updated"))
                .catch(() => console.log("Failed to update"));
    }

    const handleSMSNotificationClick = (e: ChangeEvent<HTMLInputElement>) => {
        setSMSNotificationsEnabled(e.target.checked);
        if (user && userDetails)
            updateUserDetails(user.uid, {notifications: {email: userDetails.notifications.sms, sms: e.target.checked}})
                .then(() => console.log("Updated"))
                .catch(() => console.log("Failed to update"));
    }

    const handleOffersNotificationsClick = (e: ChangeEvent<HTMLInputElement>) => {
        setOffersNotificationsEnabled(e.target.checked);
        if (user && userDetails)
            updateUserDetails(user.uid, {notifications: {news: e.target.checked, offers: userDetails.notifications.offers, unreadMessages: userDetails.notifications.unreadMessages}})
            .then(() => console.log("Updated"))
            .catch(() => console.log("Failed to update"));
    }

    const handleNewsNotificationsClick = (e: ChangeEvent<HTMLInputElement>) => {
        setNewsNotificationsEnabled(e.target.checked);
        if (user && userDetails)
            updateUserDetails(user.uid, {notifications: {news: userDetails.notifications.news, offers: e.target.checked, unreadMessages: userDetails.notifications.unreadMessages}})
            .then(() => console.log("Updated"))
            .catch(() => console.log("Failed to update"));
    }

    const handleUnreadMessagesNotificationsClick = (e: ChangeEvent<HTMLInputElement>) => {
        setUnreadMessagesNotificationsEnabled(e.target.checked);
        if (userDetails && user) {
            updateUserDetails(user.uid, {notifications: {news: userDetails.notifications.news, offers: userDetails.notifications.offers, unreadMessages: e.target.checked}})
                .then(() => console.log("Updated"))
                .catch(() => console.log("Failed to update"));
        }
    }

    const handleDarkModeClick = (e: ChangeEvent<HTMLInputElement>) => {
        setDarkMode(e.target.checked);
        let newTheme = e.target.checked ? "dark" : "light";
        loadTheme(newTheme);
        localStorage.setItem("colorTheme", newTheme);
    }

    return (
        <Container className="global-container">
            <Row>
                <Col md="auto" style={{padding: 0}}>
                    <Navigator />
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
                                    <InputGroup>
                                        <Form.Control type="text" disabled={!isEditingName} value={nameInput} onChange={handleNameInputChange} placeholder="Name" />
                                        <Button onClick={handleEditingName}>{isEditingName ? "Save" : "Edit"}</Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="settings-section">
                                <Col sm={4}>
                                    <p>Date of Birth</p>
                                </Col>
                                <Col sm={8}>
                                    <InputGroup>
                                        <Form.Control type="date" value={dateOfBirthInput} onChange={handleDobInputChange} disabled={!isEditingDob} />
                                        <Button onClick={handleEditingDob}>{isEditingDob ? "Save" : "Edit"}</Button>
                                    </InputGroup>
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
                                        checked={emailNotificationsEnabled}
                                        onChange={handleEmailNotificationClick}
                                    />
                                    <Form.Check 
                                        type="switch"
                                        id="custom-switch"
                                        label="SMS"
                                        checked={smsNotificationsEnabled}
                                        onChange={handleSMSNotificationClick}
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
                                        checked={offersNotificationsEnabled}
                                        onChange={handleOffersNotificationsClick}
                                    />
                                    <Form.Check 
                                        type="switch"
                                        id="custom-switch"
                                        label="News"
                                        checked={newsNotificationsEnabled}
                                        onChange={handleNewsNotificationsClick}
                                    />
                                    <Form.Check 
                                        type="switch"
                                        id="custom-switch"
                                        label="Unread Messages"
                                        checked={unreadMessagesNotificationsEnabled}
                                        onChange={handleUnreadMessagesNotificationsClick}
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
                                        checked={darkMode}
                                        onChange={handleDarkModeClick}
                                    />
                                </Col>
                            </Row>
                            <hr />
                            <Row className="settings-section">
                                <Col sm={4}>
                                    Privacy
                                </Col>
                                <Col sm={8}>
                                    <a className="link" href="/">Privacy Policy <ArrowRight /></a>
                                    <a className="link" href="/">Cookie Policy <ArrowRight /></a>
                                </Col>
                            </Row>
                            <hr />
                            <Row className="settings-section">
                                <Col sm={4}>
                                    Legal
                                </Col>
                                <Col sm={8}>
                                    <a className="link" href="/">Terms and Conditions <ArrowRight /></a>
                                    <a className="link" href="/">Licenses <ArrowRight /></a>
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