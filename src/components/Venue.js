import React, { useEffect, useState } from "react";
import { Button, Container, Form, Row, InputGroup, DropdownButton, Dropdown, Col, FormControl } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "./Header";
import Navigator from "./Navigator";
import { getUserDetails } from "../api/user-api";
import "./Venue.css";
import { GeoPoint } from "firebase/firestore";
import { createNewVenue } from "../api/venue-api";


export default function Booking() {

    const { venueID } = useParams(); 
    const [user, loading, error] = useAuthState(auth);
    const [userDetails, setUserDetails] = useState(null);

    const navigate = useNavigate();

    const [newVenue, setNewVenue] = useState(true);

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");

        setNewVenue(venueID == "new-venue");

        getUserDetails(user.uid).then(data => setUserDetails(data));
    }, [user, loading]);

    const createVenue = (venue) => {
        createNewVenue(venue).then(() => navigate("/calendar"));
    }

    return (
        <Container className="m-0 p-0">
            <Row>
                <div className="col-sm-1">
                    <Navigator uid={user ? user.uid : ""} />
                </div>

                <div className="col-sm-11">
                    <Header title={`Venue - ${newVenue ? "New Venue" : venueID}`}/>

                    {newVenue && <VenueCreator user={userDetails} navigate={navigate} createVenue={createVenue} />}
                    
                </div>
            </Row>
        </Container>
    );
}

function VenueCreator(props) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [postcode, setPostcode] = useState("");
    const [location, setLocation] = useState(new GeoPoint(0, 0));
    const [locationGuidance, setLocationGuidance] = useState("");

    return (
        <Form style={{padding: "2vw"}}>
            
            <Form.Label className="label"><b>Event Organiser</b></Form.Label><br />
            {props.user && (<Form.Label>{props.user.name}</Form.Label>)}
                        
            <Form.Group>
                <Form.Label className="label"><b>Venue Name</b></Form.Label>
                <Form.Control type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}/>
            </Form.Group>

            <Form.Group>
                <Form.Label className="label"><b>Description</b></Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}/>
            </Form.Group>

            <Form.Group>
                <Form.Label className="label"><b>Address</b></Form.Label>
                <Form.Control type="text" placeholder="Address Line 1" value={addressLine1} onChange={e => setAddressLine1(e.target.value)}/>
                <Form.Control type="text" placeholder="Address Line 2 (optional)" value={addressLine2} onChange={e => setAddressLine2(e.target.value)}/>
                <Form.Control type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)}/>
                <Form.Control type="text" placeholder="Postcode" value={postcode} onChange={e => setPostcode(e.target.value)}/>
            </Form.Group>

            <Form.Group>
                <Form.Label className="label"><b>Pinpoint location</b></Form.Label>
                <p className="small-print">Use the map to exactly define your location:</p>
                <p><i>NOT YET IMPLEMENTED</i></p>
            </Form.Group>

            <Form.Group>
                <Form.Label className="label"><b>Additional Location Guidance</b></Form.Label>
                <p className="small-print">Use this space to describe travel instructions for arriving at the venue:</p>
                <Form.Control as="textarea" rows={3} placeholder="Additional Location Guidance" value={locationGuidance} onChange={e => setLocationGuidance(e.target.value)}/>
            </Form.Group>
        
            <Button id="submit-button" onClick={() => {props.createVenue({organiser: props.user.uid, name, description, location, locationGuidance, address: {addressLine1, addressLine2, city, postcode}});}}>Save Venue</Button>
        </Form>
    );
}