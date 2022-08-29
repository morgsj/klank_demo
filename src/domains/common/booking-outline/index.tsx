import React, { useState } from "react";
import {
  Container,
  Table,
  InputGroup,
  FormControl,
  Form,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

import "./BookingOutline.css";
import { Booking, Venue } from "../../../api/types";

interface BookingOutlineProps {
  venues: Venue[];
  isCreatingBooking: boolean;
  booking: Booking;
  fieldsChanged: (_: any) => void;
}

export default function BookingOutline(props: BookingOutlineProps) {
  // Modal state values
  const [venue, setVenue] = useState<Venue>(props.venues[0]);
  const handleVenueChange = (venue: Venue) => setVenue(venue);

  const [notes, setNotes] = useState("");
  const handleNotesChange = (e: any) => {
    setNotes(e.target.value);
    callFieldsChanged();
  };

  const [fee, setFee] = useState("");
  const handleFeeChange = (e: any) => {
    setFee(e.target.value);
    callFieldsChanged();
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [date, setDate] = useState(today);
  const handleDateChange = (e: any) => {
    const dateValue = e.target.value.split("-");
    const obj = date;
    obj.setMonth(dateValue[1]);
    obj.setDate(dateValue[2]);
    setDate(obj);
    callFieldsChanged();
  };

  const [startTime, setStartTime] = useState(date);
  const handleStartTimeChange = (e: any) => {
    const time = e.target.value.split(":");
    const seconds = (time[0] * 60 + time[1]) * 60;

    const obj = new Date(date);
    obj.setTime(seconds * 1000);

    setStartTime(obj);
    callFieldsChanged();
  };

  const [endTime, setEndTime] = useState(date);
  const handleEndTimeChange = (e: any) => {
    const time = e.target.value.split(":");
    const seconds = (time[0] * 60 + time[1]) * 60;

    const obj = new Date();
    obj.setMonth(date.getMonth());
    obj.setDate(date.getDate());
    obj.setTime(seconds * 1000);

    setEndTime(obj);
    callFieldsChanged();
  };

  const callFieldsChanged = () =>
    props.fieldsChanged({
      fee,
      notes,
      date,
      startTime,
      endTime,
      venue: venue.uid,
    });

  if (!props.isCreatingBooking) {
    return (
      <Container className="w-100">
        <Table>
          <tbody>
            <tr>
              <td>
                <b>Date:</b>
                <br />
                {props.booking.startTime.toDate().toLocaleDateString()}
              </td>
              <td>
                <b>Fee:</b>
                <br />£{props.booking.fee}
              </td>
            </tr>
            <tr>
              <td>
                <b>Time:</b>
                <br />
                22:00-02:00BROKEN
              </td>
              <td rowSpan={3}>
                <b>Notes:</b>
                <br />
                <textarea
                  className="form-control"
                  id="notesTextArea"
                  value={props.booking.notes}
                  rows={8}
                  disabled
                ></textarea>
              </td>
            </tr>
            <tr>
              <td>
                <b>Venue:</b>
                <br />
                The Vic
              </td>
            </tr>
            <tr>
              <td rowSpan={2}>
                <iframe
                  src={`https://maps.google.com/maps?q='+${venue.location.latitude}+','+${venue.location.longitude}+'&hl=en&z=14&output=embed`}
                  style={{ border: 0, width: "100%" }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="map"
                />
              </td>
            </tr>
            <tr>
              <td>
                <button className="btn orange-button">
                  Message Venue Organiser
                </button>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    );
  } else {
    return (
      <Container className="w-100">
        <Table>
          <tbody>
            <tr>
              <td>
                <b>Date:</b>
                <br />
                <Form.Group controlId="bookingDate">
                  <Form.Control
                    type="date"
                    name="bookingDate"
                    placeholder="Booking date"
                    value={date.toISOString().split("T")[0]}
                    onChange={handleDateChange}
                  />
                </Form.Group>
              </td>
              <td>
                <b>Fee:</b>
                <br />
                <InputGroup className="mb-3">
                  <InputGroup.Text>£</InputGroup.Text>
                  <FormControl
                    aria-label="Amount (to the nearest pound)"
                    value={fee}
                    onChange={handleFeeChange}
                  />
                  <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>
              </td>
            </tr>
            <tr>
              <td>
                <b>Time:</b>
                <br />
                Start Time:
                <Form.Group controlId="bookingStartTime">
                  <Form.Control
                    type="time"
                    name="bookingStartTime"
                    placeholder="Date of Birth"
                    value={startTime.toLocaleTimeString()}
                    onChange={handleStartTimeChange}
                  />
                </Form.Group>
                End Time:
                <Form.Group controlId="bookingEndTime">
                  <Form.Control
                    type="time"
                    name="bookingEndTime"
                    placeholder="Date of Birth"
                    value={endTime.toLocaleTimeString()}
                    onChange={handleEndTimeChange}
                  />
                </Form.Group>
              </td>
              <td rowSpan={3}>
                <b>Notes (provided equipment, etc.):</b>
                <br />
                <textarea
                  className="form-control"
                  id="notesTextArea"
                  value={notes}
                  rows={8}
                  onChange={handleNotesChange}
                ></textarea>
              </td>
            </tr>
            <tr>
              <td>
                <b>Venue:</b>
                <br />
                <InputGroup className="mb-3">
                  <DropdownButton
                    variant="outline-secondary"
                    title={venue.name}
                    id="input-group-dropdown-1"
                  >
                    {props.venues.map((venue, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() => handleVenueChange(venue)}
                      >
                        {venue.name}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </InputGroup>
              </td>
            </tr>
            <tr>
              <td>
                <iframe
                  src={`https://maps.google.com/maps?q='+0+','+0+'&hl=en&z=14&output=embed`}
                  style={{ border: 0, width: "100%" }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    );
  }
}
