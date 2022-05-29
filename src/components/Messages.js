import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { logout } from "../api/auth-api";

import Navigator from "./Navigator";
import Header from "./Header";

import "./Messages.css";
import { getAllConversations, getConversation } from "../api/message-api";
import { getUserDetails } from "../api/user-api";

export default function Messages() {
    const [user, loading, error] = useAuthState(auth);
    const [selectedConversation, selectConversation] = useState([]); // stores messages of current conversation in view
    const [conversations, setConversations] = useState([]); // stores array of {senderID, latestMessage} pairs for sidebar view
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");

        getAllConversations(user.uid, false).then(conversations => setConversations(conversations));
    }, [user, loading]);

    const clickConversation = (uid) => {
        getConversation(uid, user.uid).then(messages => selectConversation(messages));
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
                                        <div className="sidebar-message" onClick={() => clickConversation(convo.with)} key={index}>
                                            <SidebarMessage with={convo.with} message={convo.message} />
                                        </div>
                                    ))}
                                </div>
                                <div className="col-sm-9" id="conversation-col">
                                    <div id="conversation-header">
                                        <h5>Jake</h5>
                                    </div>
                                    {selectedConversation.map(message => (<Message message={message.message}/>))}
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
        <b>{name ?? props.with}</b><br />
        {props.message ?? "Message not found"}
    </>)
}

function Message(props) {
    return (<div className="message">
        {props.message}
    </div>)
}