import {
  getDocs,
  where,
  query,
  setDoc,
  doc,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";

import { db, venuesRef } from "../firebase";

// @ts-ignore
import { v4 as UUID } from "uuid";

import {
  getDownloadURL,
  ref as storageRef,
  getStorage,
  uploadBytes,
} from "firebase/storage";
import { Venue } from "./types";
import { useQuery } from "react-query";

const storage = getStorage();

const getVenueDetails = async (uid: string): Promise<Venue> => {
  const qry = query(venuesRef, where("uid", "==", uid));
  const results = await getDocs(qry);

  if (results.docs.length === 1) {
    return (results.docs[0].data() as Venue)!;
  } else {
    throw new Error(
      `Shouldn't have found ${results.docs.length} with id "${uid}".`
    );
  }
};

const useVenueDetails = (uid: string): [Venue | undefined, boolean, boolean] => {
  const { data, isLoading, isError } = useQuery(["getVenueDetails", uid], ({ queryKey }) => {
    const [_, uid] = queryKey;
    return getVenueDetails(uid);
  });
  return [data, isLoading, isError];
}

const getVenuesDetails = async (uids: string[]): Promise<Venue[]> => {
  const qry = query(venuesRef, where("uid", "in", uids));
  const results = await getDocs(qry);

  if (results.docs.length === uids.length) {
    return results.docs.map(doc => doc.data() as Venue);
  } else {
    throw new Error(
      `Did not find an entry for all uids`
    );
  }
};

const useVenuesDetails = (uids: string[]): [Venue[] | undefined, boolean, boolean] => {
  const { data, isLoading, isError } = useQuery(["getVenueDetails", uids], ({ queryKey }) => {
    const [_, u] = queryKey;
    const uids = u as string[];
    return getVenuesDetails(uids);
  }, {
    enabled: !!uids
  });
  return [data, isLoading, isError];
}

const populateVenueDetails = async (venueIDs: string[]): Promise<Venue[]> => {
  let venues: Venue[] = [];
  for (let i = 0; i < venueIDs.length; i++) {
    await getVenueDetails(venueIDs[i]).then((venue: Venue) =>
      venues.push(venue)
    );
  }
  return venues;
};

const createNewVenue = async (venue: Venue) => {
  console.log("createNewVenue");
  try {
    const uid = UUID();
    const dc = doc(db, "/venues/", uid);

    const entry = venue;
    entry["uid"] = uid;
    await setDoc(dc, entry);

    const userDoc = doc(db, "/users/", venue.organiser);
    await updateDoc(userDoc, {
      venues: arrayUnion(uid),
    });

    return entry;
  } catch (err) {
    console.error(err);
  }
};

const uploadVenuePhoto = async (venueID: string, image: any) => {
  const newImageRef = storageRef(storage, `venues/${venueID}/${image.name}`);

  await uploadBytes(newImageRef, image);

  const url = await getDownloadURL(newImageRef);

  const venueDoc = doc(db, "/venues/", venueID);
  await updateDoc(venueDoc, {
    photos: arrayUnion(url),
  });

  return url;
};

export {
  useVenueDetails, getVenueDetails,
  useVenuesDetails, getVenuesDetails,
  populateVenueDetails,
  createNewVenue,
  uploadVenuePhoto,
};
