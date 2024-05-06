import React, {useEffect, useState} from "react";
import {CgDanger} from "react-icons/cg";
import {FaBuilding, FaCheck, FaIndustry, FaPhone, FaSearch, FaUsersCog,} from "react-icons/fa";
import {MdCancel, MdEmail, MdEuro, MdModeEdit} from "react-icons/md";
import {TbFileDescription} from "react-icons/tb";
import Modal from "react-modal";
import NumberPicker from "react-widgets/NumberPicker";
import CompanyService from "../../services/company-service";

const EditCompanyModal = ({
  isOpen,
  onRequestClose,
  company,
  onCompanyUpdate,
}) => {
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

  useEffect(() => {
    if (company) {
      setName(company.name);
      setWebsite(company.website);
      setEmail(company.email);
      setPhoneNumber(company.phoneNumber);
      setIndustry(company.industry);
      setAnnualRevenue(company.annualRevenue);
      setEmployeesNumber(company.employeesNumber);
      setDescription(company.description);
    }
  }, [company]);

  let existingAlert = document.querySelector(".alert");
  // edit company method
  const handleSubmitEditForm = (e) => {
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

    CompanyService.updateCompany(company.id, {
      name,
      website,
      phoneNumber,
      email,
      employeesNumber,
      annualRevenue,
      industry,
      description,
    })
      .then(() => {
        onRequestClose();
        fetchUpdatedCompanyData();

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
          alertDiv.textContent = "Company details saved successfully.";

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
  };

  // method to update the company in the list-companies component
  const fetchUpdatedCompanyData = () => {
    CompanyService.getCompanyById(company.id)
      .then((response) => {
        // update the company in the list-companies component
        onCompanyUpdate(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // method which reset the fields and error status after closing the form
  const resetState = () => {
    setName(company.name);
    setWebsite(company.website);
    setEmail(company.email);
    setPhoneNumber(company.phoneNumber);
    setIndustry(company.industry);
    setAnnualRevenue(company.annualRevenue);
    setEmployeesNumber(company.employeesNumber);
    setDescription(company.description);
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

  // method to count the description/notes field characters
  const maxLength = 355;

  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxLength) {
      setDescription(inputValue);
    }
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
      {/* Edit company form */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "85vh",
        }}
      >
        <div className="container-lg">
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
                  marginTop: "15px",
                }}
              >
                {" "}
                <MdModeEdit style={{ marginBottom: "4px" }} /> Edit Company
              </h3>
              {/* Company name and Website field */}
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
                      style={{
                        paddingBottom: "5px",
                        fontSize: "18px",
                        color: "#daa520",
                      }}
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
                        color: "#daa520",
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

              {/* Email and Phone Number field */}
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
              {/* Employees Number, Annual revenue and Industry field */}
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
                      style={{
                        paddingBottom: "4px",
                        fontSize: "18px",
                        color: "#daa520",
                      }}
                    />{" "}
                    Employees
                  </label>

                  <NumberPicker
                    defaultValue={0}
                    min={0}
                    value={parseInt(employeesNumber)}
                    onChange={(value) => setEmployeesNumber(value)}
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
                      style={{
                        paddingBottom: "4px",
                        fontSize: "18px",
                        color: "#daa520",
                      }}
                    />{" "}
                    Annual Revenue
                  </label>

                  <NumberPicker
                    format={{ style: "currency", currency: "EUR" }}
                    defaultValue={0}
                    min={0}
                    value={parseFloat(annualRevenue)}
                    onChange={(value) => setAnnualRevenue(value)}
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
                      style={{
                        paddingBottom: "4px",
                        fontSize: "18px",
                        color: "#daa520",
                      }}
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
                    <TbFileDescription
                      style={{ marginRight: "3px", color: "#daa520" }}
                    />
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

export default EditCompanyModal;
