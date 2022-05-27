import React from "react";
import "./BookingOutline.css";

export default function BookingOutline(props) {
    return (
        <div className="container w-100">
            <table className="table">
                <tbody>
                    <tr>
                        <td>
                            <b>Date:</b><br />
                            07/06/2002
                        </td>
                        <td>
                            <b>Fee:</b><br />
                            £100000
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Time:</b><br />
                            22:00-02:00
                        </td>
                        <td rowSpan={3}>
                            <b>Notes:</b><br />
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows="8"></textarea>

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
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8845.974571039635!2d-2.8018503127197265!3d56.3385669252335!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x87cb384f8c43a735!2sVic%20St%20Andrews!5e0!3m2!1sen!2suk!4v1653648657879!5m2!1sen!2suk" 
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
}