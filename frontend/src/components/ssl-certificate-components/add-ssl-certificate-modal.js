import {getMonth, getYear} from "date-fns";
import {range} from "lodash";
import moment from "moment";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {AiFillSafetyCertificate} from "react-icons/ai";
import {CgDanger} from "react-icons/cg";
import {FaCalendarAlt, FaCheck} from "react-icons/fa";
import {LuFileType} from "react-icons/lu";
import {MdCancel, MdElectricalServices} from "react-icons/md";
import Modal from "react-modal";
import SslCertificateService from "../../services/ssl-certificate-service";

const AddSSLCertificateModal = ({ isOpen, onRequestClose, customer }) => {
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

  // method to add the certificate
  const handleAddCertificate = async (event) => {
    event.preventDefault();

    try {
      // Check if type, issuer, or expiration date is empty
      if (!type || !issuer || !expirationDate) {
        throw new Error(
          "Type, issuer, and expiration date are required fields."
        );
      }

      const sslCertificate = {
        type: type,
        issuer: issuer,
        expirationDate: formattedDate,
      };

      const response = await SslCertificateService.addSSLCertificate(
        sslCertificate,
        customer.id
      );

      console.log(response.data);

      onRequestClose();
      resetState();
      window.location.reload();
    } catch (error) {
      console.error("Error adding SSL certificate:", error);
      if (
        error.message ===
        "Type, issuer, and expiration date are required fields."
      ) {
        setGenericError("Please fill in all required fields.");
      } else {
        setGenericError("Failed to add SSL certificate. Please try again.");
      }
    }
  };

  const resetState = () => {
    setExpirationDate("");
    setType("");
    setIssuer("");
    setGenericError("");
  };

  // format the date to "dd-mm-yyyy"
  const formattedDate = moment(expirationDate).format("DD-MM-YYYY");
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
          backgroundColor: "rgb(219, 213, 201, 0.6)",
        },
      }}
    >
      {/* Add certificate form */}
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
            onSubmit={handleAddCertificate}
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
                  height: "35px",
                  color: "#7caa56",
                }}
              >
                {" "}
                <AiFillSafetyCertificate style={{ marginBottom: "6px" }} /> Add
                SSL Certificate
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
                    }}
                  />{" "}
                  Expiration Date:
                </label>
                <DatePicker
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
              {genericError && (
                <p style={{ color: "#dc3545" }}>{genericError}</p>
              )}

              {/* Submit and Cancel buttons field */}
              <div style={{ marginTop: "25px", marginBottom: "20px" }}>
                <button
                  type="submit"
                  className="btn btn-outline-success mr-2"
                  style={{ marginRight: "10px" }}
                >
                  Add Certificate{" "}
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

export default AddSSLCertificateModal;
