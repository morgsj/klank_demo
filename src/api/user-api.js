import {
    getDocs,
    where,
    query,
} from "firebase/firestore";

import {
    db,
    usersRef,
} from "../firebase";

const getUserDetails = async (uid) => {
    try {
        const qry = query(usersRef, where("uid", "==", uid));
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


export { getUserDetails };
