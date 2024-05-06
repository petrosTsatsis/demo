import {default as React, useState} from "react";
import {Col, Row} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import {CgDanger} from "react-icons/cg";
import {FaCheck, FaPhone, FaUser} from "react-icons/fa";
import {HiUserAdd} from "react-icons/hi";
import {MdCancel, MdEmail} from "react-icons/md";
import {TbFileDescription} from "react-icons/tb";
import {Link} from "react-router-dom";
import {withRouter} from "../common/with-router";

import axios from "axios";
import authHeader from "../services/auth-header";

const Register = ({ router }) => {
  const API_URL = "http://localhost:8080/api/auth/";
  var register = () => {};

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [genericError, setGenericError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmailError("");
    setGenericError("");
    setEmail(email);
  };

  const onChangePassword = (e) => {
    setGenericError("");
    const password = e.target.value;
    setPassword(password);
  };

  const onChangeRole = (e) => {
    const roles = e.target.value;
    setGenericError("");
    setRoles(roles);
  };

  const onChangeFname = (e) => {
    const fname = e.target.value;
    setGenericError("");
    setFname(fname);
  };

  const onChangeLname = (e) => {
    const lname = e.target.value;
    setGenericError("");
    setLname(lname);
  };

  const onChangeDescription = (e) => {
    const description = e.target.value;
    setDescription(description);
  };

  const onChangePhoneNumber = (e) => {
    const phoneNumber = e.target.value;
    setPhoneNumberError("");
    setGenericError("");
    setPhoneNumber(phoneNumber);
  };

  register = (
    username,
    email,
    password,
    role,
    fname,
    lname,
    description,
    phoneNumber
  ) => {
    return axios.post(
      API_URL + "signup",
      {
        username,
        email,
        password,
        role: [role],
        fname,
        lname,
        description,
        phoneNumber,
      },
      { headers: authHeader() }
    );
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setGenericError("");

    // Check if we have any empty fields or errors in the email/phone number format
    if (
      !fname ||
      !lname ||
      !validateEmail(email) ||
      !validatePhoneNumber(phoneNumber)
    ) {
      if (!fname || !lname || !username || !password) {
        setGenericError("Please fill in all required fields.");
        setEmailError("");
        setPhoneNumberError("");
      } else {
        if (!validateEmail(email)) {
          setEmailError("Invalid email address");
          setPhoneNumberError("");
          setGenericError("");
        }
        if (!validatePhoneNumber(phoneNumber)) {
          setPhoneNumberError(
            "Invalid phone number. Please enter a valid 10-digit phone number."
          );
          setEmailError("");
          setGenericError("");
        }
      }

      return;
    }

    const registerPromise = register(
      username,
      email,
      password,
      roles,
      fname,
      lname,
      description,
      phoneNumber
    );

    if (registerPromise) {
      registerPromise
        .then((response) => {
          // Set the loading spinner and 1 second delay before redirect to /Users
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            window.location.href = "/Users";
          }, 1000);

          console.log(response.data);
        })
        .catch((error) => {
          setLoading(false);
          if (error.response) {
            console.log("Request Body:", {
              username,
              email,
              password,
              fname,
              lname,
              description,
              phoneNumber,
              roles,
            });
            // Handle errors based on the payload (email format, phone number format, empty fields)
            if (error.response.status === 400) {
              if (error.response.data === "Error: Email is already in use!") {
                setEmailError(
                  "Email is already in use. Please choose another email."
                );
                setPhoneNumberError("");
                setUsernameError("");
              } else if (
                error.response.data === "Error: Phone number is already in use!"
              ) {
                setPhoneNumberError(
                  "Phone number is already in use. Please use a different phone number."
                );
                setEmailError("");
                setUsernameError("");
              } else if (
                error.response.data === "Error: Username is already taken!"
              ) {
                setUsernameError(
                  "Username is already in use. Please use a different username."
                );
                setEmailError("");
                setPhoneNumberError("");
              } else {
                setGenericError(
                  "An error occurred while adding the user. Please try again."
                );
                console.log(error.response.data);
              }
            } else {
              setGenericError(
                "An error occurred while adding the user. Please try again."
              );
              console.log(error);
            }
          }
        });

      setLoading(true);
    }
  };

  // check if the email has the right form
  const validateEmail = (input) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(input);
  };

  // check if the phone number has the right form
  const validatePhoneNumber = (input) => {
    const phoneNumberRegex = /^\d{10}$/;
    return phoneNumberRegex.test(input);
  };

  // method to count the description field characters
  const maxLengthDescription = 255;

  const handleDescriptionChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxLengthDescription) {
      setDescription(inputValue);
    }
  };

  return (
    <div
      className="container-md"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "88vh",
      }}
    >
      {/* render the spinner after we have added the customer */}
      {loading && (
        <div className="text-center">
          <div
            className="spinner-border"
            role="status"
            style={{
              color: "rgb(140, 191, 64)",
              width: "5rem",
              height: "5rem",
            }}
          >
            <span className="visually-hidden">.</span>
          </div>
          <h4 style={{ color: "rgb(140, 191, 64)", marginTop: "20px" }}>
            Successfully added a new User.
          </h4>
        </div>
      )}

      {/* Add customer form */}
      {!loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "85vh",
          }}
        >
          <div className="container-lg">
            <form onSubmit={handleRegister} style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "inline-block",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                <h3
                  style={{
                    color: "#7caa56",
                    boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                    textAlign: "center",
                    marginBottom: "20px",
                    backgroundColor: "#313949",
                    borderRadius: "50px",
                    height: "40px",
                  }}
                >
                  {" "}
                  <HiUserAdd style={{ marginBottom: "4px" }} /> {""} Add User
                </h3>

                {/* First name and Last name fields */}
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      marginRight: "20px",
                      position: "relative",
                    }}
                  >
                    <label htmlFor="fname">
                      {" "}
                      <FaUser
                        style={{ paddingBottom: "5px", fontSize: "18px" }}
                      />{" "}
                      First Name:
                    </label>
                    <br />
                    <input
                      type="text"
                      id="fname"
                      className="form-control-call"
                      value={fname}
                      placeholder="First Name"
                      onChange={onChangeFname}
                      style={{
                        width: "100%",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    />
                    {fname === "" && (
                      <CgDanger
                        className="danger-icon"
                        style={{
                          position: "absolute",
                          left: "5%",
                          top: "70%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      marginRight: "20px",
                      position: "relative",
                    }}
                  >
                    <label htmlFor="lname">
                      {" "}
                      <FaUser
                        style={{ paddingBottom: "5px", fontSize: "18px" }}
                      />{" "}
                      Last Name:
                    </label>
                    <br />
                    <input
                      type="text"
                      id="lname"
                      className="form-control-call"
                      value={lname}
                      placeholder="Last Name"
                      onChange={onChangeLname}
                      style={{
                        width: "100%",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    />
                    {lname === "" && (
                      <CgDanger
                        className="danger-icon"
                        style={{
                          position: "absolute",
                          left: "5%",
                          top: "70%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </div>
                </div>
                {/* Email field */}
                <div
                  style={{
                    marginBottom: "15px",
                    position: "relative",
                    marginTop: "20px",
                  }}
                >
                  <label htmlFor="email">
                    {" "}
                    <MdEmail
                      style={{ paddingBottom: "1px", fontSize: "18px" }}
                    />{" "}
                    Email:
                  </label>
                  <br />
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      id="email"
                      placeholder="Email"
                      className="form-control-call"
                      value={email}
                      onChange={onChangeEmail}
                      style={{
                        width: "400px",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    />
                    {(email === "" || emailError) && (
                      <CgDanger
                        className="danger-icon"
                        style={{
                          position: "absolute",
                          left: "26%",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {/* Phone number field */}
                  <div
                    style={{
                      position: "relative",
                      marginRight: "25px",
                      marginLeft: "30px",
                    }}
                  >
                    <label htmlFor="phoneNumber">
                      {" "}
                      <FaPhone
                        style={{ paddingBottom: "4px", fontSize: "18px" }}
                      />{" "}
                      Phone Number:
                    </label>
                    <br />
                    <div style={{ position: "relative" }}>
                      <input
                        type="tel"
                        id="phoneNumber"
                        className={`form-control-call`}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={onChangePhoneNumber}
                        style={{
                          width: "200px",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      />

                      {(phoneNumber === "" || phoneNumberError) && (
                        <CgDanger
                          className="danger-icon"
                          style={{
                            position: "absolute",
                            left: "5%",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      position: "relative",
                      marginRight: "25px",
                    }}
                  >
                    <label htmlFor="username">
                      {" "}
                      <FaUser
                        style={{ paddingBottom: "4px", fontSize: "18px" }}
                      />{" "}
                      Username:
                    </label>
                    <br />
                    <div style={{ position: "relative" }}>
                      <input
                        type="tel"
                        id="username"
                        className={`form-control-call`}
                        placeholder="Username"
                        value={username}
                        onChange={onChangeUsername}
                        style={{
                          width: "300px",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      />

                      {(username === "" || usernameError) && (
                        <CgDanger
                          className="danger-icon"
                          style={{
                            position: "absolute",
                            left: "5%",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      marginRight: "30px",
                    }}
                  >
                    <label htmlFor="role">Role:</label>

                    <div style={{ position: "relative" }}>
                      <select
                        className="form-control-call"
                        name="role"
                        value={roles}
                        onChange={onChangeRole}
                        style={{
                          width: "200px",
                          padding: "5px",
                          textAlign: "center",
                        }}
                      >
                        <option value="">Select a role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginBottom: "15px",
                    position: "relative",
                    marginTop: "20px",
                  }}
                >
                  <label htmlFor="password">Password:</label>
                  <br />
                  <div style={{ position: "relative" }}>
                    <input
                      type="password"
                      id="password"
                      className={`form-control-call`}
                      placeholder="Password"
                      value={password}
                      onChange={onChangePassword}
                      style={{
                        width: "50%",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    />

                    {password === "" && (
                      <CgDanger
                        className="danger-icon"
                        style={{
                          position: "absolute",
                          left: "27%",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Description field */}
                <Row className="mt-4">
                  <Col>
                    <label htmlFor="description">
                      {" "}
                      <TbFileDescription style={{ fontSize: "18px" }} />{" "}
                      Description:
                    </label>
                    <br />
                    <textarea
                      id="description"
                      className="form-control-call"
                      value={description}
                      onChange={(e) => {
                        handleDescriptionChange(e);
                        onChangeDescription(e);
                      }}
                      placeholder="Description/Notes for the task..."
                      maxLength={maxLengthDescription}
                      style={{
                        width: "550px",
                        padding: "8px",
                        textAlign: "center",
                        height: "150px",
                        resize: "none",
                      }}
                    />
                    <div style={{ color: "#ff7b00", fontWeight: "bold" }}>
                      Characters Left:{" "}
                      {maxLengthDescription - description.length}
                    </div>
                  </Col>
                </Row>

                {usernameError && (
                  <p style={{ color: "#dc3545" }}>{usernameError}</p>
                )}
                {emailError && <p style={{ color: "#dc3545" }}>{emailError}</p>}
                {phoneNumberError && (
                  <p style={{ color: "#dc3545" }}>{phoneNumberError}</p>
                )}
                {genericError && (
                  <p style={{ color: "#dc3545" }}>{genericError}</p>
                )}

                {/* Submit and Cancel buttons field */}
                <div
                  className="mt-4 text-center"
                  style={{ marginBottom: "15px" }}
                >
                  <Link
                    to="/Users"
                    type="submit"
                    className="btn btn-outline-success"
                    onClick={(e) => handleRegister(e)}
                  >
                    <FaCheck style={{ marginRight: "5px" }} /> Add User
                  </Link>

                  <Link
                    to="/Users"
                    className="btn btn-outline-danger"
                    style={{ marginLeft: "10px" }}
                  >
                    <MdCancel style={{ marginRight: "5px" }} />
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withRouter(Register);
