import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import CompanyService from "../../services/company-service";
import {CgDanger} from "react-icons/cg";
import {FaBuilding, FaCheck, FaIndustry, FaPhone, FaSearch, FaUsersCog,} from "react-icons/fa";
import {MdCancel, MdEmail, MdEuro} from "react-icons/md";
import NumberPicker from "react-widgets/NumberPicker";
import {BsBuildingFillAdd} from "react-icons/bs";
import {TbFileDescription} from "react-icons/tb";

const AddCompany = () => {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [employeesNumber, setEmployeesNumber] = useState("");
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [genericError, setGenericError] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      CompanyService.getCompany(id)
        .then((response) => {
          setName(response.data.fname);
          setPhoneNumber(response.data.phoneNumber);
          setEmail(response.data.email);
          setEmployeesNumber(response.data.employeesNumber);
          setAnnualRevenue(response.data.annualRevenue);
          setIndustry(response.data.industry);
          setDescription(response.data.description);
          setWebsite(response.data.website);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  // add company method
  const addCompany = (e) => {
    e.preventDefault();

    setGenericError("");

    // check if we have any empty fields or errors in the email/phone number format
    if (!name || !validateEmail(email) || !validatePhoneNumber(phoneNumber)) {
      if (!name) {
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

    const company = {
      name,
      website,
      phoneNumber,
      email,
      employeesNumber,
      annualRevenue,
      industry,
      description,
    };

    CompanyService.addCompany(company)
      .then((response) => {
        //set the loading spinner and 1 second delay before redirect to /Companies
        setTimeout(() => {
          setLoading(false);
          window.location.href = "/Companies";
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
                "An error occurred while adding the company. Please try again."
              );
              console.log(error.response.data);
            }
          } else {
            setGenericError(
              "An error occurred while adding the company. Please try again."
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

  // method to count the description/notes field characters
  const maxLength = 355;

  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxLength) {
      setDescription(inputValue);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "85vh",
      }}
    >
      {/* render the spinner after we have added the company */}
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
            Successfully added a new Company.
          </h4>
        </div>
      )}
      <div style={{ marginTop: "20px" }}>
        <div className="container-lg">
          {/* Add company form */}
          {!loading && (
            <form
              onSubmit={addCompany}
              style={{
                textAlign: "center",
                width: "900px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  textAlign: "center",
                  marginTop: "20px",
                  width: "900px",
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
                  <BsBuildingFillAdd style={{ marginBottom: "4px" }} /> Add
                  Company
                </h3>

                {/* Company name and website field */}
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
                      marginRight: "40px",
                      position: "relative",
                    }}
                  >
                    <label htmlFor="name">
                      {" "}
                      <FaBuilding
                        style={{ paddingBottom: "5px", fontSize: "18px" }}
                      />{" "}
                      Name:
                    </label>
                    <br />
                    <input
                      type="text"
                      id="name"
                      className="form-control-call"
                      value={name}
                      placeholder="Company Name"
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: "400px",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    />
                    {name === "" && (
                      <CgDanger
                        className="danger-icon"
                        style={{
                          position: "absolute",
                          left: "4%",
                          top: "70%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </div>

                  <div style={{ marginBottom: "15px", position: "relative" }}>
                    <label htmlFor="website">
                      {" "}
                      <FaSearch
                        style={{
                          paddingBottom: "5px",
                          fontSize: "18px",
                          marginRight: "3px",
                        }}
                      />
                      Website:
                    </label>
                    <br />
                    <input
                      type="text"
                      id="website"
                      className="form-control-call"
                      value={website}
                      placeholder="Website"
                      onChange={(e) => setWebsite(e.target.value)}
                      style={{
                        width: "400px",
                        padding: "4px",
                        textAlign: "center",
                      }}
                    />
                  </div>
                </div>

                {/* Email and phone number field */}
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
                      position: "relative",
                      marginRight: "40px",
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
                            left: "4%",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        />
                      )}
                    </div>
                  </div>

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
                            left: "7%",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* Employees number, Annual revenue and Industry field */}
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
                      marginRight: "40px",
                      position: "relative",
                    }}
                  >
                    <label
                      htmlFor="datePicker"
                      style={{ display: "block", marginRight: "60px" }}
                    >
                      {" "}
                      <FaUsersCog
                        style={{ paddingBottom: "4px", fontSize: "18px" }}
                      />{" "}
                      Employees
                    </label>

                    <NumberPicker
                      defaultValue={0}
                      min={0}
                      value={parseInt(employeesNumber)}
                      onChange={(value) => setEmployeesNumber(value)}
                      placeholder="Select Number"
                    />
                  </div>
                  <div
                    style={{
                      marginBottom: "15px",
                      marginRight: "40px",
                      position: "relative",
                    }}
                  >
                    <label
                      htmlFor="datePicker"
                      style={{ display: "block", marginRight: "60px" }}
                    >
                      {" "}
                      <MdEuro
                        style={{ paddingBottom: "4px", fontSize: "18px" }}
                      />{" "}
                      Annual Revenue
                    </label>

                    <NumberPicker
                      format={{ style: "currency", currency: "EUR" }}
                      defaultValue={0}
                      min={0}
                      value={parseFloat(annualRevenue)}
                      onChange={(value) => setAnnualRevenue(value)}
                      placeholder="Select Annual Revenue"
                    />
                  </div>

                  <div
                    style={{
                      marginBottom: "15px",
                      position: "relative",
                    }}
                  >
                    <label htmlFor="industry" style={{ display: "block" }}>
                      {" "}
                      <FaIndustry
                        style={{ paddingBottom: "4px", fontSize: "18px" }}
                      />{" "}
                      Industry
                    </label>
                    <select
                      id="industry"
                      className="form-control-call"
                      value={industry}
                      onChange={(e) => {
                        setIndustry(e.target.value);
                      }}
                      style={{
                        width: "200px",
                        padding: "5px",
                        textAlign: "center",
                      }}
                    >
                      <option value="" disabled>
                        Select Industry
                      </option>
                      <option value="Banking">Banking</option>
                      <option value="Construction">Construction</option>
                      <option value="Education">Education</option>
                      <option value="Energy">Energy</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Information Technology">
                        Information Technology
                      </option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail</option>
                      <option value="Technology">Technology</option>
                      <option value="Telecommunications">
                        Telecommunications
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  {/* Notes/Description field */}
                  <div style={{ textAlign: "center", width: "650px" }}>
                    <label
                      htmlFor="notes"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <TbFileDescription style={{ marginRight: "3px" }} />
                      Notes:
                    </label>
                    <textarea
                      id="notes"
                      className="form-control-notes"
                      value={description}
                      onChange={handleChange}
                      placeholder="Add notes..."
                      maxLength={maxLength}
                      style={{
                        width: "650px",
                        padding: "8px",
                        textAlign: "center",
                        height: "80px",
                        resize: "none",
                      }}
                    />
                    <div style={{ color: "orange" }}>
                      Characters Left: {maxLength - description.length}
                    </div>
                  </div>
                </div>

                {emailError && <p style={{ color: "#dc3545" }}>{emailError}</p>}
                {phoneNumberError && (
                  <p style={{ color: "#dc3545", marginTop: "10px" }}>
                    {phoneNumberError}
                  </p>
                )}
                {genericError && (
                  <p style={{ color: "#dc3545" }}>{genericError}</p>
                )}

                {/* Submit and Cancel buttons field */}
                <div
                  className="mt-4 text-center"
                  style={{ marginBottom: "10px" }}
                >
                  <Link
                    to="/Companies"
                    type="submit"
                    className="btn btn-outline-success"
                    onClick={(e) => addCompany(e)}
                  >
                    <FaCheck style={{ marginRight: "5px" }} /> Add Company
                  </Link>

                  <Link
                    to="/Companies"
                    className="btn btn-outline-danger"
                    style={{ marginLeft: "10px" }}
                  >
                    <MdCancel style={{ marginRight: "5px" }} />
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCompany;
