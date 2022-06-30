import {
    getDocs,
    where,
    query,
    setDoc,
    doc,
    arrayUnion,
    updateDoc
} from "firebase/firestore";

import {
    db,
    venuesRef
} from "../firebase";

import { v4 as UUID } from 'uuid';

import { getDownloadURL, ref as storageRef, getStorage, uploadBytes } from "firebase/storage";

const storage = getStorage();

const getVenueDetails = async (uid) => {
    try {
        const qry = query(venuesRef, where("uid", "==", uid));
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

const populateVenueDetails = async (venueIDs) => {
    let venues = [];
    for (let i = 0; i < venueIDs.length; i++) {
        await getVenueDetails(venueIDs[i]).then(data => venues.push(data));
    }
    return venues;
}

const createNewVenue = async (venue) => {
    console.log("createNewVenue");
    try {
        const uid = UUID();
        const dc = doc(db, "/venues/", uid);

        const entry = venue; entry["uid"] = uid;
        await setDoc(dc, entry);
        
        const userDoc = doc(db, "/users/", venue.organiser);
        await updateDoc(userDoc, {
            venues: arrayUnion(uid)
        });

        return entry;
    } catch (err) {
        console.error(err);
    }
}

const uploadVenuePhoto = async (venueID, image) => {
    const newImageRef = storageRef(storage, `venues/${venueID}/${image.name}`);

    await uploadBytes(newImageRef, image).then(async () => {
        
        await getDownloadURL(newImageRef).then(async (url) => {

            const venueDoc = doc(db, "/venues/", venueID);
            await updateDoc(venueDoc, {
                photos: arrayUnion(url)
            });
            
            return url;
        })
        .catch(error => console.log(error));

    });
}

export { getVenueDetails, populateVenueDetails, createNewVenue, uploadVenuePhoto };
