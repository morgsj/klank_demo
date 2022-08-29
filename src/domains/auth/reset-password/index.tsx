import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth } from "../../../firebase";
import "./Reset.css";
import { Button, Form } from "react-bootstrap";
import { sendPasswordReset } from "../../../api/user-api";
function Index() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading, navigate]);

  return (
    <div className="reset">
      <div className="reset-container">
        <Form>
          <Form.Group>
            <Form.Control
              type="text"
              className="register-textBox"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail Address"
            />
          </Form.Group>

          <Button
            className="reset-btn"
            onClick={() => sendPasswordReset(email)}
          >
            Send password reset email
          </Button>
        </Form>

        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Index;
