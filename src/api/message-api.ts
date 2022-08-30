import {
  getDocs,
  where,
  query,
  orderBy,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

import { conversationsRef, db, messagesRef, usersRef } from "../firebase";

// @ts-ignore
import { v4 as UUID } from "uuid";
import { Conversation, ConversationPreview, Message } from "./types";
import Messages from "../domains/messages";
import { useQuery } from "react-query";

async function getAllMessages(uid: string, isHost: boolean): Promise<Conversation[]> {
  const qry = query(conversationsRef, where(isHost ? "host" : "performer", "==", uid));
  const docs = await getDocs(qry);
  return docs.docs.map(doc => doc.data() as Conversation);
}

function useGetAllConversations(
  uid: string,
  isHost: boolean
): [Conversation[] | undefined, boolean, boolean] {
  const { data, isLoading, isError } = useQuery(
    ["getImage", uid, isHost],
    async ({ queryKey }) => {
      const [_, uid, isHost] = queryKey;
      return await getAllMessages(uid as string, isHost as boolean);
    },
    {
      enabled: !!uid,
    }
  );
  return [data, isLoading, isError];
}



export { useGetAllConversations };
