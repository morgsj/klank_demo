import React, {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Container,
  Form,
  Row,
  InputGroup,
  DropdownButton,
  Dropdown,
  Col,
  FormControl,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Booking.css";
import Navigator from "../navigator";
import { useUserDetails } from "../../api/user-api";
import { getVenueDetails, populateVenueDetails } from "../../api/venue-api";
import { getBookingByID } from "../../api/booking-api";
import Header from "../header";
import { Booking, UserDetails, Venue } from "../../api/types";

export default function BookingView() {
  const { bookingID } = useParams();

  const [user, loading, error] = useAuthState(auth);
  const [userDetails, userDetailsLoading, userDetailsError] = useUserDetails(
    user?.uid!
  );

  const navigate = useNavigate();

  const [newBooking, setNewBooking] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");

    setNewBooking(bookingID === "new-booking");

    if (!newBooking) {
      getBookingByID(bookingID!).then((booking: Booking) => {
        console.log(booking);

        let date = booking.startTime.toDate();

        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1; // Months start at 0
        let dd = date.getDate();
        let d, m, h;

        if (dd < 10) d = "0" + dd;
        if (mm < 10) m = "0" + mm;
        setDate(yyyy + "-" + m + "-" + d);

        let hh = date.getHours();
        mm = date.getMinutes();

        if (hh < 10) h = "0" + hh;
        if (mm < 10) m = "0" + mm;
        setStartTime(h + ":" + m);

        date = booking.endTime.toDate();

        hh = date.getHours();
        mm = date.getMinutes();

        if (hh < 10) h = "0" + hh;
        if (mm < 10) m = "0" + mm;
        setEndTime(h + ":" + m);

        getVenueDetails(booking.venue).then((v) => setSelectedVenue(v));
        setEventName(booking.notes);
        setMinFee(booking.fee);
      });
    }
  }, [user, loading]);

  useEffect(() => {
    if (userDetails && userDetails.type.includes("host")) {
      populateVenueDetails(userDetails.venues).then((venues: Venue[]) => {
        setOrganiser(userDetails);
        setVenues(venues);
        setSelectedVenue(venues[0]);
      });
    }
  }, [user, userDetails]);

  const [organiser, setOrganiser] = useState<UserDetails>();

  const [eventName, setEventName] = useState("");
  const [venues, setVenues] = useState<Venue[]>();

  const [selectedVenue, setSelectedVenue] = useState<Venue>();

  const eventTypes = [
    "Wedding",
    "Bar Mitzvah",
    "Corporate Event",
    "Concert Hall",
    "House Party",
    "Restaurant gig",
    "Night club",
    "School dance",
    "Garden party",
    "Funeral",
    "Other",
  ];
  const [eventType, setEventType] = useState<String>();
  const [otherEventType, setOtherEventType] = useState("");
  const eventTypeChanged = (eventType: string) => {
    if (eventType !== "Other") setOtherEventType("");
    setEventType(eventType);
  };

  const [eventPrivacy, setEventPrivacy] = useState("Public");

  const genres = [
    "Acoustic",
    "Alternative Rock",
    "Bluegrass",
    "Ceilidh",
    "Children's Music",
    "Christian",
    "Classic Rock",
    "Classical",
    "Country",
    "Disco",
    "Folk",
    "Funk",
    "Gospel Music",
    "Grunge",
    "Heavy Metal",
    "Hip Hop",
    "House",
    "Indie Rock",
    "Jazz",
    "Latin",
    "Opera",
    "Pop",
    "Punk Rock",
    "R&B",
    "Rap",
    "Reggae",
    "Soca",
    "World Music",
    "Other",
  ];
  const [genre, setGenre] = useState<string>();
  const [otherGenre, setOtherGenre] = useState("");
  const genreChanged = (genre: string) => {
    if (genre !== "Other") setOtherGenre("");
    setGenre(genre);
  };

  const DEFAULT_MIN_FEE = 0;
  const DEFAULT_MAX_FEE = 1000;
  const [minFee, setMinFee] = useState<number>(DEFAULT_MIN_FEE);
  const [maxFee, setMaxFee] = useState<number>(DEFAULT_MAX_FEE);
  const [strictFeeRange, setStrictFeeRange] = useState(false);

  const [date, setDate] = useState("2022-01-01");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  const handleNewMinFee: ChangeEventHandler = (
    e: ChangeEvent<HTMLInputElement>
  ) => setMinFee(parseInt(e.currentTarget.value));

  const handleNewMaxFee: ChangeEventHandler = (
    e: ChangeEvent<HTMLInputElement>
  ) => setMaxFee(parseInt(e.currentTarget.value));

  return (
    <Container className="m-0 p-0">
      <Row>
        <div className="col-sm-1">
          <Navigator />
        </div>

        <div className="col-sm-11">
          <Header
            title={`Booking - ${newBooking ? "New Booking" : bookingID}`}
          />

          <Form style={{ padding: "2vw" }}>
            <Container>
              <Row>
                <Col>
                  <p className="label">
                    <b>Event Organiser</b>
                  </p>
                  <InputGroup>
                    {organiser && (
                      <div id="event-organiser-group">
                        <Form.Label id="organiser-name">
                          {organiser.name}
                        </Form.Label>
                        <Button
                          onClick={() => navigate(`/profile/${organiser.uid}`)}
                        >
                          View Profile
                        </Button>
                      </div>
                    )}
                  </InputGroup>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label className="label">
                      <b>Event Name</b>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label className="label">
                      <b>Venue</b>
                    </Form.Label>
                    <InputGroup className="mb-3">
                      <DropdownButton
                        variant="outline-secondary"
                        title={
                          selectedVenue ? selectedVenue.name : "Select Venue"
                        }
                        id="input-group-dropdown-1"
                      >
                        {venues &&
                          venues.map((venue, index) => (
                            <Dropdown.Item
                              key={index}
                              onClick={() => setSelectedVenue(venue)}
                            >
                              {venue.name}
                            </Dropdown.Item>
                          ))}
                      </DropdownButton>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <p className="label">
                    <b>Address:</b>
                  </p>
                  <p>
                    20 avenue drive
                    <br />
                    KY16 8AF
                  </p>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label className="label">
                      <b>Event Type</b>
                    </Form.Label>

                    <InputGroup className="mb-3">
                      <DropdownButton
                        variant="outline-secondary"
                        title={eventType ? eventType : "Select Event Type"}
                        id="input-group-dropdown-1"
                      >
                        {eventTypes.map((eventType, index) => (
                          <Dropdown.Item
                            key={index}
                            onClick={() => eventTypeChanged(eventType)}
                          >
                            {eventType}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>

                      {eventType && eventType === "Other" && (
                        <Form.Control
                          type="text"
                          value={otherEventType}
                          onChange={(e) => setOtherEventType(e.target.value)}
                          placeholder="Event type"
                        />
                      )}
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label className="label">
                      <b>Musical Genre</b>
                    </Form.Label>

                    <InputGroup className="mb-3">
                      <DropdownButton
                        variant="outline-secondary"
                        title={genre ? genre : "Select Genre"}
                        id="input-group-dropdown-1"
                      >
                        {genres.map((g, index) => (
                          <Dropdown.Item
                            key={index}
                            onClick={() => genreChanged(g)}
                          >
                            {g}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>

                      {genre && genre === "Other" && (
                        <Form.Control
                          type="text"
                          value={otherGenre}
                          onChange={(e) => setOtherGenre(e.target.value)}
                          placeholder="Genre description"
                        />
                      )}
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Form.Group>
                  <Form.Label className="label">
                    <b>Fee Range</b>
                  </Form.Label>

                  <Container>
                    <Row>
                      <Col>
                        <Form.Label>Min</Form.Label>
                      </Col>
                      <Col>
                        <InputGroup className="mb-3">
                          <InputGroup.Text>£</InputGroup.Text>
                          <FormControl
                            aria-label="Amount"
                            type="number"
                            value={minFee}
                            onChange={handleNewMinFee}
                          />
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
                          <FormControl
                            aria-label="Amount"
                            type="number"
                            value={maxFee}
                            onChange={handleNewMaxFee}
                          />
                          <InputGroup.Text>.00</InputGroup.Text>
                        </InputGroup>
                      </Col>
                    </Row>
                  </Container>

                  <Form.Check
                    type="checkbox"
                    label="Strict fee range (disallow offers outside of this range)"
                    checked={strictFeeRange}
                    onChange={(e) => setStrictFeeRange(e.target.checked)}
                  />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group>
                  <Form.Label className="label">
                    <b>Date</b>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="bookingDate"
                    placeholder="Booking date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />

                  <Container style={{ marginTop: "2vh" }}>
                    <Row>
                      <Col>
                        <Form.Label>Start Time</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          type="time"
                          name="bookingStartTime"
                          placeholder="Start Time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "1vh" }}>
                      <Col>
                        <Form.Label>End Time</Form.Label>
                      </Col>
                      <Col>
                        <Form.Control
                          type="time"
                          name="bookingEndTime"
                          placeholder="End Time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </Col>
                    </Row>
                  </Container>
                </Form.Group>
              </Row>

              <Row>
                <Form.Group>
                  <Form.Label className="label">
                    <b>Event Publicity</b>
                  </Form.Label>

                  <InputGroup className="mb-1">
                    <DropdownButton
                      variant="outline-secondary"
                      title={eventPrivacy}
                    >
                      <Dropdown.Item
                        onClick={() => {
                          setEventPrivacy("Public");
                        }}
                      >
                        Public
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setEventPrivacy("Private");
                        }}
                      >
                        Private
                      </Dropdown.Item>
                    </DropdownButton>
                  </InputGroup>

                  <p className="small-print">
                    A public event is free or ticketed, and open to anyone. A
                    private event has a specific guest list and will not be
                    shown on the events calendar.
                  </p>
                </Form.Group>
              </Row>
            </Container>

            <Button style={{ marginRight: "2vw" }}>Create Event</Button>
            <Button>Save as Draft (NOT IMPLEMENTED)</Button>
          </Form>
        </div>
      </Row>
    </Container>
  );
}
