import { Message } from "../../../../api/types";
import { Container, Row } from "react-bootstrap";
import React from "react";

interface MessageProps {
  message: Message;
  sentByCurrentUser: boolean;
}
export default function MessageView({ message, sentByCurrentUser }: MessageProps) {
  if (!message) return <></>;
  if (!sentByCurrentUser) {
    return (
      <div className="message-container">
        <div className="message" style={{ backgroundColor: "var(--accent4)" }}>
          {/*{message.isRequest ? (<Button variant="primary" onClick={() => handleViewBookingRequest(message.request)}>View Booking Request</Button>) : message.message}*/}
          {message.message}
        </div>
        <p className="message-time">
          {removeSeconds(message.time.toDate().toLocaleTimeString())}
        </p>
      </div>
    );
  } else {
    return (
      <div
        className="message-container"
        style={{
          display: "flex",
          justifyContent: "right",
          alignContent: "right",
        }}
      >
        <Container>
          <Row
            style={{
              display: "flex",
              justifyContent: "right",
              alignContent: "right",
            }}
          >
            <div
              className="message"
              style={{ backgroundColor: "var(--accent2)", display: "flex" }}
            >
              {/*{message.isRequest ? (<Button variant="primary" onClick={() => handleViewBookingRequest(message.request)}>View Booking Request</Button>) : message.message}*/}
              {message.message}
            </div>
          </Row>
          <Row
            style={{
              display: "flex",
              justifyContent: "right",
              alignContent: "right",
            }}
          >
            <p className="message-time">
              {removeSeconds(message.time.toDate().toLocaleTimeString())}
            </p>
          </Row>
        </Container>
      </div>
    );
  }
}

function removeSeconds(dateStr: string) {
  return dateStr.substring(0, dateStr.length - 3);
}