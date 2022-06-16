import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { getCalendarEvents } from "../api/booking-api";

import Navigator from "./Navigator";
import Header from "./Header";
import BookingOutline from "./BookingOutline";

import "./Calendar.css";
import { Col, Container, Row, Table, Modal, Button } from "react-bootstrap";

export default function Calendar() {
    const [user, loading, error] = useAuthState(auth);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = (i) => {
        setSelectedEvent(events[i]);
        setShowModal(true);
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        
        getCalendarEvents(user.uid).then((data) => {setEvents(data); console.log(data);});
    }, [user, loading]);

    return (
        <>
            <Container className="m-0 p-0">
                <Row>
                    <Col xs={1}>
                        <Navigator uid={user ? user.uid : ""} />
                    </Col>
                    <Col xs={11}>
                        <Header title={"Calendar"}/>

                        <h1 style={{margin: '1vw'}}>Upcoming bookings:</h1>

                        <Table striped>
                            <thead>
                                <tr>
                                    <th scope="col" className="calendar-cell">Date</th>
                                    <th scope="col" className="calendar-cell">Venue</th>
                                    <th scope="col" className="calendar-cell">Time</th>
                                    <th scope="col" className="calendar-cell">Fee</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event, index) => (
                                    <tr key={index}>
                                        <td className="calendar-cell">{event.startTime.toDate().toLocaleDateString()}</td>
                                        <td className="calendar-cell">{event.venue.name}</td>
                                        <td className="calendar-cell">{event.startTime.toDate().toLocaleTimeString()} - {event.endTime.toDate().toLocaleTimeString()}</td>
                                        <td className="calendar-cell">£{event.fee}</td>
                                        <td>
                                            <Button type="button" className="details-button" onClick={() => handleShowModal(index)}>
                                                Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Booking - {selectedEvent ? selectedEvent.uid : "Loading..."}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <BookingOutline booking={selectedEvent}/>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

