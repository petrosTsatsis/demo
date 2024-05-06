import React, {useEffect, useState} from "react";
import {Col, ListGroup, Row} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import {BiPurchaseTag} from "react-icons/bi";
import {FaCalendarAlt, FaCheck, FaIndustry, FaPhone, FaSearch, FaUser, FaUsersCog,} from "react-icons/fa";
import {GiFlatPlatform} from "react-icons/gi";
import {GoVersions} from "react-icons/go";
import {GrCloudSoftware} from "react-icons/gr";
import {ImBin} from "react-icons/im";
import {MdCancel, MdDeveloperBoard, MdDriveFileRenameOutline, MdEmail, MdEuro, MdModeEdit,} from "react-icons/md";
import {TbCategory, TbLicense, TbListDetails} from "react-icons/tb";
import Modal from "react-modal";
import {useParams} from "react-router-dom";
import PurchaseService from "../../services/purchase-service";
import EditPurchaseModal from "./edit-purchase-modal";

const DetailsPurchase = () => {
  // purchase fields
  const { id } = useParams();
  const [price, setPrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [licensingOption, setLicensingOption] = useState("");
  const [theSoftware, setTheSoftware] = useState(null);
  const [customer, setCustomer] = useState("");
  const [purchase, setPurchase] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);
  const [purchaseRegistrationDate, setPurchaseRegistrationDate] = useState("");
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
    fetchPurchases();
    fetchPurchase();
  }, [id]);

  // fetch all the purchases
  const fetchPurchases = async () => {
    try {
      const response = await PurchaseService.getAllPurchases();
      setPurchases(response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  // fetch the purchase, customer and software to display
  const fetchPurchase = async () => {
    try {
      const response = await PurchaseService.getPurchase(id);
      const purchaseData = response.data;

      // purchase fields
      setPurchase(purchaseData);
      setTheSoftware(purchaseData.software);
      setCustomer(purchaseData.customer);
      setLicensingOption(purchaseData.licensingOption);
      setPrice(purchaseData.price);
      setPurchaseDate(purchaseData.purchaseDate);
      setPurchaseRegistrationDate(purchaseData.registrationDate);

      // customer/company fields
      if (purchaseData.customer.fname !== null) {
        setIsCustomer(true);
        setFname(purchaseData.customer.fname);
        setLname(purchaseData.customer.lname);
        setCustomerEmail(purchaseData.customer.email);
        setPhoneNumber(purchaseData.customer.phoneNumber);
        setBirthDate(purchaseData.customer.birthDate);
        setCustomerRegistrationDate(purchaseData.customer.registrationDate);
      } else {
        setIsCustomer(false);
        setCompanyName(purchaseData.customer.name);
        setWebsite(purchaseData.customer.website);
        setCompanyEmail(purchaseData.customer.email);
        setCompanyPhoneNumber(purchaseData.customer.phoneNumber);
        setIndustry(purchaseData.customer.industry);
        setAnnualRevenue(purchaseData.customer.annualRevenue);
        setEmployeesNumber(purchaseData.customer.employeesNumber);
        setCompanyRegistrationDate(purchaseData.customer.registrationDate);
      }

      // software fields
      setSoftwareName(purchaseData.software.name);
      setVersion(purchaseData.software.version);
      setSoftwarePrice(purchaseData.software.price);
      setCategory(purchaseData.software.category);
      setSupportedPlatforms(purchaseData.software.supportedPlatforms);
      setReleaseDate(purchaseData.software.releaseDate);
      setLicensingOptions(purchaseData.software.licensingOptions);
      setDeveloper(purchaseData.software.developer);
      setSoftwareRegistrationDate(purchaseData.software.registrationDate);
    } catch (error) {
      console.error("Error fetching the purchase:", error);
    }
  };

  // function to open the edit modal
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // function to close the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    fetchPurchase();
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // method that is updating the purchases array with the new edit array after a purchase's edit
  const handlePurchaseUpdate = (updatedPurchase) => {
    // Update the purchase state with the edited data
    setPurchase(updatedPurchase);

    // Find the index of the updated purchase in the purchases array
    const updatedIndex = purchases.findIndex(
      (purchase) => purchase.id === updatedPurchase.id
    );

    if (updatedIndex !== -1) {
      const updatedPurchases = [...purchases];
      updatedPurchases[updatedIndex] = updatedPurchase;

      // Update the purchases state with the updated array
      setPurchases(updatedPurchases);
    }
  };
  // show the delete purchase confirmation modal
  const deletePurchase = (id) => {
    setPurchaseToDelete(id);
    setShowDeleteModal(true);
  };

  // purchase delete confirmation method
  const confirmDelete = () => {
    PurchaseService.deletePurchase(purchaseToDelete)
      .then(() => {
        fetchPurchases();
        setShowDeleteModal(false);
        window.location.href = "/Purchases";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // view the purchase's customer details
  const handleViewCustomerDetails = () => {
    if (customer && isCustomer) {
      window.location.href = `/Customers/${customer.id}`;
    }else{
      window.location.href = `/Companies/${customer.id}`;
    }
  };

  // view the purchase's software details
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
        <BiPurchaseTag style={{ marginRight: "10px", marginBottom: "3px" }} />
        Purchase Details
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
          {/* render the EditPurchaseModal when we click the edit button*/}
          <EditPurchaseModal
            isOpen={showEditModal}
            onRequestClose={handleCloseModal}
            purchase={purchase}
            onPurchaseUpdate={handlePurchaseUpdate}
          />
          <button
            type="button"
            className="btn btn-outline-danger"
            style={{ marginBottom: "10px" }}
            onClick={() => deletePurchase(id)}
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

        {/* Customer name, Software name and Price fields */}
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
              <strong>Price:</strong> {price}
              <MdEuro style={{ paddingBottom: "3px", fontSize: "20px" }} />{" "}
            </p>{" "}
          </Col>
        </Row>

        {/* Licensing Option and Purchase Date fields */}
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
                <TbLicense style={{ paddingBottom: "3px", fontSize: "20px" }} />{" "}
                Licensing Option:
              </strong>{" "}
              {licensingOption}
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
                Purchase Date:
              </strong>{" "}
              {purchaseDate}
            </p>{" "}
          </Col>
        </Row>

        {/* registration date field */}
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
              {purchaseRegistrationDate}
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
            {/* Details Button */}
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

            {/* first name and last name fields */}
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
            {/* View Details button */}
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

      {/* software field */}
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
      {purchaseToDelete && (
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
              height: "200px",
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
          <h2>Delete Purchase Confirmation</h2>
          <p>Are you sure you want to delete this purchase ?</p>
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

export default DetailsPurchase;
