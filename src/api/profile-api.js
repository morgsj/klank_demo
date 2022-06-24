import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { auth, db } from "../firebase";

const storage = getStorage();

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

export { getImage, uploadProfilePhoto, getPortfolioImageURLs, deleteUserPhoto, removeProfilePhoto };