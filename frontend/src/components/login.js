import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import { withRouter } from "../common/with-router";
import AuthService from "../services/auth-service";
import Footer from "./footer";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const Login = ({ router }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    AuthService.login(username, password)
      .then(() => {
        router.navigate("/home");
        window.location.reload();
      })
      .catch((error) => {
        console.log("Login Error:", error);
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        if (
          (error.response && error.response.status === 400) ||
          error.response.status === 401
        ) {
          setMessage(
            "Wrong credentials. Please check your username and password."
          );
        } else {
          setMessage(resMessage);
        }

        setLoading(false);
      });
  };

  return (
    <MDBContainer
      fluid
      className="p-5 mb-5 min-vh-80"
      style={{ marginTop: 80 }}
    >
      <MDBRow className="justify-content-center align-items-center">
        <MDBCol
          md="5"
          className="text-center text-md-start d-flex flex-column justify-content-center mb-4"
        >
          <h1
            className="my-5 display-3 fw-bold ls-tight px-3"
            style={{ color: "#313949" }}
          >
            Welcome back to <br />
            <span style={{ color: "grey" }}> myCrm !</span>
          </h1>
        </MDBCol>
        <MDBCol md="4">
          <MDBCard
            className="my-5"
            style={{
              boxShadow: "0px 1px 3px 0px #000000",
              backgroundColor: "#313949",
            }}
          >
            <MDBCardBody className="p-5">
              {/* Username field */}
              <MDBInput
                wrapperClass="mb-4"
                label="Username"
                id="formUsername"
                type="text"
                style={{
                  backgroundColor: "#2e363d",
                  border: "1px solid white",
                  boxShadow: "none",
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                validations={[required]}
              />
              {/* Password field */}
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="formPassword"
                type="password"
                style={{
                  backgroundColor: "#2e363d",
                  border: "1px solid white",
                  boxShadow: "none",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                validations={[required]}
              />

              <div className="d-grid gap-2 col-6 mx-auto">
                <button
                  className="login btn btn-outline-light"
                  disabled={loading}
                  onClick={handleLogin}
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Login</span>
                </button>
              </div>

              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      <Footer />
    </MDBContainer>
  );
};

export default withRouter(Login);
