import React, { useEffect, useState } from "react";
import { Button, Container, Form, Row, InputGroup, DropdownButton, Dropdown, Col, FormControl, Carousel } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "./Header";
import Navigator from "./Navigator";
import { getUserDetails } from "../api/user-api";
import "./Venue.css";
import { GeoPoint } from "firebase/firestore";
import { createNewVenue, getVenueDetails, uploadVenuePhoto } from "../api/venue-api";
import { useFilePicker } from "use-file-picker";


export default function Venue() {

    const { venueID } = useParams(); 

    const [user, loading, error] = useAuthState(auth);
    const [userDetails, setUserDetails] = useState(null);

    const navigate = useNavigate();

    const [newVenue, setNewVenue] = useState(true);
    const [venue, setVenue] = useState(null);

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");

        const isNewVenue = venueID == "new-venue";
        setNewVenue(isNewVenue);
        if (!isNewVenue) getVenueDetails(venueID).then(v => setVenue(v));
        
        getUserDetails(user.uid).then(data => setUserDetails(data));
    }, [user, loading]);


    const createVenue = (venue) => {
        createNewVenue(venue).then(() => navigate("/calendar"));
    }

    const handleEditToggle = () => {
        if (isEditing) {
            // TODO: save
        }
        setIsEditing(!isEditing);
    }

    return (
        <Container className="global-container">
            <Row>
                <Col md="auto" style={{padding: 0}}>
                    <Navigator uid={user ? user.uid : ""} />
                </Col>

                <Col style={{padding: 0}}>
                    <Header title={`Venue - ${newVenue ? "New Venue" : venueID}`}/>

                    {venue && venue.organiser.uid == user.uid && (
                        <Button onClick={handleEditToggle} variant="secondary" id="edit-button">{isEditing ? "Save" : "Edit"}</Button>
                    )}

                    {newVenue && <VenueCreator user={userDetails} createVenue={createVenue} />}
                    
                    {!newVenue && venue && !isEditing && <VenueInfo user={userDetails} venue={venue} navigate={navigate} />}
                    {!newVenue && venue && isEditing && <VenueCreator user={userDetails} createVenue={createVenue} venue={venue} />}
                </Col>
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
    const [photos, setPhotos] = useState([]);

    const [openFileSelector, { plainFiles, fileSelectorLoading }] = useFilePicker({
        accept: ['.png', '.jpg', '.PNG', '.JPG'],
        // readFilesContent: false,
        limitFilesConfig: {max: 1},
    });

    useState(() => {
        if (props.venue) {
            setName(props.venue.name);
            setDescription(props.venue.description);
            setAddressLine1(props.venue.address.addressLine1);
            setAddressLine2(props.venue.address.addressLine2);
            setCity(props.venue.address.city);
            setPostcode(props.venue.address.postcode);
            setLocation(props.venue.location);
            setLocationGuidance(props.venue.locationGuidance);
            setPhotos(props.venue.photos);
        }
    }, []);

    useEffect(() => {
        if (plainFiles.length) {
            uploadVenuePhoto(props.venue.uid, plainFiles[0]).then(url => setPhotos([...photos, url]));
        }
    }, [plainFiles]);

    return (
        <Form style={{padding: "2vw"}}>
            <Container>
                <Row>
                    <Col>
                        <Form.Label className="label"><b>Venue Manager</b></Form.Label><br />
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
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label className="label">Photos ({photos.length})</Form.Label>

                            <Carousel id="carousel">
                                {photos.map((url, index) => (
                                    <Carousel.Item key={index}>
                                        <img
                                            className="d-block w-100"
                                            src={url}
                                            alt={url}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>

                            <Button onClick={openFileSelector}>
                                Add Photo
                            </Button>

                            <Button>
                                Remove Photo
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
            
            
        </Form>
    );
}

function VenueInfo(props) {
    return (
        <Form style={{padding: "2vw"}}>
            <Container>
                <Row>
                    <Col>
                    
                        <Form.Label className="label"><b>Venue Manager</b></Form.Label><br />
                        <InputGroup>
                            {props.venue.organiser && (<div id="event-organiser-group">
                                <Form.Label id="organiser-name">{props.venue.organiser.name}</Form.Label>
                                <Button onClick={() => props.navigate(`/profile/${props.venue.organiser.uid}`)}>View Profile</Button>
                            </div>)}
                        </InputGroup>
                                    
                        <Form.Group>
                            <Form.Label className="label"><b>Venue Name</b></Form.Label>
                            <p>{props.venue.name}</p>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="label"><b>Description</b></Form.Label>
                            <p>{props.venue.description}</p>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="label"><b>Address</b></Form.Label>
                            <p>{props.venue.address.addressLine1}</p>
                            <p>{props.venue.address.addressLine2}</p>
                            <p>{props.venue.address.city}</p>
                            <p>{props.venue.address.postcode}</p>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="label"><b>Pinpoint location</b></Form.Label>
                            <p className="small-print">Use the map to exactly define your location:</p>
                            <p><i>NOT YET IMPLEMENTED</i></p>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="label"><b>Additional Location Guidance</b></Form.Label>
                            <p>{props.venue.locationGuidance}</p>
                        </Form.Group>
                        
                    </Col>
                    <Col style={{flexDirection: 'column'}}>
                        <Form.Label className="label">Photos ({props.venue.photos.length})</Form.Label>
                        <Carousel id="carousel">
                            {props.venue.photos.map((url, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block w-100"
                                        src={url}
                                        alt={url}
                                    />
                                </Carousel.Item>
                            ))}

                        </Carousel>
                    </Col>
                </Row>
            </Container>
        </Form>


        
    );
}