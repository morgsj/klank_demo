import { getDocs, where, query, doc, updateDoc } from "firebase/firestore";

import { db, usersRef, auth } from "../firebase";
import { populateVenueDetails } from "./venue-api";

import { updateProfile } from "firebase/auth";

import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  getStorage,
  uploadBytes,
} from "firebase/storage";
import { PortfolioDisplay, UserDetails, Venue } from "./types";
import { useMutation, UseMutationOptions, useQuery } from "react-query";

const storage = getStorage();

const getUserDetails = async (uid: string): Promise<UserDetails> => {
  const qry = query(usersRef, where("uid", "==", uid));
  const results = await getDocs(qry);

  if (results.docs.length === 1) {
    return (results.docs[0].data() as UserDetails)!;
  } else {
    throw new Error(
      `Shouldn't have found ${results.docs.length} with id "${uid}".`
    );
  }
};

function useUserDetails(
  uid: string
): [UserDetails | undefined, boolean, boolean] {
  const { data, isLoading, isError } = useQuery(
    ["getUserDetails", uid],
    async ({ queryKey }) => {
      const [_, uid] = queryKey;
      return await getUserDetails(uid);
    },
    {
      enabled: !!uid,
    }
  );
  return [data, isLoading, isError];
}

const getImage = async (uid: string, image: string): Promise<string> => {
  const pathReference = storageRef(storage, `users/${uid}/${image}`);
  let ret: string = "";
  await getDownloadURL(pathReference).then((url: string) => (ret = url));
  return ret;
};

function useImageURL(
  uid: string,
  image: string
): [string | undefined, boolean, boolean] {
  const { data, isLoading, isError } = useQuery(
    ["getImage", uid, image],
    async ({ queryKey }) => {
      const [_, uid, image] = queryKey;
      return await getImage(uid, image);
    },
    {
      enabled: !!uid && !!image,
    }
  );
  return [data, isLoading, isError];
}

const uploadProfilePhoto = async (uid: string, image: any): Promise<string> => {
  const newImageRef = storageRef(storage, `users/${uid}/${image.name}`);

  let returnValue;
  await uploadBytes(newImageRef, image);

  const url = await getDownloadURL(newImageRef);
  // Now you have valid `imageURL` from async call
  var user = auth.currentUser;

  const userRef = doc(db, `/users/${uid}`);
  updateDoc(userRef, { photo: image.name }).then(() =>
    console.log("updated profile")
  );

  await updateProfile(user!, { photoURL: url });

  return url;
};

const useUploadProfilePhoto = () => {
  return useMutation<string, void, { uid: string; image: any }>(
    ["uploadProfilePhoto"],
    ({ uid, image }): Promise<string> => {
      return uploadProfilePhoto(uid, image);
    }
  );
};

const deleteUserPhoto = async (uid: string, filename: string) => {
  console.log(`/users/${uid}/${filename}`);
  const imageRef = storageRef(storage, `/users/${uid}/${filename}`);
  deleteObject(imageRef)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const useDeleteUserPhoto = async () => {
  return useMutation<void, void, { uid: string; filename: string }>(
    ["deleteUserPhoto"],
    ({ uid, filename }): Promise<void> => {
      return deleteUserPhoto(uid, filename);
    }
  );
};

const removeProfilePhoto = async (uid: string, filename: string) => {
  await deleteUserPhoto(uid, filename);
  const userRef = doc(db, `/users/${uid}`);
  updateDoc(userRef, { photo: "" }).catch((error) => console.log(error));
  updateProfile(auth.currentUser!, { photoURL: null }).catch((error) =>
    console.log(error)
  );
};

const useRemoveProfilePhoto = async () => {
  return useMutation<void, void, { uid: string; filename: string }>(
    ["removeProfilePhoto"],
    ({ uid, filename }): Promise<void> => {
      return removeProfilePhoto(uid, filename);
    }
  );
};

const getPortfolioImageURLs = async (
  uid: string,
  portfolio: any[]
): Promise<PortfolioDisplay> => {
  let pd: PortfolioDisplay = [];
  let filename: string;
  let description: string;
  for (let i = 0; i < portfolio.length; i++) {
    filename = portfolio[i].fileName;
    description = portfolio[i].description;

    await getImage(uid, filename).then((url) => pd.push({ url, description }));
  }
  return pd;
};

const usePortfolioImageURLs = (
  uid: string,
  portfolio: string[]
): [PortfolioDisplay | undefined, boolean, boolean] => {
  const { data, isLoading, isError } = useQuery(
    ["getImage", uid, portfolio],
    async ({ queryKey }) => {
      const [_, uid, portfolio] = queryKey;
      return await getPortfolioImageURLs(uid as string, portfolio as string[]);
    },
    {
      enabled: !!uid && !!portfolio,
    }
  );
  return [data, isLoading, isError];
};

export {
  useUserDetails,
  useImageURL,
  useUploadProfilePhoto,
  deleteUserPhoto,
  useDeleteUserPhoto,
  removeProfilePhoto,
  useRemoveProfilePhoto,
  usePortfolioImageURLs,
};
