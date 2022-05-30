import React, { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";


import Navigator from "./Navigator";
import Header from "./Header";
import { getProfileImage, uploadProfilePhoto } from "../api/profile-api";

export default function Calendar() {
    const [user, loading, error] = useAuthState(auth);

    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

    const [profilePhotoURL, setProfilePhotoURL] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        setProfilePhotoURL(user.photoURL);
    }, [user, loading]);

    const changeProfileFile = (event) => {
        setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
    }

    const submitNewProfileFile = () => {
        if (isFilePicked) uploadProfilePhoto(user.uid, selectedFile);
    }

    return (
        <div className="container m-0 p-0">
            <div className="row">
                <div className="col-sm-1">
                    <Navigator />
                </div>
                <div className="col-sm-11">
                    <Header title={"Profile"} />

                    <img src={profilePhotoURL} className="rounded-circle" style={{width: 150}} alt="Avatar" />
                    
                    <div className="mb-3">
                        <input className="form-control" type="file" id="formFile" onChange={changeProfileFile}/>
                        <button className="btn btn-primary" onClick={submitNewProfileFile}>Submit</button>
                    </div>

                </div>
            </div>
        </div>
    );
}