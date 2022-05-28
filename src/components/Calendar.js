import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
import { auth } from "../firebase";
import { getCalendarEvents } from "../api/calendar-api";

import Navigator from "./Navigator";
import Header from "./Header";
import BookingOutline from "./BookingOutline";

import "./Calendar.css";

export default function Calendar() {
    const [user, loading, error] = useAuthState(auth);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        
        getCalendarEvents(user.uid).then((data) => setEvents(data));
    }, [user, loading]);

    return (
        <>
            <div className="container m-0 p-0">
                <div className="row">
                    <div className="col-sm-1">
                        <Navigator />
                    </div>
                    <div className="col-sm-11">
                        <Header title={"Calendar"}/>
                        <h1 style={{margin: '1vw'}}>Upcoming bookings:</h1>

                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Venue</th>
                                    <th scope="col">Time</th>
                                    <th scope="col">Fee</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event, index) => (
                                    <tr key={index}>
                                        <td>{event.startTime.seconds}</td>
                                        <td>{event.venue}</td>
                                        <td>{event.startTime.seconds} - {event.endTime.seconds}</td>
                                        <td>£{event.fee}</td>
                                        <td>
                                            <button type="button" className="btn details-button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>

            </div>
            
            <BookingModal />
        </>
    );
}

function BookingModal() {
    return (
        <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" id="booking-modal-body" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Booking Details: 235987BR398BNSDJ</h5>
                    <button type="button" className="btn close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <BookingOutline/>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
    );
}