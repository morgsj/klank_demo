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
import {PortfolioDisplay, UserDetails, Venue} from "./types";

const storage = getStorage();

const getUserDetails = async (uid: string): Promise<UserDetails> => {
    let udStore = sessionStorage.getItem("userDetails");
    if (udStore) {
        let userDetails = JSON.parse(udStore);
        if (userDetails && userDetails.uid === uid) return userDetails;
    }

    const qry = query(usersRef, where("uid", "==", uid));
    const results = await getDocs(qry);

    if (results.docs.length === 1) {
        let userDetails = (results.docs[0].data() as UserDetails)!;
        sessionStorage.setItem("userDetails", JSON.stringify(userDetails))

        return userDetails;
    } else {
        throw new Error(`Shouldn't have found ${results.docs.length} with id "${uid}".`);
    }
}

const getImage = async (uid: string, image: string): Promise<string> => {
    const pathReference = storageRef(storage, `users/${uid}/${image}`);
    let ret: string = "";
    await getDownloadURL(pathReference).then((url: string) => ret = url);
    return ret;
}

const uploadProfilePhoto = async (uid: string, image: any): Promise<string> => {
    const newImageRef = storageRef(storage, `users/${uid}/${image.name}`);

    let returnValue;
    await uploadBytes(newImageRef, image)
        
    const url = await getDownloadURL(newImageRef)
    // Now you have valid `imageURL` from async call
    var user = auth.currentUser;

    const userRef = doc(db, `/users/${uid}`);
    updateDoc(userRef, { photo: image.name }).then(() => console.log("updated profile"));

    await updateProfile(user!, { photoURL: url });

    return url;
}

const deleteUserPhoto = async (uid: string, filename: string) => {
    console.log(`/users/${uid}/${filename}`);
    const imageRef = storageRef(storage, `/users/${uid}/${filename}`);
    deleteObject(imageRef).then((res) => {
        console.log(res);
    }).catch((error) => {
        console.log(error);
        return error;
    })
}

const removeProfilePhoto = async (uid: string, filename: string) => {
    deleteUserPhoto(uid, filename);

    let userDetails = JSON.parse(sessionStorage.getItem("userDetails") ?? "");
    userDetails.photo = "";
    sessionStorage.setItem("userDetails", JSON.stringify(userDetails));

    const userRef = doc(db, `/users/${uid}`);
    updateDoc(userRef, { photo: "" }).catch(error => console.log(error));
    updateProfile(auth.currentUser!, { photoURL: null }).catch(error => console.log(error));

}

const getPortfolioImageURLs = async (uid: string, portfolio: any[]): Promise<PortfolioDisplay> => {
    let pd: PortfolioDisplay = [];
    let filename: string;
    let description: string;
    for (let i = 0; i < portfolio.length; i++) {
        filename = portfolio[i].fileName;
        description = portfolio[i].description;

        await getImage(uid, filename).then(url => pd.push({url, description}));
    }
    return pd;
}

export { getUserDetails, getImage, uploadProfilePhoto, getPortfolioImageURLs, deleteUserPhoto, removeProfilePhoto};