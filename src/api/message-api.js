import {
    getDocs,
    where,
    query,
    orderBy,
    setDoc,
    doc,
    Timestamp
} from "firebase/firestore";

import {
    db,
    messagesRef
} from "../firebase";

import { v4 as UUID } from 'uuid';


const getAllConversations = async (uid, isHost) => {
    try {
        const qry = query(messagesRef, where(isHost ? "host" : "performer", "==", uid), orderBy("time"));
        console.log(query);
        const results = await getDocs(qry);
        console.log("results");
        const conversations = [];
        const seen = [];
        results.docs.forEach(doc => {
            const data = doc.data();
            console.log(data);
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

const sendNewMessage = async (host, performer, isHostSender, isRequest, message, request) => {
    try {
        const time = Timestamp.fromDate(new Date());
        const uid = UUID();
        const dc = doc(db, "/messages/", uid);

        const entry = {host, performer, isHostSender, isRequest, message, uid, time, request};
        await setDoc(dc, entry);
        
        return entry;
    } catch (err) {
        console.error(err);
    }
}

export { getAllConversations, getConversation, sendNewMessage };
