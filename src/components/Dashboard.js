import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

import Header from "./Header";
import Navigator from "./Navigator";
import "./Dashboard.css";
import { Search, MusicNoteList, ChatSquareDots, PersonCheck } from "react-bootstrap-icons";

import { updateProfile } from "firebase/auth";
import { getUserDetails } from "../api/user-api";
import { Col, Container, Row } from "react-bootstrap";

export default function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        else getUserDetails(user.uid).then(ud => setName(ud.name));
    }, [user, loading]);

    return (
        <Container className="global-container">
            <Row>
                <Col md="auto" style={{padding: 0}}>
                    <Navigator uid={user ? user.uid : ""} />
                </Col>
                <Col style={{padding: 0}}>
                    <Header title={"Dashboard "}/>
                    
                    <h1 style={{margin: '3vw', fontSize: 50}}><i><b>Welcome back {name.split(" ")[0]}</b></i></h1>

                    <div className="container">
                        <div className="row">
                            <div className="col-sm">
                                <ViewCalendar navigate={navigate} />
                            </div>
                            <div className="col-sm">
                                <EditProfile navigate={navigate} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm">
                                <MessageRequests navigate={navigate} />
                            </div>
                            <div className="col-sm">
                                <ViewNearbyGigs navigate={navigate} />
                            </div>
                        </div>
                    </div>

                </Col>
            </Row>
        </Container>
    );
}

function ViewNearbyGigs(props) {
    return (
        <div className="dashboard-box">
            <div className="container" onClick={() => props.navigate("/search")}>
                <div className="row action-message">
                    3 venues in your area looking for a DJ
                </div>
                <div className="row">
                    <Search className="dashboard-icon"/>
                </div>
                <div className="row action-description">
                    View nearby gigs
                </div>
            </div>
        </div>
    );
}

function MessageRequests(props) {
    return (
        <div className="dashboard-box">

            <div className="container" onClick={() => props.navigate("/messages")}>
                <div className="row action-message">
                    3 message requests
                </div>
                <div className="row">
                    <ChatSquareDots className="dashboard-icon"/>
                </div>
                <div className="row action-description">
                    View Messages
                </div>
            </div>
            
        </div>
    );
}

function EditProfile(props) {
    return (
        <div className="dashboard-box">

            <div className="container" onClick={() => props.navigate("/profile")}>
                <div className="row action-message">
                    Improve your profile
                </div>
                <div className="row">
                    <PersonCheck className="dashboard-icon"/>
                </div>
                <div className="row action-description">
                    Edit Profile
                </div>
            </div>
            
        </div>
    );
}

function ViewCalendar(props) {
    return (
        <div className="dashboard-box">

            <div className="container" onClick={() => props.navigate("/calendar")}>
                <div className="row action-message">
                    3 upcoming gigs
                </div>
                <div className="row">
                    <MusicNoteList className="dashboard-icon"/>
                </div>
                <div className="row action-description">
                    View Calendar
                </div>
            </div>
        
        </div>
    );
}