import {
    getDocs,
    where,
    query,
    doc, updateDoc
} from "firebase/firestore";

import {
    db,
    usersRef,
    auth
} from "../firebase";
import { populateVenueDetails } from "./venue-api";

import { updateProfile } from "firebase/auth";

import { deleteObject, getDownloadURL, ref as storageRef, getStorage, uploadBytes } from "firebase/storage";

const storage = getStorage();

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

const getImage = async (uid, image) => {
    const pathReference = storageRef(storage, `users/${uid}/${image}`);
    let ret;
    await getDownloadURL(pathReference).then(url => ret = url);
    return ret;
}

const uploadProfilePhoto = async (uid, image) => {
    const newImageRef = storageRef(storage, `users/${uid}/${image.name}`);

    let returnValue;
    await uploadBytes(newImageRef, image).then(async () => {
        
        await getDownloadURL(newImageRef).then(async (url) => {        
            // Now you have valid `imageURL` from async call
            var user = auth.currentUser;

            const userRef = doc(db, `/users/${uid}`);
            updateDoc(userRef, { photo: image.name }).then(() => console.log("updated profile"));


            await updateProfile(user, { photoURL: url })
            .then(() => { console.log(user); returnValue = url; })
            .catch(error => console.log(error));

        })
        .catch(error => console.log(error));

    });
    return returnValue;
}

const deleteUserPhoto = async (uid, filename) => {
    console.log(`/users/${uid}/${filename}`);
    const imageRef = storageRef(storage, `/users/${uid}/${filename}`);
    deleteObject(imageRef).then((res) => {
        console.log(res);
    }).catch((error) => {
        console.log(error);
        return error;
    })
}

const removeProfilePhoto = async (uid, filename) => {
    deleteUserPhoto(uid, filename);

    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    userDetails.photo = "";
    localStorage.setItem("userDetails", JSON.stringify(userDetails));

    const userRef = doc(db, `/users/${uid}`);
    updateDoc(userRef, { photo: "" }).catch(error => console.log(error));
    updateProfile(auth.currentUser, { photoURL: null }).catch(error => console.log(error));

}

const getPortfolioImageURLs = async (uid, portfolio) => {
    let pd = [];
    let filename; let description;
    for (let i = 0; i < portfolio.length; i++) {
        filename = portfolio[i].fileName;
        description = portfolio[i].description;

        await getImage(uid, filename).then(url => pd.push({url, description}));
    }
    return pd;
}

export { getUserDetails, getImage, uploadProfilePhoto, getPortfolioImageURLs, deleteUserPhoto, removeProfilePhoto};