import {getMonth, getYear} from "date-fns";
import {range} from "lodash";
import moment from "moment";
import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {CgDanger} from "react-icons/cg";
import {FaCalendarAlt, FaCheck} from "react-icons/fa";
import {GrStatusUnknown} from "react-icons/gr";
import {LuFileType} from "react-icons/lu";
import {MdCancel, MdElectricalServices, MdModeEdit} from "react-icons/md";
import Modal from "react-modal";
import SSLCertificateService from "../../services/ssl-certificate-service";

const EditSSLCertificateModal = ({
  isOpen,
  onRequestClose,
  certificate,
  onCertificateUpdate,
}) => {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [issuer, setIssuer] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
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
    if (certificate) {
      setType(certificate.type);
      setIssuer(certificate.issuer);
      setStatus(certificate.status);
      const parsedExpirationDate = moment(
        certificate.expirationDate,
        "DD-MM-YYYY"
      ).toDate();
      setExpirationDate(parsedExpirationDate);
    }
  }, [certificate]);

  let existingAlert = document.querySelector(".alert");

  // edit certificate method
  const handleSubmitEditForm = (e) => {
    e.preventDefault();
    setGenericError("");

    // check if we have any empty fields
    if (!type || !status || !issuer || !expirationDate) {
      setGenericError("Please fill in all required fields.");
      return;
    }

    // Format the date to "dd-mm-yyyy"
    const formattedExpirationDate = moment(expirationDate).format("DD-MM-YYYY");

    SSLCertificateService.updateCertificate(certificate.id, {
      type,
      status,
      issuer,
      expirationDate: formattedExpirationDate,
    })
      .then(() => {
        onRequestClose();
        fetchUpdatedCertificateData();

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
          alertDiv.textContent = "SSL Certificate details saved successfully.";

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
            "An error occurred while updating the certificate. Please try again."
          );
          console.log(error);
        }
      });
  };

  // method to update the certificate in the list-certificates component
  const fetchUpdatedCertificateData = () => {
    SSLCertificateService.getCertificateById(certificate.id)
      .then((response) => {
        // update the certificate in the list-certificates component
        onCertificateUpdate(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // method which reset the fields and error status after closing the form
  const resetState = () => {
    setType(certificate.type);
    setIssuer(certificate.issuer);
    setStatus(certificate.status);
    const parsedExpirationDate = moment(
      certificate.expirationDate,
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
      {/* Edit certificate form */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "85vh",
        }}
      >
        <div className="container-lg">
          <form
            onSubmit={handleSubmitEditForm}
            style={{ textAlign: "center", width: "350px" }}
          >
            <div
              style={{
                display: "inline-block",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              <h4
                style={{
                  boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                  textAlign: "center",
                  marginBottom: "20px",
                  backgroundColor: "#313949",
                  color: "#daa520",
                  borderRadius: "50px",
                }}
              >
                {" "}
                <MdModeEdit style={{ marginBottom: "4px" }} /> Edit SSL
                Certificate
              </h4>
              {/* Type field */}

              <div
                style={{
                  marginBottom: "15px",
                  position: "relative",
                }}
              >
                <label htmlFor="type">
                  {" "}
                  <LuFileType
                    style={{
                      paddingBottom: "4px",
                      fontSize: "23px",
                      color: "orange",
                    }}
                  />{" "}
                  Type:
                </label>
                <br />
                <select
                  id="type"
                  className="form-control-call"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                  style={{
                    width: "100%",
                    padding: "5px",
                    textAlign: "center",
                  }}
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="DV">Domain Validated (DV)</option>
                  <option value="OV">Organization Validated (OV)</option>
                  <option value="EV">Extended Validation (EV)</option>
                  <option value="Wildcard">Wildcard SSL</option>
                  <option value="Multi-Domain">Multi-Domain SSL</option>
                  <option value="CodeSigning">Code Signing Certificate</option>
                  <option value="SMIME">S/MIME Certificate</option>
                  <option value="Client">Client Certificate</option>
                  <option value="Server">Server Certificate</option>
                  <option value="UnifiedComm">
                    Unified Communications Certificate
                  </option>
                </select>
                {type === "" && (
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
              {/* Issuer field */}
              <div style={{ marginBottom: "15px", position: "relative" }}>
                <label htmlFor="issuer">
                  {" "}
                  <MdElectricalServices
                    style={{
                      paddingBottom: "4px",
                      fontSize: "23px",
                      color: "orange",
                    }}
                  />{" "}
                  Issuer:
                </label>
                <br />
                <select
                  id="issuer"
                  className="form-control-call"
                  value={issuer}
                  onChange={(e) => {
                    setIssuer(e.target.value);
                  }}
                  style={{
                    width: "100%",
                    padding: "5px",
                    textAlign: "center",
                  }}
                >
                  <option value="" disabled>
                    Select Issuer
                  </option>
                  <option value="Symantec">Symantec</option>
                  <option value="GeoTrust">GeoTrust</option>
                  <option value="RapidSSL">RapidSSL</option>
                  <option value="Thawte">Thawte</option>
                  <option value="Comodo">Comodo</option>
                  <option value="DigiCert">DigiCert</option>
                  <option value="Entrust">Entrust</option>
                  <option value="GlobalSign">GlobalSign</option>
                  <option value="GoDaddy">GoDaddy</option>
                  <option value="Sectigo">Sectigo</option>
                </select>
                {issuer === "" && (
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

              {/* Expiration Date field */}
              <div style={{ marginBottom: "15px", position: "relative" }}>
                <label htmlFor="datePicker" style={{ display: "block" }}>
                  {" "}
                  <FaCalendarAlt
                    style={{
                      paddingBottom: "4px",
                      fontSize: "18px",
                      color: "orange",
                    }}
                  />{" "}
                  Expiration Date:
                </label>
                <DatePicker
                  className="purchase-date"
                  minDate={new Date()}
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
                    setGenericError("");
                    setExpirationDate(expirationDate);
                  }}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="DD-MM-YYYY"
                  style={{ width: "100%" }}
                />
                {(!expirationDate || expirationDate === "") && (
                  <CgDanger
                    className="danger-icon"
                    style={{
                      position: "absolute",
                      left: "22%",
                      top: "75%",
                      transform: "translateY(-50%)",
                    }}
                  />
                )}
              </div>
              {/* Status field */}
              <div style={{ marginBottom: "15px", position: "relative" }}>
                <label htmlFor="licensingOption" style={{ display: "block" }}>
                  {" "}
                  <GrStatusUnknown
                    style={{
                      paddingBottom: "5px",
                      fontSize: "22px",
                      color: "orange",
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
                    width: "250px",
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

              {genericError && (
                <p style={{ color: "#dc3545" }}>{genericError}</p>
              )}

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
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EditSSLCertificateModal;
