import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";

import Navigator from "./Navigator";
import Header from "./Header";
import BookingOutline from "./BookingOutline";

import Modal from 'react-modal';

import "./Calendar.css";
import { Button } from "bootstrap";

export default function Calendar() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
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
                        <h1>Upcoming bookings:</h1>

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
                                <tr>
                                    <td>03/02/23</td>
                                    <td>The Vic</td>
                                    <td>22:00-02:00</td>
                                    <td>£60</td>
                                    <td>
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                            Details
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>04/02/23</td>
                                    <td>SILO</td>
                                    <td>20:00-02:00</td>
                                    <td>£11</td>
                                    <td>
                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                            Details
                                        </button>
                                    </td>
                                </tr>
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