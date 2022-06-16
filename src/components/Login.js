import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { logInWithEmailAndPassword, signInWithGoogle } from "../api/auth-api";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";
import { Button, Form } from "react-bootstrap";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (loading) {
            // maybe trigger a loading screen
            return;
        }
        if (user) navigate("/dashboard");
    }, [user, loading]);
    return (
        <div className="login">
            <div className="login-container">

                <div className="logo-container">
                    <img id="login-logo" src={require("../images/logo_transparent.png")}/>
                </div>

                <Form>
                    <Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className="login-textBox" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" className="login-textBox" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    </Form.Group>

                    <Form.Group>
                        <Button variant="primary" className="login-btn" onClick={() => logInWithEmailAndPassword(email, password)}>Login</Button>
                    </Form.Group>

                    <Form.Group>
                        <SignInWithGoogle />
                    </Form.Group>
                </Form>

                <div>
                    <Link to="/reset">Forgot Password</Link>
                </div>

                <div>
                    Don't have an account? <Link to="/register">Register</Link> now.
                </div>

            </div>
        </div>
    );
}
export default Login;

function SignInWithGoogle() {
    return (
        <Button variant="none" className="login-btn login-google" onClick={signInWithGoogle}>
            <span>
                <img id="google-logo" src={require("../images/google-logo.png")}/> 
                Login with Google
            </span>
        </Button>
    );
}