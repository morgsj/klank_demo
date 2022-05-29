import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";

import {
    auth
} from "../firebase";
import {
    registerWithEmailAndPassword,
    signInWithGoogle,
} from "../api/auth-api";

import "./Register.css";


function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const [isHost, setIsHost] = useState(true);

    const history = useNavigate();
    const register = () => {
        if (!name) alert("Please enter name");
        registerWithEmailAndPassword(name, email, password, [ isHost ? "host" : "performer" ]);
    };
    useEffect(() => {
        if (loading) return;
        if (user) history("/dashboard");
    }, [user, loading]);
    return (
        <div className="register">
        <div className="register__container">
            {console.log(isHost)}
            <input
            type="text"
            className="register__textBox"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            />
            <input
            type="text"
            className="register__textBox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
            />
            <input
            type="password"
            className="register__textBox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            />

            <div className="form-check">
                <input className="form-check-input" type="radio" name="radios" id="host-radio" value="option1" checked={isHost} onChange={() => setIsHost(true)}/>
                <label className="form-check-label" htmlFor="radios1">
                    Register as a host
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="radios" id="performer-radio" value="option2" checked={!isHost} onChange={() => setIsHost(false)}/>
                <label className="form-check-label" htmlFor="radios2">
                    Register as a performer
                </label>
            </div>

            <button className="register__btn" onClick={register}>
            Register
            </button>
            <button
            className="register__btn register__google"
            onClick={() => signInWithGoogle([ isHost ? "host" : "performer" ])}
            >
            Register with Google
            </button>
            <div>
            Already have an account? <Link to="/">Login</Link> now.
            </div>
        </div>
        </div>
    );
}

export default Register;
