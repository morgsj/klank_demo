import React, { ChangeEvent, useState } from "react";
import { Button } from "react-bootstrap";
import { Conversation, Message } from "../../../../api/types";
import MessageView from "../message-view";
import { Send } from "react-bootstrap-icons";
import { useUserDetails } from "../../../../api/user-api";
import { Field, Form, Formik } from "formik";

interface ConversationPanelProps {
  isHost: boolean;
  handleSendBookingRequestClicked: () => void;
  selectedConversation: Conversation;
}
export default function ConversationPanel({
  isHost,
  handleSendBookingRequestClicked,
  selectedConversation
}: ConversationPanelProps) {
  const other = isHost ? selectedConversation.performer : selectedConversation.host;
  const [otherUserDetails, otherUserLoading, otherUserError] = useUserDetails(other);

  const [newMessage, setNewMessage] = useState<string>("");
  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => setNewMessage(event.currentTarget.value);
  const handleSendMessage = (values: {newMessage: string}) => {
    console.log(values.newMessage)
  };

  return (
    <>
      <div id="conversation-header">
        <h5>{otherUserDetails?.name}</h5>

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

          <Formik initialValues={{newMessage: ""}} onSubmit={handleSendMessage}>
            {() => (
              <Form>
                <Field
                  type="text"
                  id="newMessage"
                  name="newMessage"
                  className="form-control new-message-box"
                />
                <span
                  className="input-group-text border-0"
                  id="new-message"
                >
                  <Button type="submit">
                    <Send id="send-icon" />
                  </Button>
                </span>
              </Form>
            )}
          </Formik>

        </div>
      </div>
    </>
  )
}