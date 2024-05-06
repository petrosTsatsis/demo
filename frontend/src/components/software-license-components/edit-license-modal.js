import {getMonth, getYear} from "date-fns";
import {range} from "lodash";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {CgDanger} from "react-icons/cg";
import {FaCalendarAlt, FaCheck} from "react-icons/fa";
import {GrStatusUnknown} from "react-icons/gr";
import {MdCancel, MdModeEdit} from "react-icons/md";
import {TbLicense} from "react-icons/tb";
import Modal from "react-modal";
import SoftwareLicenseService from "../../services/software-license-service";

const EditSoftwareLicenseModal = ({
  isOpen,
  onRequestClose,
  license,
  onLicenseUpdate,
}) => {
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [activationDate, setActivationDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [theSoftware, setTheSoftware] = useState(null);
  const [customer, setCustomer] = useState("");
  const [software, setSoftware] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [genericError, setGenericError] = useState("");
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
    if (license) {
      setName(license.name);
      setStatus(license.status);
      const parsedActivationDate = moment(
        license.activationDate,
        "DD-MM-YYYY"
      ).toDate();
      setActivationDate(parsedActivationDate);
      const parsedExpirationDate = moment(
        license.expirationDate,
        "DD-MM-YYYY"
      ).toDate();
      setExpirationDate(parsedExpirationDate);
    }
  }, [license]);

  let existingAlert = document.querySelector(".alert");

  // edit license method
  const handleSubmitEditForm = (e) => {
    e.preventDefault();
    setGenericError("");

    // check if we have any empty fields
    if (!name || !status || !activationDate || !expirationDate) {
      setGenericError("Please fill in all required fields.");
      return;
    }

    // Format the date to "dd-mm-yyyy"
    const formattedActivationDate = moment(activationDate).format("DD-MM-YYYY");

    // Format the date to "dd-mm-yyyy"
    const formattedExpirationDate = moment(expirationDate).format("DD-MM-YYYY");

    SoftwareLicenseService.updateLicense(license.id, {
      name,
      status,
      activationDate: formattedActivationDate,
      expirationDate: formattedExpirationDate,
    })
      .then(() => {
        onRequestClose();
        fetchUpdatedLicenseData();

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
          alertDiv.textContent = "Software License details saved successfully.";

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
          setGenericError(
            "An error occurred while updating the license. Please try again."
          );
          console.log(error);
        }
      });
  };

  // method to update the license in the list-licenses component
  const fetchUpdatedLicenseData = () => {
    SoftwareLicenseService.getLicenseById(license.id)
      .then((response) => {
        // update the license in the list-licenses component
        onLicenseUpdate(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // method which reset the fields and error status after closing the form
  const resetState = () => {
    setName(license.name);
    setTheSoftware(license.software);
    setCustomer(license.customer);
    setStatus(license.status);
    const parsedActivationDate = moment(
      license.activationDate,
      "DD-MM-YYYY"
    ).toDate();
    setActivationDate(parsedActivationDate);
    const parsedExpirationDate = moment(
      license.expirationDate,
      "DD-MM-YYYY"
    ).toDate();
    setExpirationDate(parsedExpirationDate);
    setGenericError("");
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "85vh",
        }}
      >
        <div className="container-lg">
          {/* edit license form  */}
          <form
            onSubmit={handleSubmitEditForm}
            className="container-fluid"
            style={{
              marginTop: "13px",
              textAlign: "center",
            }}
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
              <MdModeEdit style={{ marginBottom: "4px" }} /> Edit Software
              License
            </h3>
            {/* Activation, Expiration and Status fields  */}
            <Row
              className="mt-4"
              style={{
                marginBottom: "30px",

                marginTop: "20px",
              }}
            >
              <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  style={{
                    marginBottom: "15px",
                    position: "relative",
                  }}
                >
                  <label htmlFor="activationDate" style={{ display: "block" }}>
                    {" "}
                    <FaCalendarAlt
                      style={{
                        paddingBottom: "5px",
                        fontSize: "22px",
                        color: "#daa520",
                      }}
                    />{" "}
                    Activation Date
                  </label>
                  <DatePicker
                    className="purchase-date"
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
                    selected={activationDate}
                    onChange={(activationDate) => {
                      setActivationDate(activationDate);
                    }}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                  />
                  {activationDate === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "8%",
                        top: "70%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </div>
              </Col>

              <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  style={{
                    marginBottom: "15px",
                    position: "relative",
                  }}
                >
                  <label htmlFor="expirationDate" style={{ display: "block" }}>
                    {" "}
                    <FaCalendarAlt
                      style={{
                        paddingBottom: "5px",
                        fontSize: "22px",
                        color: "#daa520",
                      }}
                    />{" "}
                    Expiration Date
                  </label>
                  <DatePicker
                    className="purchase-date"
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
                    selected={expirationDate}
                    onChange={(expirationDate) => {
                      setExpirationDate(expirationDate);
                    }}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                  />
                  {expirationDate === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "8%",
                        top: "70%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </div>
              </Col>

              <Col className="d-flex justify-content-center align-items-center">
                <div
                  style={{
                    marginBottom: "15px",
                    position: "relative",
                  }}
                >
                  <label htmlFor="licensingOption" style={{ display: "block" }}>
                    {" "}
                    <GrStatusUnknown
                      style={{
                        paddingBottom: "5px",
                        fontSize: "22px",
                        color: "#daa520",
                      }}
                    />{" "}
                    Status
                  </label>
                  <select
                    id="status"
                    className="form-control-call"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                    style={{
                      width: "200px",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    <option value="" disabled>
                      Set Status
                    </option>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                  </select>
                  {status === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "8%",
                        top: "70%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </div>
              </Col>
            </Row>

            {/* License name field  */}
            <Row
              className="mt-4 justify-content-center"
              style={{
                marginBottom: "30px",
                marginTop: "20px",
              }}
            >
              <Col className="d-flex justify-content-center align-items-center">
                <div
                  style={{
                    marginBottom: "15px",
                    position: "relative",
                  }}
                >
                  <label htmlFor="licensingOption" style={{ display: "block" }}>
                    {" "}
                    <TbLicense
                      style={{
                        paddingBottom: "5px",
                        fontSize: "22px",
                        color: "#daa520",
                      }}
                    />{" "}
                    License Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control-call"
                    value={name}
                    placeholder="License Name"
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "250px",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  />
                  {name === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "8%",
                        top: "70%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </div>
              </Col>
            </Row>

            <div className="mt-4 text-center" style={{ marginBottom: "15px" }}>
              {genericError && (
                <p style={{ color: "#dc3545" }}>{genericError}</p>
              )}
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
    </Modal>
  );
};

export default EditSoftwareLicenseModal;
