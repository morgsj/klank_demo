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
    updateProfile,
} from "firebase/auth";

import {
    getDocs,
    collection,
    where,
    addDoc,
    query,
    doc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { useDeferredValue, useImperativeHandle } from "react";

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
    await signInWithEmailAndPassword(auth, email, password);
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
            reviews: [],
            hasOnboarded: false
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

const submitOnboardingInfo = async (country, uid) => {
    try {
        const dc = doc(db, "/users/", uid);
        await updateDoc(dc, { country, hasOnboarded: true });
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const updateUserDetails = async (uid, details) => {
    try {
        const dc = doc(db, "/users/", uid);

        await updateDoc(dc, details);

        // edit cache
        let userDetails = JSON.parse(localStorage.getItem("userDetails"));
        for (const detail in details) {
            userDetails[detail] = details[detail];
        }
        localStorage.setItem("userDetails", JSON.stringify(userDetails));


        if (Object.keys(details).includes("name")) {
            await updateProfile(auth.currentUser, {displayName: details.name});
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const logout = () => {
    localStorage.removeItem("userDetails");
    signOut(auth);
};

const mapUserErrorCode = (code) => {
    switch (code) {
        case "auth/email-already-exists":
            return "An email with that account already exists";
        case "auth/invalid-email":
            return "Please enter a valid email address";
        case "auth/invalid-password":
            return "Invalid password: your password must be 6 characters or more";
        case "auth/user-not-found":
            return "User not found - please register"; 
        case "auth/internal-error":
            return "Internal error. Please try again later.";
        case "auth/wrong-password":
            return "Wrong password";
        default:
            return "There was an error in authorisation. Please try again later.";
    }
}

const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"]

export {
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    mapUserErrorCode,
    countries,
    submitOnboardingInfo,
    updateUserDetails
}