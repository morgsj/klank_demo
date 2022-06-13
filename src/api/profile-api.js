import { updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { auth } from "../firebase";

const storage = getStorage();

const getImage = async (uid, image) => {
    const pathReference = storageRef(storage, `users/${uid}/${image}`);
    let ret;
    await getDownloadURL(pathReference).then(url => ret = url);
    return ret;
}

const uploadProfilePhoto = async (uid, image) => {
    console.log(image);
    const newImageRef = storageRef(storage, `users/${uid}/${image.name}`);

    uploadBytes(newImageRef, image).then((snapshot) => {
        console.log('Uploaded profile photo.');
        
        getDownloadURL(newImageRef).then(function(url) {
            console.log(url);
        
            // Now you have valid `imageURL` from async call
            var user = auth.currentUser;
            updateProfile(user, { photoURL: url })
                .then(() => { console.log(user) })
                .catch((error) => { console.log(error) });
        
            })
            .catch((error) => { console.log(error) });
    });
}

export { getImage, uploadProfilePhoto };