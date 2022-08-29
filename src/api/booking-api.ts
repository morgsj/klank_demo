import { getDocs, where, query } from "firebase/firestore";

import { bookingsRef } from "../firebase";


import { Booking } from "./types";
import { useQuery } from "react-query";

const getCalendarEvents = async (uid: string): Promise<Booking[]> => {
  const q = query(bookingsRef, where("artist", "==", uid));
  const results = await getDocs(q);
  const docs = results.docs.map((doc) => doc.data() as Booking);
  return docs;
};

const useCalendarEvents = (uid: string): [Booking[] | undefined, boolean, boolean] => {
  const {data, isLoading, isError} = useQuery(["getCalendarEvents", uid], ({ queryKey }) => {
    const [_, uid] = queryKey;
    return getCalendarEvents(uid);
  })
  return [data, isLoading, isError];
}

const getBookingByID = async (uid: string): Promise<Booking> => {
  const qry = query(bookingsRef, where("uid", "==", uid));
  const results = await getDocs(qry);

  if (results.docs.length === 1) {
    return (results.docs[0].data() as Booking)!;
  } else {
    throw new Error(
      `Shouldn't have found ${results.docs.length} with id "${uid}".`
    );
  }
};

export { useCalendarEvents, getBookingByID };
