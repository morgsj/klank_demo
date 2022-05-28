import {
    getDocs,
    collection,
    where,
    query,
} from "firebase/firestore";

import {
    db
} from "../firebase";

const getCalendarEvents = async (uid) => {
    try {
        const qry = query(collection(db, "bookings"), where("artist", "==", uid));
        const results = await getDocs(qry);
        return results.docs.map(doc => doc.data());
    } catch (err) {
        console.log(err);
        alert("An error occured while fetching user data");
    }
};

export { getCalendarEvents };