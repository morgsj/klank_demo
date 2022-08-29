import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import "./AdditionalOnboarding.css";
import { Button, Dropdown, Form } from "react-bootstrap";
import { submitOnboardingInfo, useUserDetails } from "../../../api/user-api";
import { countries } from "../../../api/countries";

export default function Onboarding() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const [userDetails, userDetailsLoading, userDetailsError] = useUserDetails(
    user?.uid!
  );

  const [country, setCountry] = useState("United Kingdom");

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/register");
  }, [user, loading]);

  useEffect(() => {
    if (userDetails && userDetails.hasOnboarded)
      navigate("/enable-notifications");
  }, [userDetails]);

  const handleSubmit = () => {
    submitOnboardingInfo(country, user!.uid).then(() => navigate("/dashboard"));
  };

  return (
    <div className="additional-registration">
      <div className="additional-registration-container">
        <div className="logo-container">
          <img
            id="login-logo"
            alt="Klank Logo"
            src={require("../../../images/logo_transparent.png")}
          />
        </div>

        <h3>Additional information</h3>
        <p>
          You can fill in this information later, but you must complete required
          fields to use all of Klank's features.
        </p>

        <Form>
          <Form.Label>Country</Form.Label>

          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {country}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {countries.map((c) => (
                <Dropdown.Item onClick={() => setCountry(c)}>{c}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form>

        <Form>
          <Form.Label>Country</Form.Label>
          <Form.Control type="number" />
        </Form>

        <hr />
        <Button id="submit-button" variant="primary" onClick={handleSubmit}>
          Save and go to Dashboard
        </Button>
      </div>
    </div>
  );
}
