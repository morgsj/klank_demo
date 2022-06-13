import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

import Navigator from "./Navigator";
import Header from "./Header";
import { uploadProfilePhoto, getImage } from "../api/profile-api";
import { getUserDetails } from "../api/user-api";
import { getVenueDetails } from "../api/venue-api";

import { Col, Container, Row } from "react-bootstrap";

import "./Profile.css";
import { Star, StarFill } from "react-bootstrap-icons";

import { Button, Carousel } from "react-bootstrap";

export default function Calendar() {
    const [user, loading, error] = useAuthState(auth);

    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

    const [profilePhotoURL, setProfilePhotoURL] = useState(null);

    const [portfolioData, setPortfolioData] = useState([]);

    const [userDetails, setUserDetails] = useState(null);
    const [hostVenues, setHostVenues] = useState([]);
    const [isHost, setIsHost] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        
        getUserDetails(user.uid).then((data) => {
            setUserDetails(data);
            setIsHost(data.type.includes("host"));
            if (data.type.includes("host")) {
                data.venues.forEach(venueID => getVenueDetails(venueID).then(venue => setHostVenues([... hostVenues, venue])));
            } else {
                getPortfolioImageURLs(data.portfolio).then(pd => setPortfolioData(pd));
            }
        });

        setProfilePhotoURL(user.photoURL);
    }, [user, loading]);

    const getPortfolioImageURLs = async (portfolio) => {
        let pd = [];
        let filename; let description;
        for (let i = 0; i < portfolio.length; i++) {
            filename = portfolio[i].fileName;
            description = portfolio[i].description;

            await getImage(user.uid, filename).then(url => pd.push({url, description}));
        }
        return pd;
    }

    const changeProfileFile = (event) => {
        setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
    }

    const submitNewProfileFile = () => {
        if (isFilePicked) uploadProfilePhoto(user.uid, selectedFile);
    }

    return (
        <div className="container m-0 p-0">
            <div className="row">
                <div className="col-sm-1">
                    <Navigator />
                </div>
                <div className="col-sm-11">
                    <Header title={"Profile"} />

                    <Container fluid>
                        <Row>
                            <Col xs={4}>
                                <div id="profile-box">

                                    {user && (<>
                                        
                                        <Container>
                                            <Row>
                                                <img src={profilePhotoURL} className="rounded-circle" id="avatar" alt="Avatar" />
                                            </Row>
                                            <Row>
                                                
                                                <Col>
                                                    <h5 id="name">{user.displayName}</h5>
                                                </Col>
                                                <Col>
                                                    <p id="user-type"><b>{isHost ? "Host" : "Artist"}</b></p>
                                                </Col>
                                                <br /><p id="email">{user.email}</p>
                                            </Row>
                                            <Row>
                                                <p>Bath, England - about 5 miles away</p>
                                            </Row>
                                            <Row>
                                                
                                            <span>{Array(3).fill((<StarFill className="star" />))}
                                                    {Array(5 - 3).fill((<Star className="star" />))}</span>

                                                <p>13 reviews</p>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
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
                                
                                <h3 id="portfolio-title">Portfolio</h3>

                                <Carousel id="carousel">
                                    {portfolioData.map((item, index) => (
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

                                <h3 id="review-title">Reviews</h3>

                                {userDetails.reviews.map(review => (<Review reviewer={review.reviewer} rating={review.rating} comment={review.comment}/>))}
                            </Col>
                        </Row>
                    </Container>

                </div>
            </div>
        </div>
    );
}

const Review = (props) => (
    <Container className="review">
        <Row>
            <Col md="auto">
                <p><b>{props.reviewer.name}</b></p>
            </Col>
            <Col>
                <p>{Array(props.rating).fill((<StarFill className="star" />))}
                {Array(5 - props.rating).fill((<Star className="star" />))}</p>
            </Col>
        </Row>
        <Row>
            <p>{props.comment}</p>
        </Row>
    </Container>
);