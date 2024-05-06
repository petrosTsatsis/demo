import {getMonth, getYear} from "date-fns";
import {range} from "lodash";
import moment from "moment";
import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {CgDanger} from "react-icons/cg";
import {FaCalendarAlt, FaCheck, FaPhone, FaUser} from "react-icons/fa";
import {IoMdPersonAdd} from "react-icons/io";
import {MdCancel, MdEmail} from "react-icons/md";
import {Link, useParams} from "react-router-dom";
import CustomerService from "../../services/customer-service";

const AddCustomer = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
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
      CustomerService.getCustomer(id)
        .then((response) => {
          setFname(response.data.fname);
          setLname(response.data.lname);
          setPhoneNumber(response.data.phoneNumber);
          setEmail(response.data.email);
          setBirthDate(response.data.birthDate);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  // add customer method
  const addCustomer = (e) => {
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

    const customer = {
      fname,
      lname,
      phoneNumber,
      email,
      birthDate: formattedBirthDate,
    };

    CustomerService.addCustomer(customer)
      .then((response) => {
        //set the loading spinner and 1 second delay before redirect to /Customers
        setTimeout(() => {
          setLoading(false);
          window.location.href = "/Customers";
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
                "An error occurred while adding the customer. Please try again."
              );
              console.log(error.response.data);
            }
          } else {
            setGenericError(
              "An error occurred while adding the customer. Please try again."
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

  return (
    <div
      className="container-md"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
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
            Successfully added a new Customer.
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
          <div className="container-lg" style={{ width: "600px" }}>
            <form onSubmit={addCustomer} style={{ textAlign: "center" }}>
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
                  <IoMdPersonAdd style={{ marginBottom: "4px" }} /> Add Customer
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
                      style={{ paddingBottom: "4px", fontSize: "18px" }}
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
                <div
                  className="mt-4 text-center"
                  style={{ marginBottom: "15px" }}
                >
                  <Link
                    to="/Customers"
                    type="submit"
                    className="btn btn-outline-success"
                    onClick={(e) => addCustomer(e)}
                  >
                    <FaCheck style={{ marginRight: "5px" }} /> Add Customer
                  </Link>

                  <Link
                    to="/Customers"
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

export default AddCustomer;
