import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import {
    FaCalendarAlt,
    FaCertificate,
    FaCheck,
    FaIndustry,
    FaPhone,
    FaSearch,
    FaUser,
    FaUsersCog,
} from "react-icons/fa";
import {GrStatusUnknown} from "react-icons/gr";
import {ImBin} from "react-icons/im";
import {LuFileType} from "react-icons/lu";
import {MdCancel, MdElectricalServices, MdEmail, MdEuro, MdModeEdit,} from "react-icons/md";
import {TbListDetails} from "react-icons/tb";
import Modal from "react-modal";
import {useParams} from "react-router-dom";
import SSLCertificateService from "../../services/ssl-certificate-service";
import EditSSLCertificateModal from "./edit-ssl-certificate-modal";

const DetailsSSLCertificate = () => {
  // certificate fields
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [issuer, setIssuer] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);

  // customer fields
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [customerRegistrationDate, setCustomerRegistrationDate] = useState("");

  // company fields
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [employeesNumber, setEmployeesNumber] = useState("");
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [industry, setIndustry] = useState("");
  const [companyRegistrationDate, setCompanyRegistrationDate] = useState("");

  useEffect(() => {
    fetchCertificates();
    fetchCertificate();
  }, [id]);

  // fetch all the certificates
  const fetchCertificates = async () => {
    try {
      const response = await SSLCertificateService.getCertificates();
      setCertificates(response.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  // fetch the certificate, customer and software to display
  const fetchCertificate = async () => {
    try {
      const response = await SSLCertificateService.getCertificateById(id);
      const certificateData = response.data;
      console.log(response.data.registrationDate);

      // certificate fields
      setCertificate(certificateData);
      setCustomer(certificateData.customer);
      setType(certificateData.type);
      setStatus(certificateData.status);
      setIssuer(certificateData.issuer);
      setExpirationDate(certificateData.expirationDate);
      setRegistrationDate(certificateData.registrationDate);

      // customer/company fields
      if (certificateData.customer.fname !== null) {
        setIsCustomer(true);
        setFname(certificateData.customer.fname);
        setLname(certificateData.customer.lname);
        setCustomerEmail(certificateData.customer.email);
        setPhoneNumber(certificateData.customer.phoneNumber);
        setBirthDate(certificateData.customer.birthDate);
        setCustomerRegistrationDate(certificateData.customer.registrationDate);
      } else {
        setIsCustomer(false);
        setCompanyName(certificateData.customer.name);
        setWebsite(certificateData.customer.website);
        setCompanyEmail(certificateData.customer.email);
        setCompanyPhoneNumber(certificateData.customer.phoneNumber);
        setIndustry(certificateData.customer.industry);
        setAnnualRevenue(certificateData.customer.annualRevenue);
        setEmployeesNumber(certificateData.customer.employeesNumber);
        setCompanyRegistrationDate(certificateData.customer.registrationDate);
      }
    } catch (error) {
      console.error("Error fetching the certificate:", error);
    }
  };

  // function to open the edit modal
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // function to close the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    fetchCertificate();
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // method that is updating the certificates array with the new edit array after a certificate's edit
  const handleCertificateUpdate = (updatedCertificate) => {
    // Update the certificate state with the edited data
    setCertificate(updatedCertificate);

    // Find the index of the updated certificate in the certificates array
    const updatedIndex = certificates.findIndex(
      (certificate) => certificate.id === updatedCertificate.id
    );

    if (updatedIndex !== -1) {
      const updatedCertificates = [...certificates];
      updatedCertificates[updatedIndex] = updatedCertificate;

      // Update the certificates state with the updated array
      setCertificates(updatedCertificates);
    }
  };

  const deleteCertificate = (id) => {
    setCertificateToDelete(id);
    setShowDeleteModal(true);
  };

  // software delete confirmation method
  const confirmDelete = () => {
    SSLCertificateService.deleteSSLCertificate(certificateToDelete)
      .then(() => {
        fetchCertificates();
        setShowDeleteModal(false);
        window.location.href = "/SSLCertificates";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // view the certificate's customer details
  const handleViewCustomerDetails = () => {
    if (customer) {
      window.location.href = `/Customers/${customer.id}`;
    }
  };

  return (
    <div className="container-fluid">
      <h3
        className="container-lg"
        style={{
          marginTop: "50px",
          boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
          color: "black",
          textAlign: "center",
          marginBottom: "40px",
          backgroundColor: "#313949",
          color: "white",
          borderRadius: "50px",
          height: "40px",
        }}
      >
        <FaCertificate style={{ marginRight: "10px", marginBottom: "3px" }} />
        SSL Certificate Details
      </h3>

      <div
        className="container-md"
        style={{
          boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
          backgroundColor: "#313949",
          marginTop: "50px",
          borderRadius: "10px",
          textAlign: "center",
          paddingTop: "1px",
          position: "relative",
        }}
      >
        {/* Edit and Delete Buttons */}
        <div style={{ position: "absolute", top: "150px", marginLeft: "13px" }}>
          <button
            type="button"
            className="btn btn-outline-success"
            style={{ marginBottom: "10px", marginRight: "10px" }}
            onClick={handleEditClick}
          >
            Edit
            <MdModeEdit
              style={{
                marginLeft: "6px",
                marginBottom: "5px",
                fontSize: "18px",
              }}
            />
          </button>
          {/* render the EditSSLCertificateModal when we click the edit button*/}
          <EditSSLCertificateModal
            isOpen={showEditModal}
            onRequestClose={handleCloseModal}
            certificate={certificate}
            onCertificateUpdate={handleCertificateUpdate}
          />
          <button
            type="button"
            className="btn btn-outline-danger"
            style={{ marginBottom: "10px" }}
            onClick={() => deleteCertificate(id)}
          >
            Delete
            <ImBin
              style={{
                marginLeft: "6px",
                marginBottom: "5px",
                fontSize: "18px",
              }}
            />
          </button>
        </div>

        {/* Customer name, Issuer and status fields */}
        <Row
          className="mt-4"
          style={{
            marginBottom: "30px",
            marginTop: "20px",
          }}
        >
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <FaUser style={{ paddingBottom: "3px", fontSize: "20px" }} />{" "}
                {isCustomer ? "Customer:" : "Company:"}
              </strong>{" "}
              {isCustomer ? `${customer.fname} ${customer.lname}` : companyName}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <MdElectricalServices
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Issuer:
              </strong>{" "}
              {issuer}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <GrStatusUnknown
                style={{ paddingBottom: "3px", fontSize: "20px" }}
              />{" "}
              <strong>Status:</strong> {status}
            </p>{" "}
          </Col>
        </Row>

        {/* registration and expiration date fields */}
        <Row
          className="mt-4 justify-content-center"
          style={{
            marginTop: "20px",
            marginBottom: "30px",
          }}
        >
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <FaCalendarAlt
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Registration Date:
              </strong>{" "}
              {registrationDate}
            </p>{" "}
          </Col>

          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <FaCalendarAlt
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Expiration Date:
              </strong>{" "}
              {expirationDate}
            </p>{" "}
          </Col>
        </Row>

        {/* Type field */}
        <Row
          className="mt-4 justify-content-center"
          style={{
            marginTop: "20px",
            marginBottom: "30px",
          }}
        >
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <p
              className="customer-detail-fields"
              style={{ width: "400px", padding: "10px" }}
            >
              <strong>
                <LuFileType
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Type:
              </strong>{" "}
              {type}
            </p>{" "}
          </Col>
        </Row>
      </div>

      {/* Customer field */}
      {isCustomer ? (
        <>
          <h3
            className="container-lg"
            style={{
              marginTop: "50px",
              boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
              color: "black",
              textAlign: "center",
              marginBottom: "40px",
              backgroundColor: "rgb(200, 204, 81, 0.6)",
              color: "#313949",
              borderRadius: "50px",
              height: "40px",
            }}
          >
            <FaUser style={{ marginRight: "10px", marginBottom: "3px" }} />
            Customer Details
          </h3>

          <div
            className="container-md"
            style={{
              boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
              backgroundColor: "#313949",
              marginTop: "50px",
              borderRadius: "10px",
              textAlign: "center",
              paddingTop: "1px",
              position: "relative",
            }}
          >
            {/* Edit and Delete Buttons */}
            <div
              style={{ position: "absolute", top: "120px", marginLeft: "15px" }}
            >
              <button
                type="button"
                className="btn btn-outline-warning btn-lg"
                style={{ marginBottom: "10px" }}
                onClick={() => handleViewCustomerDetails()}
              >
                View Details{" "}
                <TbListDetails
                  style={{
                    marginLeft: "4px",
                    marginBottom: "3px",
                    fontSize: "18px",
                  }}
                />{" "}
              </button>
            </div>

            {/* First name and Last name fields */}
            <Row
              className="mt-4 justify-content-center"
              style={{
                marginBottom: "30px",
                marginTop: "20px",
              }}
            >
              <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
              >
                <p
                  className="customer-detail-fields"
                  style={{
                    textAlign: "center",
                    width: "300px",
                    padding: "10px",
                  }}
                >
                  <strong>
                    {" "}
                    <FaUser
                      style={{ paddingBottom: "5px", fontSize: "18px" }}
                    />{" "}
                    First Name:
                  </strong>{" "}
                  {fname}
                </p>{" "}
              </Col>
              <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
              >
                <p
                  className="customer-detail-fields"
                  style={{
                    textAlign: "center",
                    width: "300px",
                    padding: "10px",
                  }}
                >
                  <strong>
                    {" "}
                    <FaUser
                      style={{ paddingBottom: "5px", fontSize: "18px" }}
                    />{" "}
                    Last Name:
                  </strong>{" "}
                  {lname}
                </p>{" "}
              </Col>
            </Row>

            {/* Email field */}
            <Row
              className="mt-4"
              style={{
                marginBottom: "45px",
                marginTop: "20px",
              }}
            >
              <Col className="d-flex justify-content-center align-items-center">
                <p
                  className="customer-detail-fields"
                  style={{ width: "400px", margin: "0 auto", padding: "10px" }}
                >
                  <strong>
                    {" "}
                    <MdEmail
                      style={{ paddingBottom: "1px", fontSize: "18px" }}
                    />{" "}
                    Email:
                  </strong>{" "}
                  {customerEmail}
                </p>
              </Col>
            </Row>

            {/* Birth date, phone number and registration date fields */}
            <Row
              className="mt-4"
              style={{
                marginBottom: "30px",
                marginTop: "20px",
              }}
            >
              <Col className="d-flex justify-content-center align-items-center">
                <p
                  className="customer-detail-fields"
                  style={{
                    textAlign: "center",
                    width: "300px",
                    padding: "10px",
                  }}
                >
                  <strong>
                    {" "}
                    <FaCalendarAlt
                      style={{ paddingBottom: "5px", fontSize: "20px" }}
                    />{" "}
                    Birth Date:
                  </strong>{" "}
                  {birthDate}
                </p>{" "}
              </Col>
              <Col className="d-flex justify-content-center align-items-center">
                <p
                  className="customer-detail-fields"
                  style={{
                    textAlign: "center",
                    width: "300px",
                    padding: "10px",
                  }}
                >
                  <strong>
                    {" "}
                    <FaPhone
                      style={{ paddingBottom: "5px", fontSize: "20px" }}
                    />{" "}
                    Phone Number:
                  </strong>{" "}
                  {phoneNumber}
                </p>{" "}
              </Col>
              <Col className="d-flex justify-content-center align-items-center">
                <p
                  className="customer-detail-fields"
                  style={{
                    textAlign: "center",
                    width: "300px",
                    padding: "10px",
                  }}
                >
                  <strong>
                    {" "}
                    <FaCalendarAlt
                      style={{ paddingBottom: "5px", fontSize: "20px" }}
                    />{" "}
                    Registration Date:
                  </strong>{" "}
                  {customerRegistrationDate}
                </p>{" "}
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <>
          <h3
            className="container-lg"
            style={{
              marginTop: "50px",
              boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
              color: "black",
              textAlign: "center",
              marginBottom: "40px",
              backgroundColor: "rgb(200, 204, 81, 0.6)",
              color: "#313949",
              borderRadius: "50px",
              height: "40px",
            }}
          >
            <FaUser style={{ marginRight: "10px", marginBottom: "3px" }} />
            Customer Details
          </h3>

          <div
            className="container-md"
            style={{
              boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
              backgroundColor: "#313949",
              marginTop: "30px",
              borderRadius: "10px",
              textAlign: "center",
              paddingTop: "1px",
              position: "relative",
            }}
          >
            {/* Edit and Delete Buttons */}
            <div
              style={{ position: "absolute", top: "120px", marginLeft: "15px" }}
            >
              <button
                type="button"
                className="btn btn-outline-warning btn-lg"
                style={{ marginBottom: "10px" }}
                onClick={() => handleViewCustomerDetails()}
              >
                View Details{" "}
                <TbListDetails
                  style={{
                    marginLeft: "4px",
                    marginBottom: "3px",
                    fontSize: "18px",
                  }}
                />{" "}
              </button>
            </div>

            {/* Name, Website and Phone Number fields */}
            <Row
              className="mt-4"
              style={{
                marginBottom: "30px",
                marginTop: "20px",
              }}
            >
              <Col className="d-flex justify-content-center align-items-center">
                <p
                  className="customer-detail-fields"
                  style={{
                    textAlign: "center",
                    width: "300px",
                    padding: "10px",
                  }}
                >
                  <strong>
                    {" "}
                    <FaUser
                      style={{ paddingBottom: "5px", fontSize: "18px" }}
                    />{" "}
                    Name:
                  </strong>{" "}
                  {companyName}
                </p>{" "}
              </Col>
              <Col className="d-flex justify-content-center align-items-center">
                <p
                  className="customer-detail-fields"
                  style={{
                    textAlign: "center",
                    width: "300px",
                    padding: "10px",
                  }}
                >
                  <strong>
                    {" "}
                    <FaSearch
                      style={{
                        paddingBottom: "5px",
                        fontSize: "18px",
                        marginRight: "3px",
                      }}
                    />
                    Website:
                  </strong>{" "}
                  {website}
                </p>{" "}
              </Col>
              <Col className="d-flex justify-content-center align-items-center">
                <p
                  className="customer-detail-fields"
                  style={{
                    textAlign: "center",
                    width: "300px",
                    padding: "10px",
                  }}
                >
                  <strong>
                    {" "}
                    <FaPhone
                      style={{ paddingBottom: "4px", fontSize: "18px" }}
                    />{" "}
                    Phone Number:
                  </strong>{" "}
                  {companyPhoneNumber}
                </p>{" "}
              </Col>
            </Row>

            {/* Email and Industry field */}
            <Row
              className="mt-4 justify-content-center"
              style={{
                marginBottom: "50px",
                marginTop: "20px",
              }}
            >
              <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
              >
                <p
                  className="customer-detail-fields"
                  style={{ width: "400px", margin: "0 auto", padding: "10px" }}
                >
                  <strong>
                    {" "}
                    <MdEmail
                      style={{ paddingBottom: "1px", fontSize: "18px" }}
                    />{" "}
                    Email:
                  </strong>{" "}
                  {companyEmail}
                </p>
              </Col>

              <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
              >
                <p
                  className="customer-detail-fields"
                  style={{ width: "300px", margin: "0 auto", padding: "10px" }}
                >
                  <strong>
                    {" "}
                    <FaIndustry
                      style={{ paddingBottom: "4px", fontSize: "18px" }}
                    />{" "}
                    Industry:
                  </strong>{" "}
                  {industry}
                </p>
              </Col>
            </Row>

            {/* Employees Number, Annual revenue and Registration date fields */}
            <Row
              className="mt-4"
              style={{
                marginBottom: "30px",
                marginTop: "20px",
              }}
            >
              <Col className="d-flex justify-content-center align-items-center">
                <p
                  className="customer-detail-fields"
                  style={{
                    textAlign: "center",
                    width: "300px",
                    padding: "10px",
                  }}
                >
                  <strong>
                    {" "}
                    <MdEuro
                      style={{ paddingBottom: "4px", fontSize: "18px" }}
                    />{" "}
                    Annual Revenue:
                  </strong>{" "}
                  {annualRevenue}
                </p>{" "}
              </Col>
              <Col className="d-flex justify-content-center align-items-center">
                <p
                  className="customer-detail-fields"
                  style={{
                    textAlign: "center",
                    width: "300px",
                    padding: "10px",
                  }}
                >
                  <strong>
                    {" "}
                    <FaUsersCog
                      style={{ paddingBottom: "4px", fontSize: "18px" }}
                    />{" "}
                    Number Of Employees:
                  </strong>{" "}
                  {employeesNumber}
                </p>{" "}
              </Col>
              <Col className="d-flex justify-content-center align-items-center">
                <p
                  className="customer-detail-fields"
                  style={{
                    textAlign: "center",
                    width: "300px",
                    padding: "10px",
                  }}
                >
                  <strong>
                    {" "}
                    <FaCalendarAlt
                      style={{ paddingBottom: "4px", fontSize: "18px" }}
                    />{" "}
                    Registration Date:
                  </strong>{" "}
                  {companyRegistrationDate}
                </p>{" "}
              </Col>
            </Row>
          </div>
        </>
      )}

      {/* Modal that shows up for delete confirmation */}
      {certificateToDelete && (
        <Modal
          className="delete-modal-style"
          isOpen={showDeleteModal}
          onRequestClose={closeDeleteModal}
          contentLabel="Delete Confirmation"
          style={{
            content: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "400px",
              marginTop: "10%",
              height: "220px",
              textAlign: "center",
            },
            overlay: {
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgb(49, 57, 73, 0.9)",
            },
          }}
        >
          <h2>Delete SSL Certificate Confirmation</h2>
          <p>Are you sure you want to delete this SSL Certificate ?</p>
          <div>
            <button className="btn btn-outline-success" onClick={confirmDelete}>
              <FaCheck style={{ marginRight: "5px" }} /> Yes
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={closeDeleteModal}
              style={{ marginLeft: "10px" }}
            >
              <MdCancel style={{ marginRight: "5px" }} />
              No
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DetailsSSLCertificate;
