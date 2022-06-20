import {
    getDocs,
    where,
    query,
} from "firebase/firestore";

import {
    db,
    usersRef,
} from "../firebase";
import { populateVenueDetails } from "./venue-api";

const getUserDetails = async (uid) => {
    try {
        let udStore = localStorage.getItem("userDetails");
        if (udStore) {
            let userDetails = JSON.parse(udStore);
            if (userDetails && userDetails.uid == uid) return userDetails;
        }

        const qry = query(usersRef, where("uid", "==", uid));
        const results = await getDocs(qry);

        if (results.docs.length == 1) {
            let userDetails = results.docs[0].data();
            
            if (userDetails.type.includes("host")) {
                await populateVenueDetails(userDetails.venues).then(venues => userDetails.venues = venues);
            }
            localStorage.setItem("userDetails", JSON.stringify(userDetails))
            return results.docs[0].data();
        } else {
            throw new Error(`Shouldn't have found ${results.docs.length} with id "${uid}".`);
        }
        
    } catch (err) {
        console.error(err);
    }
};


export { getUserDetails };
