import {
    getDocs,
    where,
    query,
    orderBy,
} from "firebase/firestore";

import {
    db,
    messagesRef
} from "../firebase";

const getAllConversations = async (uid, isHost) => {
    try {
        const qry = query(messagesRef, where(isHost ? "host" : "performer", "==", uid), orderBy("time"));
        const results = await getDocs(qry);

        const conversations = [];
        const seen = [];
        results.docs.forEach(doc => {
            const data = doc.data();
            const other = isHost ? data.performer : data.host;
            if (!seen.includes(other)) {
                seen.push(other);
                conversations.push({
                    with: other,
                    message: data.message,
                })
            }
        })
        return conversations;
    } catch (err) {
        console.error(err);
    }
};

const getConversation = async (host, performer) => {
    try {
        const qry = query(messagesRef, where("host", "==", host), where("performer", "==", performer), orderBy("time"));
        const results = await getDocs(qry);
        return results.docs.map(result => result.data());
    } catch (err) {
        console.error(err);
    }
};


export { getAllConversations, getConversation };
