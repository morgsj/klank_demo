import { doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";

import { auth, db, usersRef } from "../firebase";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";

import { deleteObject, getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { PortfolioDisplay, UserDetails, UserDetailsUpdater } from "./types";
import { useMutation, useQuery } from "react-query";

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

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async (type: string[]) => {
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
  } catch (e: any) {
    console.error(e);
    alert(e.message);
  }
};
const logInWithEmailAndPassword = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};
const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string,
  type: string[],
  phone: string
) => {
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
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};
const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};
const submitOnboardingInfo = async (country: string, uid: string) => {
  try {
    const dc = doc(db, "/users/", uid);
    await updateDoc(dc, { country, hasOnboarded: true });
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

const updateUserDetails = async (uid: string, details: UserDetailsUpdater): Promise<void> => {
  try {
    const dc = doc(db, "/users/", uid);

    await updateDoc(dc, details as { [x: string]: any; });

    if (Object.keys(details as { [x: string]: any; }).includes("name")) {
      await updateProfile(auth.currentUser!, { displayName: details.name });
    }
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  sessionStorage.removeItem("userDetails");
  signOut(auth);
};

const mapUserErrorCode = (code: string) => {
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
};

const useUpdateUserDetails = () => {
  return useMutation<void, void, {uid: string, details: UserDetailsUpdater}>(
    ["setUserDetails"],
    ({ uid, details }): Promise<void> => {
      return updateUserDetails(uid, details);
    }
  );
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
export { mapUserErrorCode };
export { logout };
export { updateUserDetails, useUpdateUserDetails };
export { submitOnboardingInfo };
export { sendPasswordReset };
export { registerWithEmailAndPassword };
export { logInWithEmailAndPassword };
export { signInWithGoogle };