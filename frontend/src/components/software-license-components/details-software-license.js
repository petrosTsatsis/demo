import React, {useEffect, useState} from "react";
import {Col, ListGroup, Row} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import {FaCalendarAlt, FaCheck, FaIndustry, FaPhone, FaSearch, FaUser, FaUsersCog,} from "react-icons/fa";
import {GiFlatPlatform} from "react-icons/gi";
import {GoVersions} from "react-icons/go";
import {GrCloudSoftware, GrLicense, GrStatusUnknown} from "react-icons/gr";
import {ImBin} from "react-icons/im";
import {MdCancel, MdDeveloperBoard, MdDriveFileRenameOutline, MdEmail, MdEuro, MdModeEdit,} from "react-icons/md";
import {TbCategory, TbLicense, TbListDetails} from "react-icons/tb";
import Modal from "react-modal";
import {useParams} from "react-router-dom";
import SoftwareLicenseService from "../../services/software-license-service";
import EditLicenseModal from "./edit-license-modal";

const DetailsSoftwareLicense = () => {
  // license fields
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [activationDate, setActivationDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [theSoftware, setTheSoftware] = useState(null);
  const [customer, setCustomer] = useState("");
  const [license, setLicense] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [licenseToDelete, setLicenseToDelete] = useState(null);
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

  // software fields
  const [version, setVersion] = useState("");
  const [softwareName, setSoftwareName] = useState("");
  const [developer, setDeveloper] = useState("");
  const [softwarePrice, setSoftwarePrice] = useState("");
  const [supportedPlatforms, setSupportedPlatforms] = useState([]);
  const [licensingOptions, setLicensingOptions] = useState([]);
  const [category, setCategory] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [softwareRegistrationDate, setSoftwareRegistrationDate] = useState("");
  useEffect(() => {
    fetchLicenses();
    fetchLicense();
  }, [id]);

  // fetch all the licenses
  const fetchLicenses = async () => {
    try {
      const response = await SoftwareLicenseService.getLicenses();
      setLicenses(response.data);
    } catch (error) {
      console.error("Error fetching licenses:", error);
    }
  };

  // fetch the software, customer and software to display
  const fetchLicense = async () => {
    try {
      const response = await SoftwareLicenseService.getLicenseById(id);
      const licenseData = response.data;

      // license fields
      setLicense(licenseData);
      setTheSoftware(licenseData.software);
      setCustomer(licenseData.customer);
      setName(licenseData.name);
      setStatus(licenseData.status);
      setActivationDate(licenseData.activationDate);
      setExpirationDate(licenseData.expirationDate);

      // customer/company fields
      if (licenseData.customer.fname !== null) {
        setIsCustomer(true);
        setFname(licenseData.customer.fname);
        setLname(licenseData.customer.lname);
        setCustomerEmail(licenseData.customer.email);
        setPhoneNumber(licenseData.customer.phoneNumber);
        setBirthDate(licenseData.customer.birthDate);
        setCustomerRegistrationDate(licenseData.customer.registrationDate);
      } else {
        setIsCustomer(false);
        setCompanyName(licenseData.customer.name);
        setWebsite(licenseData.customer.website);
        setCompanyEmail(licenseData.customer.email);
        setCompanyPhoneNumber(licenseData.customer.phoneNumber);
        setIndustry(licenseData.customer.industry);
        setAnnualRevenue(licenseData.customer.annualRevenue);
        setEmployeesNumber(licenseData.customer.employeesNumber);
        setCompanyRegistrationDate(licenseData.customer.registrationDate);
      }

      // software fields
      setSoftwareName(licenseData.software.name);
      setVersion(licenseData.software.version);
      setSoftwarePrice(licenseData.software.price);
      setCategory(licenseData.software.category);
      setSupportedPlatforms(licenseData.software.supportedPlatforms);
      setReleaseDate(licenseData.software.releaseDate);
      setLicensingOptions(licenseData.software.licensingOptions);
      setDeveloper(licenseData.software.developer);
      setSoftwareRegistrationDate(licenseData.software.registrationDate);
    } catch (error) {
      console.error("Error fetching the license:", error);
    }
  };

  // function to open the edit modal
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // function to close the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    fetchLicense();
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // method that is updating the licenses array with the new edit array after a license's edit
  const handleLicenseUpdate = (updatedLicense) => {
    // Update the license state with the edited data
    setLicense(updatedLicense);

    // Find the index of the updated license in the licenses array
    const updatedIndex = licenses.findIndex(
      (license) => license.id === updatedLicense.id
    );

    if (updatedIndex !== -1) {
      const updatedLicenses = [...licenses];
      updatedLicenses[updatedIndex] = updatedLicense;

      // Update the licenses state with the updated array
      setLicenses(updatedLicenses);
    }
  };
  // show the delete license confirmation modal
  const deleteSoftwareLicense = (id) => {
    setLicenseToDelete(id);
    setShowDeleteModal(true);
  };

  // license delete confirmation method
  const confirmDelete = () => {
    SoftwareLicenseService.deleteSoftwareLicense(licenseToDelete)
      .then(() => {
        fetchLicenses();
        setShowDeleteModal(false);
        window.location.href = "/SoftwareLicenses";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // view the license's customer details
  const handleViewCustomerDetails = () => {
    if (customer && isCustomer) {
      window.location.href = `/Customers/${customer.id}`;
    }else{
      window.location.href = `/Companies/${customer.id}`;
    }
  };

  // view the license's software details
  const handleViewSoftwareDetails = () => {
    if (theSoftware) {
      window.location.href = `/Software/${theSoftware.id}`;
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
        <GrLicense style={{ marginRight: "10px", marginBottom: "3px" }} />
        Software License Details
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
          {/* render the EditLicenseModal when we click the edit button*/}
          <EditLicenseModal
            isOpen={showEditModal}
            onRequestClose={handleCloseModal}
            license={license}
            onLicenseUpdate={handleLicenseUpdate}
          />
          <button
            type="button"
            className="btn btn-outline-danger"
            style={{ marginBottom: "10px" }}
            onClick={() => deleteSoftwareLicense(id)}
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

        {/* Customer Name and Software Name fields */}
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
                <GrCloudSoftware
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Software:
              </strong>{" "}
              {softwareName}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <TbLicense style={{ paddingBottom: "3px", fontSize: "20px" }} />{" "}
              <strong>Name:</strong> {name}
            </p>{" "}
          </Col>
        </Row>

        {/* Activation and Expiration date fields */}
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
                Activation Date:
              </strong>{" "}
              {activationDate}
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

        {/* Status field */}
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
                <GrStatusUnknown
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Status:
              </strong>{" "}
              {status}
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
              marginTop: "30px",
              borderRadius: "10px",
              textAlign: "center",
              paddingTop: "1px",
              position: "relative",
            }}
          >
            {/* View Details Button */}
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
            {/* View Details Button */}
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
      {/* Software field */}
      <h3
        className="container-lg"
        style={{
          marginTop: "50px",
          boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
          color: "black",
          textAlign: "center",
          marginBottom: "40px",
          backgroundColor: "rgb(120, 186, 67, 0.7)",
          color: "#313949",
          borderRadius: "50px",
          height: "40px",
        }}
      >
        <GrCloudSoftware style={{ marginRight: "10px", marginBottom: "3px" }} />
        Software Details
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
        <div style={{ position: "absolute", top: "180px", marginLeft: "15px" }}>
          <button
            type="button"
            className="btn btn-outline-warning btn-lg"
            style={{ marginBottom: "10px" }}
            onClick={() => handleViewSoftwareDetails()}
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
        {/* Software Name, Category and Version fields */}
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
                <MdDriveFileRenameOutline
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Name:
              </strong>{" "}
              {softwareName}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <GoVersions
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Version:
              </strong>{" "}
              {version}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <TbCategory
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Category:
              </strong>{" "}
              {category}
            </p>{" "}
          </Col>
        </Row>
        {/* Licensing Options and Supported Platforms fields */}
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
            <div
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <TbLicense style={{ paddingBottom: "5px", fontSize: "20px" }} />{" "}
                Licensing Options:
              </strong>{" "}
              <ListGroup>
                {licensingOptions.map((option, index) => (
                  <ListGroup.Item
                    key={index}
                    style={{ backgroundColor: "transparent" }}
                  >
                    {option}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>

          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <div
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <GiFlatPlatform
                  style={{ paddingBottom: "5px", fontSize: "20px" }}
                />{" "}
                Supported Platforms:
              </strong>{" "}
              <ListGroup>
                {supportedPlatforms.map((option, index) => (
                  <ListGroup.Item
                    key={index}
                    style={{ backgroundColor: "transparent" }}
                  >
                    {option}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
        </Row>

        {/* Price, Developer, registration date and release date fields */}
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
              <strong>Price:</strong> {softwarePrice}
              <MdEuro style={{ marginBottom: "3px" }} />{" "}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <MdDeveloperBoard
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Developer:
              </strong>{" "}
              {developer}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
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
              {softwareRegistrationDate}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <FaCalendarAlt
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Release Date:
              </strong>{" "}
              {releaseDate}
            </p>{" "}
          </Col>
        </Row>
      </div>

      {/* Modal that shows up for delete confirmation */}
      {licenseToDelete && (
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
          <h2>Delete Software License Confirmation</h2>
          <p>Are you sure you want to delete this software license ?</p>
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

export default DetailsSoftwareLicense;
