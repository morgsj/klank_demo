import { Button, Modal } from "react-bootstrap";
import BookingOutline from "../../../common/booking-outline";
import React, { useState } from "react";
import { Booking, Venue } from "../../../../api/types";

interface BookingRequestModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
  handleShowModal: () => void;
  hostVenues: Venue[] | undefined;
  sendBookingRequest: () => void;
}
export default function BookingRequestModal({
  showModal,
  handleCloseModal,
  handleShowModal,
  hostVenues,
  sendBookingRequest
}: BookingRequestModalProps) {

  const [booking, setBooking] = useState<Booking>();
  const [isCreatingBooking, setIsCreatingBooking] = useState(true);

  const handleBookingEdit = (booking: Booking) => setBooking(booking);

  if (!hostVenues) return (<></>)

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>New Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BookingOutline
          booking={booking!}
          fieldsChanged={handleBookingEdit}
          venues={hostVenues}
          isCreatingBooking={isCreatingBooking}
        />
      </Modal.Body>
      <Modal.Footer>
        {isCreatingBooking && (
          <Button variant="primary" onClick={sendBookingRequest}>
            Send
          </Button>
        )}

        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}