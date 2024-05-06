import {getMonth, getYear} from "date-fns";
import {range} from "lodash";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {CgDanger} from "react-icons/cg";
import {FaCalendarAlt, FaCheck, FaPhone, FaUser} from "react-icons/fa";
import {IoMdPersonAdd} from "react-icons/io";
import {MdCancel, MdEmail, MdLowPriority} from "react-icons/md";
import {TbFileDescription} from "react-icons/tb";
import {Link, useParams} from "react-router-dom";
import ContactService from "../../services/contact-service";

const AddContact = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [priority, setPriority] = useState("");
  const [notes, setNotes] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [genericError, setGenericError] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const years = range(1955, getYear(new Date()) + 10, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (id) {
      ContactService.getContact(id)
        .then((response) => {
          setFname(response.data.fname);
          setLname(response.data.lname);
          setPhoneNumber(response.data.phoneNumber);
          setEmail(response.data.email);
          setBirthDate(response.data.birthDate);
          setPriority(response.data.priority);
          setNotes(response.data.notes);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  // add contact method
  const addContact = (e) => {
    e.preventDefault();

    setGenericError("");

    // check if we have any empty fields or errors in the email/phone number format
    if (
      !fname ||
      !lname ||
      !birthDate ||
      !priority ||
      !validateEmail(email) ||
      !validatePhoneNumber(phoneNumber)
    ) {
      if (!fname || !lname || !birthDate || !priority) {
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

    // format the date to "dd-mm-yyyy"
    const formattedBirthDate = moment(birthDate).format("DD-MM-YYYY");

    const contact = {
      fname,
      lname,
      phoneNumber,
      email,
      birthDate: formattedBirthDate,
      priority,
      notes,
    };

    ContactService.addContact(contact)
      .then((response) => {
        //set the loading spinner and 1 second delay before redirect to /Contacts/myContacts
        setTimeout(() => {
          setLoading(false);
          window.history.back();
        }, 1000);

        console.log(response.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          // handle errors based on the payload (email format, phone number format, empty fields)
          if (error.response.status === 400) {
            if (error.response.data === "Error: Email is already in use!") {
              setEmailError(
                "Email is already in use. Please choose another email."
              );
              setPhoneNumberError("");
            } else if (
              error.response.data === "Error: Phone number is already in use!"
            ) {
              setPhoneNumberError(
                "Phone number is already in use. Please use a different phone number."
              );
              setEmailError("");
            } else {
              setGenericError(
                "An error occurred while adding the contact. Please try again."
              );
              console.log(error.response.data);
            }
          } else {
            setGenericError(
              "An error occurred while adding the contact. Please try again."
            );
            console.log(error);
          }
        }
      });

    setLoading(true);
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

  // method to count the notes field characters
  const maxLengthNotes = 255;

  const handleNotesChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxLengthNotes) {
      setNotes(inputValue);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "87vh",
      }}
    >
      {/* render the spinner after we have added the contact */}
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
            Successfully added a new Contact.
          </h4>
        </div>
      )}
      <div>
        <div className="container-fluid">
          {/* Add contact form */}
          {!loading && (
            <div
              className="container-fluid"
              style={{
                marginTop: "13px",
                border: "3px solid #313949",
                borderRadius: "50px",
                boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
              }}
            >
              <form onSubmit={addContact} style={{ textAlign: "center" }}>
                <h3
                  style={{
                    boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                    textAlign: "center",
                    marginBottom: "40px",
                    backgroundColor: "#313949",
                    color: "#7caa56",
                    borderRadius: "50px",
                    height: "40px",
                    marginTop: "15px",
                  }}
                >
                  {" "}
                  <IoMdPersonAdd style={{ marginBottom: "4px" }} /> Add Contact
                </h3>

                {/* First name and Last name fields */}
                <Row
                  className="mt-4 justify-content-center"
                  style={{
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <Col style={{ position: "relative" }}>
                    <label htmlFor="fname" style={{ color: "black" }}>
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
                      className="software-text"
                      value={fname}
                      placeholder="First Name"
                      onChange={(e) => setFname(e.target.value)}
                      style={{
                        width: "250px",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    />
                    {fname === "" && (
                      <CgDanger
                        className="danger-icon"
                        style={{
                          position: "absolute",
                          left: "16%",
                          top: "70%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </Col>

                  <Col style={{ position: "relative" }}>
                    <label htmlFor="lname" style={{ color: "black" }}>
                      {" "}
                      <FaUser
                        style={{
                          paddingBottom: "5px",
                          fontSize: "18px",
                          marginRight: "3px",
                        }}
                      />
                      Last Name:
                    </label>
                    <br />
                    <input
                      type="text"
                      id="lname"
                      className="software-text"
                      value={lname}
                      placeholder="Last Name"
                      onChange={(e) => setLname(e.target.value)}
                      style={{
                        width: "250px",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    />
                    {lname === "" && (
                      <CgDanger
                        className="danger-icon"
                        style={{
                          position: "absolute",
                          left: "16%",
                          top: "70%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </Col>
                </Row>

                {/* Email field */}
                <Row
                  className="mt-4 justify-content-center"
                  style={{
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <Col style={{ position: "relative" }}>
                    <label htmlFor="email" style={{ color: "black" }}>
                      {" "}
                      <MdEmail
                        style={{ paddingBottom: "1px", fontSize: "18px" }}
                      />{" "}
                      Email:
                    </label>
                    <br />
                    <input
                      type="text"
                      id="email"
                      placeholder="Email"
                      className="software-text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                        setGenericError("");
                      }}
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
                          left: "22%",
                          top: "70%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </Col>
                </Row>

                <Row
                  className="mt-4"
                  style={{
                    marginBottom: "30px",
                    marginTop: "20px",
                  }}
                >
                  <Col className="text-center" style={{ position: "relative" }}>
                    <label htmlFor="name" style={{ color: "black" }}>
                      {" "}
                      <FaCalendarAlt
                        style={{ paddingBottom: "5px", fontSize: "22px" }}
                      />{" "}
                      Birth Date:
                    </label>
                    <br />
                    <DatePicker
                      className="contact-birthdate"
                      renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                      }) => (
                        <div className="custom-header-container">
                          <select
                            className="year-picker"
                            value={getYear(date)}
                            onChange={(e) =>
                              changeYear(parseInt(e.target.value))
                            }
                          >
                            {years.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          <select
                            className="month-picker"
                            value={months[getMonth(date)]}
                            onChange={(e) =>
                              changeMonth(months.indexOf(e.target.value))
                            }
                          >
                            {months.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      selected={birthDate}
                      onChange={(birthDate) => {
                        setBirthDate(birthDate);
                      }}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="DD-MM-YYYY"
                    />
                    {birthDate === "" && (
                      <CgDanger
                        className="danger-icon"
                        style={{
                          position: "absolute",
                          left: "12%",
                          top: "70%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </Col>
                  <Col style={{ position: "relative" }}>
                    <label htmlFor="phoneNumber" style={{ color: "black" }}>
                      {" "}
                      <FaPhone
                        style={{ paddingBottom: "4px", fontSize: "18px" }}
                      />{" "}
                      Phone Number:
                    </label>
                    <br />

                    <input
                      type="tel"
                      id="phoneNumber"
                      className="software-text"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setPhoneNumberError("");
                        setGenericError("");
                      }}
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
                          left: "10%",
                          top: "70%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </Col>
                  <Col style={{ position: "relative" }}>
                    <label htmlFor="priority" style={{ color: "black" }}>
                      {" "}
                      <MdLowPriority style={{ fontSize: "20px" }} /> Priority:
                    </label>
                    <br />

                    <select
                      id="priority"
                      className="software-text"
                      value={priority}
                      onChange={(e) => {
                        setPriority(e.target.value);
                      }}
                      style={{
                        width: "200px",
                        textAlign: "center",
                        padding: "4px",
                      }}
                    >
                      <option value="" disabled>
                        Select Priority
                      </option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    {priority === "" && (
                      <CgDanger
                        className="danger-icon"
                        style={{
                          position: "absolute",
                          left: "10%",
                          top: "70%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </Col>
                </Row>

                <Row
                  className="mt-4"
                  style={{
                    marginBottom: "30px",

                    marginTop: "20px",
                  }}
                >
                  <Col>
                    <label htmlFor="notes" style={{ color: "black" }}>
                      {" "}
                      <TbFileDescription style={{ fontSize: "18px" }} /> Notes:
                    </label>
                    <br />
                    <textarea
                      id="notes"
                      className="software-text"
                      value={notes}
                      onChange={handleNotesChange}
                      placeholder="Notes for the contact..."
                      maxLength={maxLengthNotes}
                      style={{
                        width: "500px",
                        padding: "8px",
                        textAlign: "center",
                        height: "130px",
                        resize: "none",
                      }}
                    />
                    <div style={{ color: "#ff7b00", fontWeight: "bold" }}>
                      Characters Left: {maxLengthNotes - notes.length}
                    </div>
                  </Col>
                </Row>

                {phoneNumberError && (
                  <p style={{ color: "#dc3545" }}>{phoneNumberError}</p>
                )}
                {emailError && <p style={{ color: "#dc3545" }}>{emailError}</p>}
                {genericError && (
                  <p style={{ color: "#dc3545" }}>{genericError}</p>
                )}

                {/* Submit and Cancel buttons field */}
                <div
                  className="mt-4 text-center"
                  style={{ marginBottom: "20px" }}
                >
                  <Link
                    type="submit"
                    className="btn btn-outline-success"
                    onClick={(e) => addContact(e)}
                  >
                    <FaCheck style={{ marginRight: "5px" }} /> Add Contact
                  </Link>

                  <button
                    className="btn btn-outline-danger"
                    style={{ marginLeft: "10px" }}
                    onClick={() => window.history.back()}
                  >
                    <MdCancel style={{ marginRight: "5px" }} />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddContact;
