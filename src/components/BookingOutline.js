import React from "react";
import "./BookingOutline.css";

export default function BookingOutline(props) {
    if (props.event)
        return (
            <div className="container w-100">
                <table className="table">
                    <tbody>
                        <tr>
                            <td>
                                <b>Date:</b><br />
                                {props.event.startTime.toDate().toLocaleDateString()}
                            </td>
                            <td>
                                <b>Fee:</b><br />
                                £{props.event.fee}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Time:</b><br />
                                22:00-02:00
                            </td>
                            <td rowSpan={3}>
                                <b>Notes:</b><br />
                                <textarea className="form-control" id="exampleFormControlTextarea1" value={props.event.notes} rows="8"></textarea>

                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Venue:</b><br />
                                The Vic
                            </td>
                        </tr>
                        <tr>
                            <td rowSpan={2}>
                                <iframe 
                                    src={`https://maps.google.com/maps?q='+${props.event.venue.location._lat}+','+${props.event.venue.location._long}+'&hl=es&z=14&output=embed`}
                                    style={{border:0, width:'100%'}} 
                                    allowFullScreen={false} 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade" 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button className="btn orange-button">Message Venue Organiser</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    else return (<></>);
}