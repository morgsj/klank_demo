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

export { getCalendarEvents };