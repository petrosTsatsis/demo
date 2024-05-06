import {getMonth, getYear} from "date-fns";
import {range} from "lodash";
import moment from "moment";
import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {CgDanger} from "react-icons/cg";
import {FaCalendarAlt, FaCheck, FaPhone, FaUser} from "react-icons/fa";
import {MdCancel, MdEmail, MdModeEdit} from "react-icons/md";
import Modal from "react-modal";
import CustomerService from "../../services/customer-service";

const EditCustomerModal = ({
  isOpen,
  onRequestClose,
  customer,
  onCustomerUpdate,
}) => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
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
    if (customer) {
      setFname(customer.fname);
      setLname(customer.lname);
      setEmail(customer.email);
      setPhoneNumber(customer.phoneNumber);
      const parsedDate = moment(customer.birthDate, "DD-MM-YYYY").toDate();
      setBirthDate(parsedDate);
    }
  }, [customer]);

  let existingAlert = document.querySelector(".alert");
  // edit customer method
  const handleSubmitEditForm = (e) => {
    e.preventDefault();
    setGenericError("");

    // check if we have any empty fields or errors in the email/phone number format
    if (
      !fname ||
      !lname ||
      !birthDate ||
      !validateEmail(email) ||
      !validatePhoneNumber(phoneNumber)
    ) {
      if (!fname || !lname || !birthDate) {
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

    CustomerService.updateCustomer(customer.id, {
      fname,
      lname,
      email,
      phoneNumber,
      birthDate: formattedBirthDate,
    })
      .then(() => {
        onRequestClose();
        fetchUpdatedCustomerData();

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
          alertDiv.textContent = "Customer details saved successfully.";

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
                "An error occurred while updating the customer. Please try again."
              );

              console.log(error.response.data);
            }
          } else {
            setGenericError(
              "An error occurred while updating the customer. Please try again."
            );
            console.log(error);
          }
        }
      });
  };

  // method to update the customer in the list-customer component
  const fetchUpdatedCustomerData = () => {
    CustomerService.getCustomer(customer.id)
      .then((response) => {
        // update the customer in the list-customers component
        onCustomerUpdate(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // method which reset the fields and error status after closing the form
  const resetState = () => {
    setFname(customer.fname);
    setLname(customer.lname);
    setEmail(customer.email);
    setPhoneNumber(customer.phoneNumber);
    const parsedDate = moment(customer.birthDate, "DD-MM-YYYY").toDate();
    setBirthDate(parsedDate);
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

  return (
    // modal with the edit form
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
          backgroundColor: "rgb(219, 213, 201, 0.6)",
        },
      }}
    >
      {/* Edit customer form */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "85vh",
        }}
      >
        <div className="container-lg" style={{ width: "600px" }}>
          <form onSubmit={handleSubmitEditForm} style={{ textAlign: "center" }}>
            <div
              style={{
                display: "inline-block",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              <h3
                style={{
                  boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                  textAlign: "center",
                  marginBottom: "20px",
                  backgroundColor: "#313949",
                  color: "#daa520",
                  borderRadius: "50px",
                  height: "40px",
                }}
              >
                {" "}
                <MdModeEdit style={{ marginBottom: "4px" }} /> Edit Customer
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
                    marginBottom: "15px",
                    marginRight: "20px",
                    position: "relative",
                  }}
                >
                  <label htmlFor="fname">
                    {" "}
                    <FaUser
                      style={{
                        paddingBottom: "5px",
                        fontSize: "18px",
                        color: "#daa520",
                      }}
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
                    onChange={(e) => setFname(e.target.value)}
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
                    marginBottom: "15px",
                    marginRight: "20px",
                    position: "relative",
                  }}
                >
                  <label htmlFor="lname">
                    {" "}
                    <FaUser
                      style={{
                        paddingBottom: "5px",
                        fontSize: "18px",
                        marginRight: "3px",
                        color: "#daa520",
                      }}
                    />
                    Last Name:
                  </label>
                  <br />
                  <input
                    type="text"
                    id="lname"
                    className="form-control-call"
                    value={lname}
                    placeholder="Last Name"
                    onChange={(e) => setLname(e.target.value)}
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
              <div style={{ marginBottom: "15px", position: "relative" }}>
                <label htmlFor="email">
                  {" "}
                  <MdEmail
                    style={{
                      paddingBottom: "1px",
                      fontSize: "18px",
                      color: "#daa520",
                    }}
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                      setGenericError("");
                    }}
                    style={{
                      width: "100%",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  />
                  {(email === "" || emailError) && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "3%",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </div>
              </div>
              {/* Phone number field */}
              <div style={{ marginBottom: "15px", position: "relative" }}>
                <label htmlFor="phoneNumber">
                  {" "}
                  <FaPhone
                    style={{
                      paddingBottom: "4px",
                      fontSize: "18px",
                      color: "#daa520",
                    }}
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
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setPhoneNumberError("");
                      setGenericError("");
                    }}
                    style={{
                      width: "50%",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  />

                  {(phoneNumber === "" || phoneNumberError) && (
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
              {/* Birth Date field */}
              <div style={{ marginBottom: "15px", position: "relative" }}>
                <label htmlFor="datePicker" style={{ display: "block" }}>
                  {" "}
                  <FaCalendarAlt
                    style={{
                      paddingBottom: "4px",
                      fontSize: "18px",
                      color: "#daa520",
                    }}
                  />{" "}
                  Birth Date:
                </label>
                <DatePicker
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
                    setGenericError("");
                    setBirthDate(birthDate);
                  }}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="DD-MM-YYYY"
                  style={{ width: "100%" }}
                />
                {(!birthDate || birthDate === "") && (
                  <CgDanger
                    className="danger-icon"
                    style={{
                      position: "absolute",
                      left: "30%",
                      top: "75%",
                      transform: "translateY(-50%)",
                    }}
                  />
                )}
              </div>
              {emailError && <p style={{ color: "#dc3545" }}>{emailError}</p>}
              {phoneNumberError && (
                <p style={{ color: "#dc3545" }}>{phoneNumberError}</p>
              )}
              {genericError && (
                <p style={{ color: "#dc3545" }}>{genericError}</p>
              )}
              {/* Submit and Cancel buttons field */}
              <div style={{ marginTop: "25px", marginBottom: "15px" }}>
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
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EditCustomerModal;
