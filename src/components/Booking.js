import React, { useState } from "react";
import { Button, Container, Form, Row, InputGroup, DropdownButton, Dropdown, Col, FormControl } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Booking.css";
import Header from "./Header";
import Navigator from "./Navigator";


export default function Booking() {

    const { bookingID } = useParams(); 
    const [user, loading, error] = useAuthState(auth);

    const [eventName, setEventName] = useState("");
    const [venues, setVenues] = useState([{name: "the vic"}, {name: "the rav"}, {name: "lupo's"}]);

    const [selectedVenue, setSelectedVenue] = useState(null);

    const eventTypes = ["Wedding", "Bar Mitzvah", "Corporate Event", "Concert Hall", "House Party", "Restaurant gig", "Night club", "School dance", "Garden party", "Funeral", "Other"];
    const [eventType, setEventType] = useState(null);
    const [otherEventType, setOtherEventType] = useState("");
    const eventTypeChanged = e => {
        if (e.target.value != "Other") setOtherEventType("");
        setEventType(e.target.value);
    }

    const genres = ["Acoustic", "Alternative Rock", "Bluegrass", "Ceilidh", "Children's Music", "Christian", "Classic Rock", "Classical", "Country", "Disco", "Folk", "Funk", "Gospel Music", "Grunge", "Heavy Metal",  "Hip Hop", "House", "Indie Rock", "Jazz", "Latin", "Opera", "Pop", "Punk Rock", "R&B",  "Rap", "Reggae", "Soca", "World Music"];
    const [genre, setGenre] = useState(null);
    const [otherGenre, setOtherGenre] = useState("");
    const genreChanged = e => {
        if (e.target.value != "Other") setOtherGenre("");
        setGenre(e.target.value);
    }

    const [minFee, setMinFee] = useState(0);
    const [maxFee, setMaxFee] = useState(0);
    const [strictFeeRange, setStrictFeeRange] = useState(false);

    return (
        <Container className="m-0 p-0">
            <Row>
                <div className="col-sm-1">
                    <Navigator uid={user ? user.uid : ""} />
                </div>

                <div className="col-sm-11">
                    <Header title={`Booking - ${bookingID}`}/>

                    <Form style={{padding: "2vw"}}>

                        <p className="label"><b>Event Organiser</b></p>
                        <InputGroup>
                            <div id="event-organiser-group">
                                <Form.Label id="organiser-name">Jake Bill</Form.Label>
                                <Button>View Profile</Button>
                            </div>
                        </InputGroup>

                        <Form.Group>
                            <Form.Label className="label"><b>Event Name</b></Form.Label>
                            <Form.Control type="text" placeholder="Name" value={eventName} onChange={e => setEventName(e.target.value)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="label"><b>Venue</b></Form.Label>
                            <InputGroup className="mb-3">
                                    <DropdownButton
                                        variant="outline-secondary"
                                        title={selectedVenue ? selectedVenue.name : "Select Venue"}
                                        id="input-group-dropdown-1"
                                    >
                                        {venues.map((venue, index) => (
                                            <Dropdown.Item key={index} onClick={() => setSelectedVenue(venue)}>{venue.name}</Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                            </InputGroup>                        
                        </Form.Group>

                        <p className="label"><b>Address:</b></p>
                        <p>20 avenue drive<br />KY16 8AF</p>

                        <Form.Group>
                            <Form.Label className="label"><b>Event Type</b></Form.Label>
                            
                            <InputGroup className="mb-3">
                                    <DropdownButton
                                        variant="outline-secondary"
                                        title={eventType ? eventType : "Select Event Type"}
                                        id="input-group-dropdown-1"
                                    >
                                        {eventTypes.map((eventType, index) => (
                                            <Dropdown.Item key={index} onClick={() => setEventType(eventType)}>{eventType}</Dropdown.Item>
                                        ))}
                                    </DropdownButton>

                                    {(eventType && eventType == "Other") && (<Form.Control type="text" value={otherEventType} onChange={e => setOtherEventType(e.target.value)} placeholder="Briefly describe the event type"/>)}
                            </InputGroup>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="label"><b>Musical Genre</b></Form.Label>
                            
                            <InputGroup className="mb-3">
                                    <DropdownButton
                                        variant="outline-secondary"
                                        title={genre ? genre : "Select Genre"}
                                        id="input-group-dropdown-1"
                                    >
                                        {genres.map((g, index) => (
                                            <Dropdown.Item key={index} onClick={() => setGenre(g)}>{g}</Dropdown.Item>
                                        ))}
                                    </DropdownButton>

                                    {(genre && genre == "Other") && (<Form.Control type="text" value={otherGenre} onChange={e => setOtherGenre(e.target.value)} placeholder="Genre description"/>)}
                            </InputGroup>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="label"><b>Fee Range</b></Form.Label>
                            
                            <Container>
                                <Row>
                                    <Col>
                                        <Form.Label>Min</Form.Label>
                                    </Col>
                                    <Col>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>£</InputGroup.Text>
                                            <FormControl aria-label="Amount" type="number" value={minFee} onChange={e => setMinFee(e.target.value)} />
                                            <InputGroup.Text>.00</InputGroup.Text>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Label>Max</Form.Label>
                                    </Col>
                                    <Col>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>£</InputGroup.Text>
                                            <FormControl aria-label="Amount" type="number" value={maxFee} onChange={e => setMaxFee(e.target.value)} />
                                            <InputGroup.Text>.00</InputGroup.Text>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Container>

                            <Form.Check type="checkbox" label="Strict fee range (disallow offers outside of this range)" checked={strictFeeRange} onChange={(e) => setStrictFeeRange(e.target.checked)} />
                        </Form.Group>

                    </Form>
                </div>
            </Row>
        </Container>
    );
}