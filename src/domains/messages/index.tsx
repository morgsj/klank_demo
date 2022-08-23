import React, {ChangeEvent, useEffect, useState} from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { Send } from "react-bootstrap-icons";
import { Button, Container, Navbar, Row, Modal, Col } from "react-bootstrap";

import Navigator from "../navigator";
import Header from "../header";
import BookingOutline from "../booking-outline";

import "./Messages.css";

import { getAllConversations, getConversation, sendNewMessage } from "../../api/message-api";
import { getUserDetails } from "../../api/user-api";
import {getVenueDetails, populateVenueDetails} from "../../api/venue-api";
import {Booking, ConversationPreview, Message, UID, UserDetails, Venue} from "../../api/types";

export default function Messages() {
    const [user, loading, error] = useAuthState(auth);
    const [userDetails, setUserDetails] = useState<UserDetails>();
    const [hostVenues, setHostVenues] = useState<Venue[]>([]);
    const [isHost, setIsHost] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState<Message[]>([]); // stores messages of current conversation in view
    const [conversations, setConversations] = useState<ConversationPreview[]>(); // stores array of {senderID, latestMessage} pairs for sidebar view
    const [messagerName, setMessagerName] = useState<string>("");
    const [newMessage, setNewMessage] = useState<string>("");

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const [booking, setBooking] = useState<Booking>();
    const [isCreatingBooking, setIsCreatingBooking] = useState(false);
    const handleBookingEdit = (booking: Booking) => setBooking(booking);

    const sendBookingRequest = () => {
        const host = selectedConversation[0].host;
        const performer = selectedConversation[0].performer;
        const isHostSender = isHost;
        const message = "";

        sendNewMessage(host, performer, isHostSender, message).then(data => {
            setNewMessage("");
            setSelectedConversation([...selectedConversation, data]);
        }).then(handleCloseModal);
    }

    const handleSendBookingRequestClicked = () => {
        setBooking(undefined);
        setIsCreatingBooking(true);
        handleShowModal();
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        else getUserDetails(user.uid).then((data) => {
            setUserDetails(data);
            
            setIsHost(data.type.includes("host"));

            populateVenueDetails(data.venues).then((venues: Venue[]) => setHostVenues(venues));

            console.log("about to get all convos");
            getAllConversations(user.uid, data.type.includes("host")).then(c => {console.log(c); setConversations(c);});
            
        });
    }, [user, loading, navigate]);

    const clickConversation = (uid: string, name: string) => {

        let host, performer;
        if (isHost) {host = user!.uid; performer = uid;}
        else {performer = user!.uid; host = uid;}

        getConversation(host, performer).then((messages: Message[]) => {
            setSelectedConversation(messages);
            setMessagerName(name);
        });
    };

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => setNewMessage(event.currentTarget.value);

    const handleSendMessage = () => {
        if (newMessage.length !== 0) {

            const host = selectedConversation[0].host;
            const performer = selectedConversation[0].performer;

            sendNewMessage(host, performer, isHost, newMessage).then((newMessage: Message) => {
                setNewMessage("");
                setSelectedConversation([...selectedConversation, newMessage]);
            });

        }
    };

    return (<>
        <Container className="global-container">
            <Row>
                <Col md="auto" style={{padding: 0}}>
                    <Navigator />
                </Col>
                <Col style={{padding: 0}}>
                    <Header title={"Messages"}/>
                    <div id="messages-container">
                        <Container id="inner-grid-container">
                            <Row id="inner-grid-row">
                                <div className="col-sm-3 sidebar">

                                    <Navbar className="justify-content-between navbar-light w-100" id="messages-navbar">
                                        <p className="m-3 p-0">Messages</p>
                                        
                                        <form className="form-inline my-2 my-lg-0">
                                            <Button id="plus-message" variant="outlined" onClick={() => {}}>+</Button>
                                        </form>
                                    </Navbar>

                                    {conversations == null && (
                                        <div className="message-sidebar-status"><b>Loading Messages...</b></div>
                                    )}

                                    {conversations != null && conversations.length === 0 && (
                                        <div className="message-sidebar-status"><b>
                                            No messages <br /><br />
                                            Click the + icon to start the conversation
                                        </b></div>
                                    )}

                                    {conversations != null && conversations.map((convo, index) => (
                                        <div key={index}>
                                            <SidebarMessage other={convo.with} message={convo.message} setSelected={(name: string) => clickConversation(convo.with, name)} />
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

                                            {selectedConversation.map((message: Message) => (<MessageView key={message.message} message={message} sentByCurrentUser={message.isHostSender === isHost} />))}

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
                </Col>
            </Row>
        </Container>
        

        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>New Booking</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <BookingOutline booking={booking!} fieldsChanged={handleBookingEdit} venues={hostVenues} isCreatingBooking={isCreatingBooking} />

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

interface SidebarMessageProps {
    other: UID;
    message: string;
    setSelected: (_: string) => void;
}
function SidebarMessage({other, message, setSelected}: SidebarMessageProps) {
    const [name, setName] = useState("");

    useEffect(() => {
        getUserDetails(other).then(data => setName(data.name));
    })

    return (<>
        <div className="sidebar-message" onClick={() => setSelected(name)}>
            <b>{name ?? other}</b><br />
            {message ?? "Message not found"}
        </div>
    </>)
}

function removeSeconds(dateStr: string) {
    return dateStr.substring(0, dateStr.length - 3);
}


interface MessageProps {
    message: Message;
    sentByCurrentUser: boolean;

}
function MessageView({message, sentByCurrentUser}: MessageProps) {
    if (!message) return (<></>);
    if (!sentByCurrentUser) {
        return (
            <div className="message-container">
                <div className="message" style={{backgroundColor: 'var(--accent4)'}}>
                    {/*{message.isRequest ? (<Button variant="primary" onClick={() => handleViewBookingRequest(message.request)}>View Booking Request</Button>) : message.message}*/}
                    {message.message}
                </div>
                <p className="message-time">{removeSeconds(message.time.toDate().toLocaleTimeString())}</p>
            </div>
        );
    } else {
        return (
            <div className="message-container" style={{display: 'flex', justifyContent: 'right', alignContent: 'right'}}>
                <Container>
                    <Row style={{display: 'flex', justifyContent: 'right', alignContent: 'right'}}>

                        <div className="message" style={{backgroundColor: 'var(--accent2)', display: 'flex'}}>
                            {/*{message.isRequest ? (<Button variant="primary" onClick={() => handleViewBookingRequest(message.request)}>View Booking Request</Button>) : message.message}*/}
                            {message.message}
                        </div>

                    </Row>
                    <Row style={{display: 'flex', justifyContent: 'right', alignContent: 'right'}}>
                        <p className="message-time">
                            {removeSeconds(message.time.toDate().toLocaleTimeString())}
                        </p>
                    </Row>
                </Container>
            </div>
        );
    }
}