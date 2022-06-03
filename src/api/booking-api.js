import {
    getDocs,
    collection,
    where,
    query,
} from "firebase/firestore";

import {
    db,
    bookingsRef
} from "../firebase";

import {
    getVenueDetails
} from "./venue-api";

const getCalendarEvents = async (uid) => {
    try {
        const q = query(bookingsRef, where("artist", "==", uid));
        const results = await getDocs(q);
        const docs = results.docs.map(doc => doc.data());

        // Include venue details in event
        for (let i = 0; i < docs.length; i++) {
            let venueInfo = await getVenueDetails(docs[i].venue);
            docs[i].venue = venueInfo;
        }

        return docs
    } catch (err) {
        console.log(err);
        alert("An error occured while fetching user data");
    }
};

const getBookingByID = async (uid) => {
    try {
        const qry = query(bookingsRef, where("uid", "==", uid));
        const results = await getDocs(qry);

        if (results.docs.length == 1) {
            return results.docs[0].data();
        } else {
            throw new Error(`Shouldn't have found ${results.docs.length} with id "${uid}".`);
        }
        
    } catch (err) {
        console.error(err);
    }
};

export { getCalendarEvents, getBookingByID };