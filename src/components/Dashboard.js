import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Header from "./Header";
import Navigator from "./Navigator";

export default function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        fetchUserName();
    }, [user, loading]);

    return (
        <div class="container m-0 p-0">
            <div class="row">
                <div class="col-sm-1">
                    <Navigator />
                </div>
                <div class="col-sm-11">
                    <Header title={"Dashboard "}/>
                    <h1>Welcome back {name.split(" ")[0]}</h1>
                </div>
            </div>
        </div>
    );
}