import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  InputGroup,
  Col,
  Carousel,
} from "react-bootstrap";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../header";
import Navigator from "../navigator";
import { useUserDetails } from "../../api/user-api";
import "./Venue.css";
import { GeoPoint } from "firebase/firestore";
import {
  createNewVenue,
  useVenueDetails,
  uploadVenuePhoto,
} from "../../api/venue-api";
import { useFilePicker } from "use-file-picker";
import { Address, UserDetails, Venue } from "../../api/types";

export default function VenueViewer() {
  const { venueID } = useParams();
  const [ venue, venueLoading, venueError ] = useVenueDetails(venueID!);

  const [newVenue, setNewVenue] = useState(true);

  const [user, loading, error] = useAuthState(auth);

  const [userDetails, userDetailsLoading, userDetailsError] = useUserDetails(
    user?.uid!
  );

  const navigate = useNavigate();


  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");

    const isNewVenue = venueID === "new-venue";
    setNewVenue(isNewVenue);
  }, [user, loading, navigate, venueID]);

  const createVenue = (venue: Venue) => {
    createNewVenue(venue).then(() => navigate("/calendar"));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // TODO: save
    }
    setIsEditing(!isEditing);
  };

  return (
    <Container className="global-container">
      <Row>
        <Col md="auto" style={{ padding: 0 }}>
          <Navigator />
        </Col>

        <Col style={{ padding: 0 }}>
          <Header title={`Venue - ${newVenue ? "New Venue" : venueID}`} />

          {venue && venue.organiser === user?.uid && (
            <Button
              onClick={handleEditToggle}
              variant="secondary"
              id="edit-button"
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          )}

          {newVenue && userDetails && venue && (
            <VenueCreator
              createVenue={createVenue}
              user={userDetails}
              venue={venue}
            />
          )}

          {!newVenue && venue && !isEditing && (
            <VenueInfo
              user={userDetails!}
              venue={venue}
              navigate={navigate}
              createVenue={createVenue}
            />
          )}
          {!newVenue && venue && isEditing && (
            <VenueCreator
              user={userDetails!}
              createVenue={createVenue}
              venue={venue}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

interface VenueCreaterProps {
  venue: Venue;
  user: UserDetails;
  createVenue: (venue: Venue) => void;
}
function VenueCreator(props: VenueCreaterProps) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [postcode, setPostcode] = useState<string>("");
  const [location, setLocation] = useState<GeoPoint>(new GeoPoint(0, 0));
  const [locationGuidance, setLocationGuidance] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>([]);

  const [user, userLoading, error] = useAuthState(auth);

  const [openFileSelector, { plainFiles, loading }] = useFilePicker({
    accept: [".png", ".jpg", ".PNG", ".JPG"],
    // readFilesContent: false,
    limitFilesConfig: { max: 1 },
  });

  useEffect(() => {
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
  }, [props]);

  useEffect(() => {
    if (plainFiles.length) {
      uploadVenuePhoto(props.venue.uid, plainFiles[0]).then(
        (url: string | null) => {
          if (url) setPhotos([...photos, url]);
        }
      );
    }
  }, [photos, plainFiles, props.venue.uid]);

  return (
    <Form style={{ padding: "2vw" }}>
      <Container>
        <Row>
          <Col>
            <Form.Label className="label">
              <b>Venue Manager</b>
            </Form.Label>
            <br />
            {props.user && <Form.Label>{props.user.name}</Form.Label>}

            <Form.Group>
              <Form.Label className="label">
                <b>Venue Name</b>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="label">
                <b>Description</b>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="label">
                <b>Address</b>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Address Line 1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
              />
              <Form.Control
                type="text"
                placeholder="Address Line 2 (optional)"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
              />
              <Form.Control
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Form.Control
                type="text"
                placeholder="Postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="label">
                <b>Pinpoint location</b>
              </Form.Label>
              <p className="small-print">
                Use the map to exactly define your location:
              </p>
              <p>
                <i>NOT YET IMPLEMENTED</i>
              </p>
            </Form.Group>

            <Form.Group>
              <Form.Label className="label">
                <b>Additional Location Guidance</b>
              </Form.Label>
              <p className="small-print">
                Use this space to describe travel instructions for arriving at
                the venue:
              </p>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Additional Location Guidance"
                value={locationGuidance}
                onChange={(e) => setLocationGuidance(e.target.value)}
              />
            </Form.Group>

            <Button
              id="submit-button"
              onClick={() => {
                const address: Address = {
                  addressLine1,
                  addressLine2,
                  city,
                  postcode,
                };
                props.createVenue({
                  address,
                  description,
                  location,
                  locationGuidance,
                  name,
                  organiser: user?.uid,
                  photos,
                } as Venue);
              }}
            >
              Save Venue
            </Button>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label className="label">
                Photos ({photos.length})
              </Form.Label>

              <Carousel id="carousel">
                {photos.map((url, index) => (
                  <Carousel.Item key={index}>
                    <img className="d-block w-100" src={url} alt={url} />
                  </Carousel.Item>
                ))}
              </Carousel>

              <Button onClick={openFileSelector}>Add Photo</Button>

              <Button>Remove Photo</Button>
            </Form.Group>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}

interface VenueInfoProps {
  venue: Venue;
  navigate: NavigateFunction;
  user: UserDetails;
  createVenue: (_: Venue) => void;
}
function VenueInfo(props: VenueInfoProps) {
  return (
    <Form style={{ padding: "2vw" }}>
      <Container>
        <Row>
          <Col>
            <Form.Label className="label">
              <b>Venue Manager</b>
            </Form.Label>
            <br />
            <InputGroup>
              {props.venue.organiser && (
                <div id="event-organiser-group">
                  <Form.Label id="organiser-name">
                    {props.venue.organiser}
                  </Form.Label>
                  <Button
                    onClick={() =>
                      props.navigate(`/profile/${props.venue.organiser}`)
                    }
                  >
                    View Profile
                  </Button>
                </div>
              )}
            </InputGroup>

            <Form.Group>
              <Form.Label className="label">
                <b>Venue Name</b>
              </Form.Label>
              <p>{props.venue.name}</p>
            </Form.Group>

            <Form.Group>
              <Form.Label className="label">
                <b>Description</b>
              </Form.Label>
              <p>{props.venue.description}</p>
            </Form.Group>

            <Form.Group>
              <Form.Label className="label">
                <b>Address</b>
              </Form.Label>
              <p>{props.venue.address.addressLine1}</p>
              <p>{props.venue.address.addressLine2}</p>
              <p>{props.venue.address.city}</p>
              <p>{props.venue.address.postcode}</p>
            </Form.Group>

            <Form.Group>
              <Form.Label className="label">
                <b>Pinpoint location</b>
              </Form.Label>
              <p className="small-print">
                Use the map to exactly define your location:
              </p>
              <p>
                <i>NOT YET IMPLEMENTED</i>
              </p>
            </Form.Group>

            <Form.Group>
              <Form.Label className="label">
                <b>Additional Location Guidance</b>
              </Form.Label>
              <p>{props.venue.locationGuidance}</p>
            </Form.Group>
          </Col>
          <Col style={{ flexDirection: "column" }}>
            <Form.Label className="label">
              Photos ({props.venue.photos.length})
            </Form.Label>
            <Carousel id="carousel">
              {props.venue.photos.map((url: string, index: number) => (
                <Carousel.Item key={index}>
                  <img className="d-block w-100" src={url} alt={url} />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}
