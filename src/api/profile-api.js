import { updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { auth } from "../firebase";

const storage = getStorage();

const getProfileImage = async (uid, image) => {
    const pathReference = ref(storage, `users/${uid}/${image}`);
    await getDownloadURL(pathReference).then((url) => {console.log(url); return url;});
}

const uploadProfilePhoto = async (uid, image) => {
    console.log(image);
    const newImageRef = ref(storage, `users/${uid}/${image.name}`);

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

export { getProfileImage, uploadProfilePhoto };