import React, { ChangeEvent, useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { Send } from "react-bootstrap-icons";
import { Button, Container, Navbar, Row, Col } from "react-bootstrap";
import Navigator from "../navigator";
import Header from "../header";

import "./Messages.css";

import { useGetAllConversations } from "../../api/message-api";
import { useUserDetails } from "../../api/user-api";
import { populateVenueDetails, useVenuesDetails } from "../../api/venue-api";
import {
  Conversation,
  ConversationPreview,
  Message,
  Venue
} from "../../api/types";
import BookingRequestModal from "./components/booking-request-modal";
import MessageView from "./components/message-view";
import SidebarMessage from "./components/sidebar-message";

export default function Messages() {

  // User details
  const [user, loading, error] = useAuthState(auth);
  const [userDetails, userDetailsLoading, userDetailsError] = useUserDetails(user?.uid!);
  const [hostVenues, hostVenuesLoading, hostVenuesError] = useVenuesDetails(userDetails?.venues!);
  const [isHost, setIsHost] = useState(false);


  const [conversationData, conversationsLoading, conversationError] = useGetAllConversations(userDetails?.uid!, isHost);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>();

  const [newMessage, setNewMessage] = useState<string>("");

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleSendBookingRequestClicked = () => handleShowModal();

  const sendBookingRequest = () => {
    console.error("Not yet implemented");
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (userDetails) setIsHost(userDetails.type.includes("host"));
  }, [userDetails]);

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => setNewMessage(event.currentTarget.value);

  const handleSendMessage = () => {
    if (newMessage.length !== 0) {
      // const host = selectedConversation[0].host;
      // const performer = selectedConversation[0].performer;
      //
      // sendNewMessage(host, performer, isHost, newMessage).then(
      //   (newMessage: Message) => {
      //     setNewMessage("");
      //     setSelectedConversation([...selectedConversation, newMessage]);
      //   }
      // );
    }
  };

  const modal = {handleShowModal, handleCloseModal, showModal, hostVenues, sendBookingRequest};

  // @ts-ignore
  return (
    <>
      <Container className="global-container">
        <Row>
          <Col md="auto" style={{ padding: 0 }}>
            <Navigator />
          </Col>
          <Col style={{ padding: 0 }}>
            <Header title={"Messages"} />
            <div id="messages-container">
              <Container id="inner-grid-container">
                <Row id="inner-grid-row">
                  <div className="col-sm-3 sidebar">
                    <Navbar
                      className="justify-content-between navbar-light w-100"
                      id="messages-navbar"
                    >
                      <p className="m-3 p-0">Messages</p>

                      <form className="form-inline my-2 my-lg-0">
                        <Button
                          id="plus-message"
                          variant="outlined"
                          onClick={() => {}}
                        >
                          +
                        </Button>
                      </form>
                    </Navbar>

                    {conversationsLoading && (
                      <div className="message-sidebar-status">
                        <b>Loading Messages...</b>
                      </div>
                    )}

                    {/*{!conversationsLoading && conversationData!.length === 0 && (*/}
                    {/*  <div className="message-sidebar-status">*/}
                    {/*    <b>*/}
                    {/*      No messages <br />*/}
                    {/*      <br />*/}
                    {/*      Click the + icon to start the conversation*/}
                    {/*    </b>*/}
                    {/*  </div>*/}
                    {/*)}*/}

                    {conversationData &&
                      conversationData.map((convo, index) => (
                        <div key={index}>
                          <SidebarMessage
                            other={isHost ? convo.performer : convo.host}
                            message={convo.messages[0].message}
                            setSelected={() => setSelectedConversation(convo)}
                          />
                        </div>
                      ))}
                  </div>
                  <div className="col-sm-9" id="conversation-col">
                    {selectedConversation != null && (
                      <>
                        <div id="conversation-header">
                          <h5>{"messengerName"}</h5>

                          {isHost && (
                            <Button
                              variant="primary"
                              onClick={handleSendBookingRequestClicked}
                            >
                              Send Booking Request
                            </Button>
                          )}
                        </div>

                        {selectedConversation.messages.map((message: Message) => (
                          <MessageView
                            key={message.message}
                            message={message}
                            sentByCurrentUser={message.isHostSender === isHost}
                          />
                        ))}

                        <div id="conversation-footer">
                          <div className="input-group rounded">
                            <input
                              type="text"
                              className="form-control new-message-box"
                              placeholder="New Message..."
                              aria-label="New Message..."
                              aria-describedby="new-message"
                              value={newMessage}
                              onChange={handleMessageChange}
                            />
                            <span
                              className="input-group-text border-0"
                              id="new-message"
                            >
                              <Send
                                id="send-icon"
                                onClick={handleSendMessage}
                              />
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

      <BookingRequestModal {...modal}/>
    </>
  );
}

