import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth } from "../../firebase";

import Navigator from "../navigator";
import Header from "../header";
import { usePortfolioImageURLs, useUserDetails } from "../../api/user-api";

import { Col, Container, Row } from "react-bootstrap";

import "./Profile.css";
import { Star, StarFill } from "react-bootstrap-icons";

import { Button, Carousel } from "react-bootstrap";
import {
  PortfolioDisplay,
  PortfolioItem,
  Review,
  UserDetails,
  Venue,
} from "../../api/types";
import { populateVenueDetails } from "../../api/venue-api";

export default function Profile() {
  const { id } = useParams();

  const [user, loading, error] = useAuthState(auth);

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const [profilePhotoURL, setProfilePhotoURL] = useState<string>();

  const [userDetails, userDetailsLoading, userDetailsError] = useUserDetails(
    user?.uid!
  );

  const [portfolioData, portfolioLoading, portfolioError] =
    usePortfolioImageURLs(
      userDetails?.uid!,
      userDetails?.portfolio!.map((i: PortfolioItem) => i.fileName) as string[]
    );

  const [hostVenues, setHostVenues] = useState<Venue[]>();
  const [isHost, setIsHost] = useState(false);

  const [averageReview, setAverageReview] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    if (user.photoURL) setProfilePhotoURL(user.photoURL);
  }, [user, loading]);

  useEffect(() => {
    if (userDetails) {
      setIsHost(userDetails.type.includes("host"));
      if (userDetails.type.includes("host")) {
        populateVenueDetails(userDetails.venues).then((venues: Venue[]) =>
          setHostVenues(venues)
        );
      }

      let total = 0;
      userDetails.reviews.forEach((review: Review) => (total += review.rating));
      setAverageReview(total / userDetails.reviews.length);
    }
  }, [userDetails]);

  return (
    <Container className="global-container">
      <Row>
        <Col md="auto" style={{ padding: 0 }}>
          <Navigator />
        </Col>
        <Col style={{ padding: 0 }}>
          <Header title={"Profile"} />

          <Container fluid>
            <Row>
              <Col xs={4}>
                <div id="profile-box">
                  {userDetails && (
                    <>
                      <Container>
                        <Row id="avatar-container">
                          <img
                            src={profilePhotoURL}
                            className="rounded-circle"
                            id="avatar"
                            alt="Avatar"
                          />
                        </Row>
                        <Row>
                          <Col xs={8}>
                            <h5 id="name">{userDetails.name}</h5>
                          </Col>
                          <Col>
                            <p id="user-type">
                              <b>{isHost ? "Host" : "Artist"}</b>
                            </p>
                          </Col>
                          <br />
                          <p id="email">{userDetails.email}</p>
                        </Row>
                        <Row>
                          <p>Location - about X miles away</p>
                        </Row>
                        <Row>
                          <span>
                            {Array(averageReview)
                              .fill(0)
                              .map((value, index) => (
                                <StarFill key={index} className="star" />
                              ))}
                            {Array(5 - averageReview)
                              .fill(0)
                              .map((value, index) => (
                                <Star key={index} className="star" />
                              ))}
                          </span>

                          <p>{userDetails.reviews.length} review(s)</p>
                        </Row>
                        <hr />
                        <Row>
                          <p>{userDetails.description}</p>
                        </Row>
                        <hr />
                        <Row>
                          <Button variant="primary" id="message-user-button">
                            Message
                          </Button>
                        </Row>
                      </Container>
                    </>
                  )}
                </div>
              </Col>
              <Col xs={8}>
                {isHost && hostVenues && <VenuesList data={hostVenues} />}
                {!isHost && portfolioData && <Portfolio data={portfolioData} />}

                <h3 id="review-title">Reviews</h3>

                {userDetails &&
                  userDetails.reviews.map((review: Review) => (
                    <ReviewView
                      key={review.comment}
                      reviewer={review.reviewer}
                      rating={review.rating}
                      comment={review.comment}
                    />
                  ))}
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

interface ReviewProps {
  reviewer: string;
  rating: number;
  comment: string;
}
const ReviewView = ({ reviewer, rating, comment }: ReviewProps) => {
  const [reviewerName, setReviewerName] = useState<string>("");

  const [reviewerDetails, reviewerDetailsLoading, reviewerDetailsError] =
    useUserDetails(reviewer);

  useEffect(() => setReviewerName(reviewerDetails!.name), [reviewerDetails]);

  return (
    <Container className="review">
      <Row>
        <Col md="auto">
          <p>
            <b>{reviewerName}</b>
          </p>
        </Col>
        <Col>
          <p>
            {Array(rating)
              .fill(0)
              .map((value, index) => (
                <StarFill key={index} className="star" />
              ))}
            {Array(5 - rating)
              .fill(0)
              .map((value, index) => (
                <Star key={index} className="star" />
              ))}
          </p>
        </Col>
      </Row>
      <Row>
        <p>{comment}</p>
      </Row>
    </Container>
  );
};

interface VenuePreviewProps {
  venue: Venue;
}
const VenuePreview = ({ venue }: VenuePreviewProps) => (
  <Link to={`/venue/${venue.uid}`} className="venue-preview-link">
    <Container className="venue-preview">
      <Row>
        <Col>
          <img
            src={require("../../images/crowd.jpg")}
            className="venue-image"
            alt="crowd"
          ></img>
        </Col>
        <Col>
          <p>
            <b>{venue.name}</b>
          </p>
          <p>{venue.address.postcode}</p>
        </Col>
      </Row>
    </Container>
  </Link>
);

interface VenuesListProps {
  data: Venue[];
}
const VenuesList = ({ data }: VenuesListProps) => (
  <>
    <h3 id="portfolio-title">Venues</h3>
    {data.map((venue: Venue, index: number) => (
      <VenuePreview key={index} venue={venue} />
    ))}
  </>
);

interface PortfolioProps {
  data: PortfolioDisplay;
}
const Portfolio = ({ data }: PortfolioProps) => (
  <>
    <h3 id="portfolio-title">Portfolio</h3>

    <Carousel id="carousel">
      {data.map((item: { description: string; url: string }, index: number) => (
        <Carousel.Item key={index}>
          <img className="d-block w-100" src={item.url} alt={item.url} />
          <Carousel.Caption>
            <p>{item.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  </>
);
