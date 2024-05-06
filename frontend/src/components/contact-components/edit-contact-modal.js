import {getMonth, getYear} from "date-fns";
import {range} from "lodash";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {CgDanger} from "react-icons/cg";
import {FaCalendarAlt, FaCheck, FaPhone, FaUser} from "react-icons/fa";
import {MdCancel, MdEmail, MdLowPriority, MdModeEdit} from "react-icons/md";
import {TbFileDescription} from "react-icons/tb";
import Modal from "react-modal";
import ContactService from "../../services/contact-service";

const EditContactModal = ({
  isOpen,
  onRequestClose,
  contact,
  onContactUpdate,
}) => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [priority, setPriority] = useState("");
  const [notes, setNotes] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [genericError, setGenericError] = useState("");
  const years = range(1990, getYear(new Date()) + 10, 1);
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
    if (contact) {
      setFname(contact.fname);
      setLname(contact.lname);
      setEmail(contact.email);
      setPhoneNumber(contact.phoneNumber);
      const parsedDate = moment(contact.birthDate, "DD-MM-YYYY").toDate();
      setBirthDate(parsedDate);
      setPriority(contact.priority);
      setNotes(contact.notes);
    }
  }, [contact]);

  let existingAlert = document.querySelector(".alert");

  // edit contact method
  const handleSubmitEditForm = (e) => {
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

    ContactService.updateContact(contact.id, {
      fname,
      lname,
      email,
      phoneNumber,
      birthDate: formattedBirthDate,
      priority,
      notes,
    })
      .then(() => {
        onRequestClose();
        fetchUpdatedContactData();

        // Display success alert when we complete the update
        if (!existingAlert) {
          // define the appearance of the alert
          const alertDiv = document.createElement("div");
          alertDiv.className = "alert alert-success";
          alertDiv.setAttribute("role", "alert");
          alertDiv.style.width = "300px";
          alertDiv.style.height = "100px";
          alertDiv.style.position = "fixed";
          alertDiv.style.top = "10px";
          alertDiv.style.left = "50%";
          alertDiv.style.transform = "translateX(-50%)";
          alertDiv.style.zIndex = "9999";
          alertDiv.textContent = "Contact details saved successfully.";

          // Close button of the alert
          const closeButton = document.createElement("button");
          closeButton.textContent = "Okay";
          closeButton.className = "btn btn-outline-success btn-sm";
          closeButton.style.width = "80px";
          closeButton.style.borderRadius = "50px";
          closeButton.style.marginTop = "10px";
          closeButton.style.marginLeft = "90px";
          closeButton.onclick = () => {
            alertDiv.remove();
            existingAlert = null;
          };

          alertDiv.appendChild(closeButton);
          document.body.appendChild(alertDiv);
          existingAlert = alertDiv;
        }
      })
      .catch((error) => {
        if (error.response) {
          // handle errors based on the payload (email format, phone number format, empty fields)
          if (error.response.status === 400) {
            if (error.response.data === "Error: Email is already in use!") {
              setEmailError(
                "Email is already in use. Please choose another email."
              );
              setGenericError("");
              setPhoneNumberError("");
            } else if (
              error.response.data === "Error: Phone number is already in use!"
            ) {
              setPhoneNumberError(
                "Phone number is already in use. Please use a different phone number."
              );
              setEmailError("");
              setGenericError("");
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
  };

  // method to update the contact in the list-contacts component
  const fetchUpdatedContactData = () => {
    ContactService.getContactById(contact.id)
      .then((response) => {
        // update the contact in the list-contacts component
        onContactUpdate(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // method which reset the fields and error status after closing the form
  const resetState = () => {
    setFname(contact.fname);
    setLname(contact.lname);
    setEmail(contact.email);
    setPhoneNumber(contact.phoneNumber);
    const parsedDate = moment(contact.birthDate, "DD-MM-YYYY").toDate();
    setBirthDate(parsedDate);
    setPriority(contact.priority);
    setNotes(contact.notes);
    setEmailError("");
    setPhoneNumberError("");
    setGenericError("");
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
    <Modal
      className="modal-style"
      isOpen={isOpen}
      onRequestClose={() => {
        onRequestClose();
        resetState();
      }}
      contentLabel="Edit Modal"
      style={{
        content: {
          outline: "none",
        },
        overlay: {
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgb(219, 213, 201, 0.96)",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "87vh",
        }}
      >
        <div className="container-fluid">
          {/* Edit contact form */}
          <div
            className="container-fluid"
            style={{
              marginTop: "13px",
              border: "3px solid #313949",
              borderRadius: "50px",
              boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
            }}
          >
            <form
              onSubmit={handleSubmitEditForm}
              style={{ textAlign: "center" }}
            >
              <h3
                style={{
                  boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                  textAlign: "center",
                  marginBottom: "40px",
                  backgroundColor: "#313949",
                  color: "#daa520",
                  borderRadius: "50px",
                  height: "40px",
                  marginTop: "15px",
                }}
              >
                {" "}
                <MdModeEdit style={{ marginBottom: "4px" }} /> Edit Contact
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

              {/* Birth date, phone number and priority fields */}
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
                    renderCustomHeader={({ date, changeYear, changeMonth }) => (
                      <div className="custom-header-container">
                        <select
                          className="year-picker"
                          value={getYear(date)}
                          onChange={(e) => changeYear(parseInt(e.target.value))}
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
              {/* Notes field */}
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
                style={{ marginBottom: "15px" }}
              >
                <button
                  type="submit"
                  className="btn btn-outline-success mr-2"
                  style={{ marginRight: "10px" }}
                >
                  Save{" "}
                  <FaCheck
                    style={{
                      marginLeft: "4px",
                      fontSize: "15px",
                      marginBottom: "3px",
                    }}
                  />{" "}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRequestClose();
                    resetState();
                  }}
                  className="btn btn-outline-danger"
                >
                  Cancel{" "}
                  <MdCancel
                    style={{
                      marginLeft: "4px",
                      fontSize: "15px",
                      marginBottom: "3px",
                    }}
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditContactModal;
