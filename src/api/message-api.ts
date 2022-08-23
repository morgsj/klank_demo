import { getDocs, where, query, orderBy, setDoc, doc, Timestamp } from "firebase/firestore";

import { db, messagesRef } from "../firebase";

// @ts-ignore
import { v4 as UUID } from "uuid";
import {ConversationPreview, Message} from "./types";
import Messages from "../domains/messages";


const getAllConversations = async (uid: unknown, isHost: boolean) => {
    try {
        const qry = query(messagesRef, where(isHost ? "host" : "performer", "==", uid), orderBy("time"));
        console.log(query);
        const results = await getDocs(qry);
        console.log("results");
        const conversations: ConversationPreview[] = [];
        const seen: Message[] = [];
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

const getConversation = async (host: string, performer: string): Promise<Message[]> => {
    const qry = query(messagesRef, where("host", "==", host), where("performer", "==", performer), orderBy("time"));
    const results = await getDocs(qry);
    return results.docs.map(result => result.data()) as Message[];
};

/**
 * Adds a message to the conversation, updating the database, returning the created Message object
 * @param host
 * @param performer
 * @param isHostSender
 * @param message
 */
const sendNewMessage = async (host: string, performer: string, isHostSender: boolean, message: string): Promise<Message> => {
    const time = Timestamp.fromDate(new Date());
    const uid = UUID();
    const dc = doc(db, "/messages/", uid);

    const newMessage: Message = {host, performer, isHostSender, message, time, uid};

    await setDoc(dc, newMessage);

    return newMessage;
}

export { getAllConversations, getConversation, sendNewMessage };
