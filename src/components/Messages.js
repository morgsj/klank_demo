import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { Send } from "react-bootstrap-icons";
import { Button, Container, Navbar, Row, Modal } from "react-bootstrap";

import Navigator from "./Navigator";
import Header from "./Header";
import BookingOutline from "./BookingOutline";

import "./Messages.css";

import { getAllConversations, getConversation, sendNewMessage } from "../api/message-api";
import { getUserDetails } from "../api/user-api";
import { getVenueDetails } from "../api/venue-api";
import { Timestamp } from "firebase/firestore";

export default function Messages() {
    const [user, loading, error] = useAuthState(auth);
    const [userDetails, setUserDetails] = useState(null);
    const [hostVenues, setHostVenues] = useState([]);
    const [isHost, setIsHost] = useState(false);
    const [selectedConversation, selectConversation] = useState(null); // stores messages of current conversation in view
    const [conversations, setConversations] = useState(null); // stores array of {senderID, latestMessage} pairs for sidebar view
    const [messagerName, setMessagerName] = useState("");
    const [newMessage, setNewMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const [booking, setBooking] = useState(null);
    const [isCreatingBooking, setIsCreatingBooking] = useState(false);
    const handleBookingEdit = (booking) => {setBooking(booking); console.log(booking);}

    const sendBookingRequest = () => {
        const host = selectedConversation[0].host;
        const performer = selectedConversation[0].performer;
        const isHostSender = isHost;
        const isRequest = true;
        const request = booking;
        const message = "";

        request.startTime = Timestamp.fromDate(request.startTime);
        request.endTime = Timestamp.fromDate(request.endTime);
        request.date = Timestamp.fromDate(request.date);

        sendNewMessage(host, performer, isHostSender, isRequest, message, request).then(data => {
            setNewMessage("");
            selectConversation([... selectedConversation, data]);
        }).then(handleCloseModal);
    }

    const handleSendBookingRequestClicked = () => {
        setBooking(null);
        setIsCreatingBooking(true);
        handleShowModal();
    }

    const handleViewBookingRequest = (response) => {
        let bookingRequest = response;
        getVenueDetails(bookingRequest.venue).then(data => {
            bookingRequest.venue = data;
            setBooking(bookingRequest);
            setIsCreatingBooking(false);
            handleShowModal();
        });
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        else getUserDetails(user.uid).then((data) => {
            setUserDetails(data);
            setIsHost(data.type.includes("host"));
            getAllConversations(user.uid, data.type.includes("host")).then(conversations => setConversations(conversations));
            if (data.type.includes("host")) {
                data.venues.forEach(venueID => getVenueDetails(venueID).then(venue => setHostVenues([... hostVenues, venue])));
            }
        });
    }, [user, loading]);

    const clickConversation = (uid, name) => {

        let host, performer;
        if (isHost) {host = user.uid; performer = uid;}
        else {performer = user.uid; host = uid;}

        getConversation(host, performer).then(messages => {
            selectConversation(messages);
            setMessagerName(name);
        });
    };

    const handleMessageChange = (event) => setNewMessage(event.target.value);

    const handleSendMessage = () => {
        if (newMessage.length != 0) {

            const host = selectedConversation[0].host;
            const performer = selectedConversation[0].performer;
            const isHostSender = isHost;
            const isRequest = false;
            const request = null;
            const message = newMessage;
            
            sendNewMessage(host, performer, isHostSender, isRequest, message, request).then(data => {
                setNewMessage("");
                selectConversation([... selectedConversation, data]);
            });

        }
    };

    return (<>
        <Container className="m-0 p-0">
            <Row>
                <div className="col-sm-1">
                    <Navigator />
                </div>
                <div className="col-sm-11">
                    <Header title={"Messages"}/>
                    <div id="messages-container">
                        <Container id="inner-grid-container">
                            <Row id="inner-grid-row">
                                <div className="col-sm-3 sidebar">

                                    <Navbar className="justify-content-between navbar-light w-100" style={{backgroundColor: "gainsboro"}}>
                                        <p className="m-3 p-0">Messages</p>
                                        
                                        <form className="form-inline my-2 my-lg-0">
                                            <button className="btn" onClick={() => {}}>+</button>
                                        </form>
                                    </Navbar>

                                    {conversations == null && (<p>Loading Messages...</p>)}

                                    {conversations != null && conversations.map((convo, index) => (
                                        <div key={index}>
                                            <SidebarMessage with={convo.with} message={convo.message} selected={(name) => clickConversation(convo.with, name)} />
                                            <hr />
                                        </div>
                                    ))}
                                </div>
                                <div className="col-sm-9" id="conversation-col">

                                    {selectedConversation != null && (
                                        <>
                                            <div id="conversation-header">
                                                <h5>{messagerName}</h5>

                                                {isHost && (
                                                    <Button variant="primary" onClick={handleSendBookingRequestClicked}>Send Booking Request</Button>
                                                )}
                                            </div>

                                            {selectedConversation.map((message, index) => (<Message key={index} message={message} sentByCurrentUser={message.isHostSender == isHost} handleViewBookingRequest={handleViewBookingRequest}/>))}

                                            <div id="conversation-footer">
                                                <div className="input-group rounded">
                                                    <input  type="text" 
                                                            className="form-control new-message-box" 
                                                            placeholder="New Message..." 
                                                            aria-label="New Message..." 
                                                            aria-describedby="new-message"
                                                            value={newMessage}
                                                            onChange={handleMessageChange}/>
                                                    <span className="input-group-text border-0" id="new-message">
                                                        <Send id="send-icon" onClick={handleSendMessage}/>
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    

                                </div>
                            </Row>
                        </Container>

                    </div>
                </div>
            </Row>
        </Container>
        

        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>New Booking</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <BookingOutline booking={booking} fieldsChanged={handleBookingEdit} venues={hostVenues} isCreatingBooking={isCreatingBooking} />

            </Modal.Body>
            <Modal.Footer>

                {isCreatingBooking && (<Button variant="primary" onClick={sendBookingRequest}>
                    Send
                </Button>)}
                
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>);
}

function SidebarMessage(props) {
    const [name, setName] = useState("");

    useEffect(() => {
        getUserDetails(props.with).then(data => setName(data.name));
    })

    return (<>
        <div className="sidebar-message" onClick={() => props.selected(name)}>
            <b>{name ?? props.with}</b><br />
            {props.message ?? "Message not found"}
        </div>
    </>)
}

function removeSeconds(dateStr) {
    return dateStr.substring(0, dateStr.length - 3);
}


function Message(props) {
    if (!props.message) return (<></>);
    if (!props.sentByCurrentUser) {
        return (
            <div className="message-container">
                <div className="message" style={{backgroundColor: 'gainsboro'}}>
                    {props.message.isRequest ? (<Button variant="primary" onClick={() => props.handleViewBookingRequest(props.message.request)}>View Booking Request</Button>) : props.message.message}
                </div>
                <p className="message-time">{removeSeconds(props.message.time.toDate().toLocaleTimeString())}</p>
            </div>
        );
    } else {
        return (
            <div className="message-container" style={{display: 'flex', justifyContent: 'right', alignContent: 'right'}}>
                <Container>
                    <Row style={{display: 'flex', justifyContent: 'right', alignContent: 'right'}}>

                        <div className="message" style={{backgroundColor: 'orange', display: 'flex'}}>
                            {props.message.isRequest ? (<Button variant="primary" onClick={() => props.handleViewBookingRequest(props.message.request)}>View Booking Request</Button>) : props.message.message}
                        </div>

                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'right', alignContent: 'right'}}>
                        <p className="message-time">
                            {removeSeconds(props.message.time.toDate().toLocaleTimeString())}
                        </p>
                    </Row>
                </Container>
            </div>
        );
    }
}