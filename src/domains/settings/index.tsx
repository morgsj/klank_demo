import React, { ChangeEvent, useEffect, useState } from "react";

import { AuthStateHook, useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

import Navigator from "../navigator";
import Header from "../header";
import "./Settings.css";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

import { useFilePicker } from "use-file-picker";
import { useUserDetails } from "../../api/user-api";
import { ArrowRight } from "react-bootstrap-icons";
import { updateUserDetails } from "../../api/auth-api";
import { dateStringToTimestamp, toDateTime } from "../../api/helpers";
import { loadTheme } from "../../";
import { UserDetails } from "../../api/types";
import { SettingsForm } from "./components/settings-form/SettingsForm";

export default function Settings() {
  const [user, loading, error] = useAuthState(auth);
  const [userDetails, userDetailsLoading, userDetailsError] = useUserDetails(
    user?.uid!
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (loading || userDetailsLoading) return;
    if (!user) return navigate("/login");
  }, [user, loading, navigate]);

  return (
    <Container className="global-container">
      <Row>
        <Col md="auto" style={{ padding: 0 }}>
          <Navigator />
        </Col>
        <Col style={{ padding: 0 }}>
          <Header title={"Settings"} />

          <SettingsForm
            userDetails={userDetails!}
            userDetailsLoading={userDetailsLoading}
            userDetailsError={userDetailsError}
          />

          <Button onClick={() => navigate("/venue/new-venue")}>
            Add Venue
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
