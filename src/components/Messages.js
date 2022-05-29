import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { logout } from "../api/auth-api";

import Navigator from "./Navigator";
import Header from "./Header";

import "./Messages.css";
import { getAllConversations, getConversation, sendNewMessage } from "../api/message-api";
import { getUserDetails } from "../api/user-api";
import { Send } from "react-bootstrap-icons";

export default function Messages() {
    const [user, loading, error] = useAuthState(auth);
    const [userDetails, setUserDetails] = useState(null);
    const [selectedConversation, selectConversation] = useState([]); // stores messages of current conversation in view
    const [conversations, setConversations] = useState([]); // stores array of {senderID, latestMessage} pairs for sidebar view
    const [messagerName, setMessagerName] = useState("");
    const [newMessage, setNewMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        else getUserDetails(user.uid).then((data) => {
            setUserDetails(data);
            getAllConversations(user.uid, data.type.includes("host")).then(conversations => setConversations(conversations));
        });
    }, [user, loading]);

    const clickConversation = (uid, name) => {
        getConversation(uid, user.uid).then(messages => {
            selectConversation(messages);
            setMessagerName(name);
        });
    };

    const handleMessageChange = (event) => setNewMessage(event.target.value);

    const handleSendMessage = () => {
        if (newMessage.length != 0) {

            const host = selectedConversation[0].host;
            const performer = selectedConversation[0].performer;
            const isHostSender = false;
            const isRequest = false;
            const message = newMessage;
            

            sendNewMessage(host, performer, isHostSender, isRequest, message).then(data => {
                setNewMessage("");
                selectConversation([... selectedConversation, data]);
            });

        }
    };

    return (
        <div className="container m-0 p-0">
            <div className="row">
                <div className="col-sm-1">
                    <Navigator />
                </div>
                <div className="col-sm-11">
                    <Header title={"Messages"}/>
                    <div id="messages-container">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-3 sidebar">
                                    {conversations.map((convo, index) => (
                                        <SidebarMessage with={convo.with} message={convo.message} key={index} selected={(name) => clickConversation(convo.with, name)} />
                                    ))}
                                </div>
                                <div className="col-sm-9" id="conversation-col">
                                    <div id="conversation-header">
                                        <h5>{messagerName}</h5>
                                    </div>
                                    {selectedConversation.map((message, index) => (<Message key={index} message={message}/>))}

                                    <div id="conversation-footer">
                                        <div class="input-group rounded">
                                            <input  type="text" 
                                                    className="form-control new-message-box" 
                                                    placeholder="New Message..." 
                                                    aria-label="New Message..." 
                                                    aria-describedby="new-message"
                                                    value={newMessage}
                                                    onChange={handleMessageChange}/>
                                            <span class="input-group-text border-0" id="new-message">
                                                <Send id="send-icon" onClick={handleSendMessage}/>
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
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


function Message(props) {
    if (!props.message) return (<></>)
    
    if (props.message.isHostSender) {
        return (
            <div className="message-container">
                <div className="message" style={{backgroundColor: 'gainsboro'}}>
                    {props.message.message}
                </div>
                <p className="message-time">{props.message.time.toDate().toLocaleTimeString()}</p>
            </div>
        );
    } else {
        return (
            <div className="message-container" style={{display: 'flex', justifyContent: 'right', alignContent: 'right'}}>
                <div className="message" style={{backgroundColor: 'orange'}}>
                    {props.message.message}
                </div>
                <p className="message-time">{props.message.time.toDate().toLocaleTimeString()}</p>
            </div>
        );
    }
}