import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth } from "../firebase";

import Navigator from "./Navigator";
import Header from "./Header";
import { getUserDetails, uploadProfilePhoto, getImage, getPortfolioImageURLs } from "../api/user-api";
import { getVenueDetails } from "../api/venue-api";

import { Col, Container, Row } from "react-bootstrap";

import "./Profile.css";
import { Star, StarFill } from "react-bootstrap-icons";

import { Button, Carousel } from "react-bootstrap";

export default function Profile() {
    const { id } = useParams(); 

    const [user, loading, error] = useAuthState(auth);

    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

    const [profilePhotoURL, setProfilePhotoURL] = useState(null);

    const [portfolioData, setPortfolioData] = useState([]);

    const [profileDetails, setProfileDetails] = useState(null);
    const [hostVenues, setHostVenues] = useState([]);
    const [isHost, setIsHost] = useState(false);

    const [averageReview, setAverageReview] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        
        getUserDetails(id).then((data) => {
            setProfileDetails(data);
            setIsHost(data.type.includes("host"));
            //setProfilePhotoURL(data.photoURL);
            if (data.type.includes("host")) {
                setHostVenues(data.venues);
            } else {
                getPortfolioImageURLs(user.uid, data.portfolio).then(pd => setPortfolioData(pd));
            }

            let total = 0;
            data.reviews.forEach(review => total += review.rating);
            setAverageReview(total / data.reviews.length);
        });

        
        setProfilePhotoURL(user.photoURL);

    }, [user, loading]);

    const changeProfileFile = (event) => {
        setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
    }

    const submitNewProfileFile = () => {
        if (isFilePicked) uploadProfilePhoto(user.uid, selectedFile);
    }

    return (
        <Container className="global-container">
            <Row>
                <Col md="auto" style={{padding: 0}}>
                    <Navigator uid={user ? user.uid : ""} />
                </Col>
                <Col style={{padding: 0}}>
                    <Header title={"Profile"} />

                    <Container fluid>
                        <Row>
                            <Col xs={4}>
                                <div id="profile-box">

                                    {profileDetails && (<>
                                        <Container>
                                            <Row id="avatar-container">
                                                <img src={profilePhotoURL} className="rounded-circle" id="avatar" alt="Avatar" />
                                            </Row>
                                            <Row>
                                                
                                                <Col xs={8}>
                                                    <h5 id="name">{profileDetails.name}</h5>
                                                </Col>
                                                <Col>
                                                    <p id="user-type"><b>{isHost ? "Host" : "Artist"}</b></p>
                                                </Col>
                                                <br /><p id="email">{profileDetails.email}</p>
                                            </Row>
                                            <Row>
                                                <p>Location - about X miles away</p>
                                            </Row>
                                            <Row>
                                                
                                            <span>{Array(averageReview).fill(0).map((value, index) => (<StarFill key={index} className="star" />))}
                                                    {Array(5 - averageReview).fill(0).map((value, index) => (<Star key={index} className="star" />))}</span>

                                                <p>{profileDetails.reviews.length} review(s)</p>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <p>{profileDetails.description}</p>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Button variant="primary" id="message-user-button">Message</Button>
                                            </Row>
                                        </Container>                                        
                                    </>)}
                                    
                                </div>

                            </Col>
                            <Col xs={8}>
                                
                                {isHost && <VenuesList data={profileDetails.venues} />}
                                {!isHost && <Portfolio data={portfolioData}/>}

                                <h3 id="review-title">Reviews</h3>

                                {profileDetails && profileDetails.reviews.map((review, index) => (<Review key={index} reviewer={review.reviewer} rating={review.rating} comment={review.comment}/>))}
                            </Col>
                        </Row>
                    </Container>

                </Col>
            </Row>
        </Container>
    );
}

const Review = (props) => (
    <Container className="review">
        <Row>
            <Col md="auto">
                <p><b>{props.reviewer.name}</b></p>
            </Col>
            <Col>
                <p>{Array(props.rating).fill(0).map((value, index) => (<StarFill key={index} className="star" />))}
                {Array(5 - props.rating).fill(0).map((value, index) => (<Star key={index} className="star" />))}</p>
            </Col>
        </Row>
        <Row>
            <p>{props.comment}</p>
        </Row>
    </Container>
);

const VenuePreview = (props) => (
    <Link to={`/venue/${props.venue.uid}`}className="venue-preview-link">
        <Container className="venue-preview">

            <Row>
                <Col>
                    <img src={require("../images/crowd.jpg")} className="venue-image"></img>
                </Col>
                <Col>
                    <p><b>{props.venue.name}</b></p>
                    <p>{props.venue.address.postcode}</p>
                </Col>
            </Row>

        </Container>
    </Link>
);

const VenuesList = (props) => (<>

    <h3 id="portfolio-title">Venues</h3>

    {props.data.map((venue, index) => (<VenuePreview key={index} venue={venue} />))}

</>);

const Portfolio = (props) => (<>
        <h3 id="portfolio-title">Portfolio</h3>

        <Carousel id="carousel">
            {props.data.map((item, index) => (
                <Carousel.Item key={index}>
                    <img
                    className="d-block w-100"
                    src={item.url}
                    alt={item.url}
                    />
                    <Carousel.Caption>
                        <p>{item.description}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}

        </Carousel>
</>);