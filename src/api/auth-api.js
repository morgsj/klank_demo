import {
    auth,
    db,
    usersRef
} from "../firebase";

import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";

import {
    getDocs,
    collection,
    where,
    addDoc,
    query,
    doc,
    setDoc,
} from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async (type) => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(usersRef, where("uid", "==", user.uid));
        const docs = await getDocs(q);
        
        if (docs.docs.length === 0) {
            const dc = doc(db, "/users/", user.uid);
            await setDoc(dc, {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                type: type,
                location: [0.0, 0.0],
                reviews: []
            });
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const registerWithEmailAndPassword = async (name, email, password, type, phone) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        
        const dc = doc(db, "/users/", user.uid);
        await setDoc(dc, {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
            type,
            location: [0.0, 0.0],
            phone,
            reviews: []
        });

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
};

export {
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout
}