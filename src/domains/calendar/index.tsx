import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { getCalendarEvents } from "../../api/booking-api";

import Navigator from "../navigator";
import Header from "../header";
import BookingOutline from "../booking-outline";

import "./Calendar.css";
import { Col, Container, Row, Table, Modal, Button } from "react-bootstrap";
import {Booking, Venue} from "../../api/types";
import {getVenueDetails} from "../../api/venue-api";

export default function Calendar() {
    const [user, loading, error] = useAuthState(auth);
    const [events, setEvents] = useState<Booking[]>([]);
    const [eventVenues, setEventVenues] = useState<Venue[]>([])
    const [selectedEvent, setSelectedEvent] = useState<Booking>();

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = (i: number) => {
        setSelectedEvent(events[i]);
        setShowModal(true);
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        
        getCalendarEvents(user.uid).then(
            async (bookings: Booking[]) => {
                setEvents(bookings);

                let venues: Venue[] = []
                for (let i = 0; i < bookings.length; i++) {
                    await getVenueDetails(bookings[i].venue).then(venue => venues.push(venue));
                }
                setEventVenues(venues);
            });
    }, [user, loading, navigate]);

    return (
        <>
            <Container className="m-0 p-0">
                <Row>
                    <Col xs={1}>
                        <Navigator />
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
                                        <td className="calendar-cell">{eventVenues[index].name}</td>
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
                    Booking Outline
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

