import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import { getMessaging, getToken } from "firebase/messaging";
import "../register/Register.css";
import { Container } from "react-bootstrap";

export default function EnableNotifications() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/register");
    else {
      console.log("Requesting permission...");

      const messaging = getMessaging();
      getToken(messaging, {
        vapidKey:
          "BPfYcH5HmkD3RA0wphx6PhRR7osJJMvpmtiT1CoICndj6KlAoF78upNkn0kmhqj1MSBqbpnOIY0pwT5hCaT5Cd8",
      })
        .then((currentToken) => {
          if (currentToken) {
            // Send the token to your server and update the UI if necessary
            console.log(currentToken);
            // ...
          } else {
            // Show permission request UI
            console.log(
              "No registration token available. Request permission to generate one."
            );
            // ...
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
          // ...
        });
      navigator.serviceWorker.addEventListener("message", (message) =>
        console.log(message)
      );
    }
  }, [user, loading]);

  return (
    <Container className="register-container">
      <div className="logo-container">
        <img
          id="login-logo"
          alt="Klank Logo"
          src={require("../../../images/logo_transparent.png")}
        />
      </div>

      <h5>Please accept notifications - this can be changed in settings</h5>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <a href="/dashboard" id="skip">
          Skip
        </a>
      </div>
    </Container>
  );
}
