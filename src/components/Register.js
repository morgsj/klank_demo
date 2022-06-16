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
import { ButtonGroup, Form, ToggleButton, Button } from "react-bootstrap";


function Register() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const [isHost, setIsHost] = useState(true);

    const history = useNavigate();

    const register = () => {
        if (!name) alert("Please enter name");
        else if (password != confirmPassword) alert("Passwords must match");
        else registerWithEmailAndPassword(name, email, password, [ isHost ? "host" : "performer" ], phone);
    };

    useEffect(() => {
        if (loading) return;
        if (user) history("/dashboard");
    }, [user, loading]);
    return (
        <div className="register">
            <div className="register-container">
                
                <div className="logo-container">
                    <img id="login-logo" src={require("../images/logo_transparent.png")}/>
                </div>

                <Form>
                    <Form.Group>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" className="register-textBox" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" /> 
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>E-mail Address</Form.Label>
                        <Form.Control type="text" className="register-textBox" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail Address" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Phone (optional)</Form.Label>
                        <Form.Control type="number" className="register-textBox" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone"></Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" className="register-textBox" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                        <Form.Control type="password" className="register-textBox" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
                    </Form.Group>
                    

                    <ButtonGroup id="user-type-selector">

                        <ToggleButton
                            type="checkbox"
                            variant={isHost ? "primary" : "secondary"}
                            checked={isHost}
                            onClick={() => setIsHost(true)}
                        >
                            Host
                        </ToggleButton>
                        <ToggleButton
                            type="checkbox"
                            variant={!isHost ? "primary" : "secondary"}
                            checked={!isHost}
                            onClick={() => setIsHost(false)}
                        >
                            Performer
                        </ToggleButton>
                    </ButtonGroup>
                </Form>

                <Button variant="primary" className="register-btn" onClick={register}>
                    Register
                </Button>
                
                <RegisterWithGoogle isHost={isHost} />

                <div>
                Already have an account? <Link to="/login">Login</Link> now.
                </div>
            </div>
        </div>
    );
}

export default Register;

function RegisterWithGoogle(props) {
    return (
        <Button variant="none" className="register-btn register-google" onClick={() => signInWithGoogle([ props.isHost ? "host" : "performer" ])}>
            <span>
                <img id="google-logo" src={require("../images/google-logo.png")}/> 
                Register with Google
            </span>
        </Button>
    );
}