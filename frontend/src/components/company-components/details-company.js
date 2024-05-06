import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Card, CardBody, Col, Row} from "react-bootstrap";
import CompanyService from "../../services/company-service";
import Avatar from "react-avatar";
import Modal from "react-modal";
import {MdCancel, MdEmail, MdEuro, MdModeEdit} from "react-icons/md";
import {ImBin} from "react-icons/im";
import {FaCalendarAlt, FaCheck, FaDatabase, FaIndustry, FaPhone, FaSearch, FaUser, FaUsersCog,} from "react-icons/fa";
import {BsBuildings} from "react-icons/bs";
import EditCompanyModal from "./edit-company-modal";
import CompanyDetailsTables from "./company-details-tables";
import {CgDanger} from "react-icons/cg";
import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import {IoIosAddCircleOutline, IoIosRemoveCircleOutline,} from "react-icons/io";
import AddContactsModal from "./add-contacts-modal";
import AddSSLCertificateModal from "../ssl-certificate-components/add-ssl-certificate-modal";

const DetailsCompany = () => {
  const [companies, setCompanies] = useState([]);
  const { id } = useParams();
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [employeesNumber, setEmployeesNumber] = useState("");
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [company, setCompany] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [currentPageContact, setCurrentPageContact] = React.useState(1);
  const [rowsPerPageContact, setRowsPerPageContact] = React.useState(5);
  const [biggestContact, setBiggestContact] = useState(null);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAddCertificateModal, setShowAddCertificateModal] = useState(false);
  const [contactToRemove, setContactToRemove] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  useEffect(() => {
    fetchCompanies();
    fetchCompany();
    fetchContacts();
  }, [id]);

  useEffect(() => {
    const biggestContact = findBiggestContact();
    setBiggestContact(biggestContact);
  }, [contacts]);

  // fetch all the companies
  const fetchCompanies = async () => {
    try {
      const response = await CompanyService.getAllCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // find company's latest contact which is the one with the biggest id
  const findBiggestContact = () => {
    if (contacts.length === 0) return null;

    let biggestContact = contacts[0];
    for (let i = 1; i < contacts.length; i++) {
      if (contacts[i].id > biggestContact.id) {
        biggestContact = contacts[i];
      }
    }
    return biggestContact;
  };

  // fetch the company to display
  const fetchCompany = async () => {
    try {
      const response = await CompanyService.getCompanyById(id);
      console.log(response.data);
      const companyData = response.data;
      setCompany(companyData);
      setName(companyData.name);
      setWebsite(companyData.website);
      setEmail(companyData.email);
      setPhoneNumber(companyData.phoneNumber);
      setIndustry(companyData.industry);
      setAnnualRevenue(companyData.annualRevenue);
      setEmployeesNumber(companyData.employeesNumber);
      setDescription(companyData.description);
      setRegistrationDate(companyData.registrationDate);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  // fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await CompanyService.getContacts(id);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // function to open the add contacts modal
  const handleAddContactsClick = () => {
    setShowAddContactModal(true);
  };

  // function to close the add contacts modal
  const handleCloseAddContactModal = () => {
    setShowAddContactModal(false);
  };

  // function to open the edit modal
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // function to close the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    fetchCompany();
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // close remove modal
  const closeRemoveModal = () => {
    setShowRemoveModal(false);
  };

  // function to open the certificate modal
  const handleAddCertificateClick = () => {
    setShowAddCertificateModal(true);
  };

  // function to close the certificate modal
  const handleCloseCertificateModal = () => {
    setShowAddCertificateModal(false);
    fetchCompany();
  };

  // method that sorts the contacts by their first name
  const sortByFirstName = () => {
    const sortedContacts = [...contacts].sort((a, b) =>
      a.fname.localeCompare(b.fname)
    );
    setContacts(sortedContacts);
  };

  // method that sorts the contacts by their first name
  const sortByLastName = () => {
    const sortedContacts = [...contacts].sort((a, b) =>
      a.lname.localeCompare(b.lname)
    );
    setContacts(sortedContacts);
  };

  // method that sorts the contacts by the registration date
  const sortByRegistrationDate = () => {
    const sortedContacts = [...contacts].sort((a, b) => {
      const dateA = new Date(a.registrationDate.split("-").reverse().join("-"));
      const dateB = new Date(b.registrationDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setContacts(sortedContacts);
  };

  // method that sorts the contacts by the birth date
  const sortByBirthDate = () => {
    const sortedContacts = [...contacts].sort((a, b) => {
      const dateA = new Date(a.birthDate.split("-").reverse().join("-"));
      const dateB = new Date(b.birthDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setContacts(sortedContacts);
  };

  // default sorting
  const sortByContactId = () => {
    const sortedContacts = [...contacts].sort((a, b) => a.id - b.id);
    setContacts(sortedContacts);
  };

  // method that is updating the companies array with the new edit array after a company's edit
  const handleCompanyUpdate = (updatedCompany) => {
    // Update the company state with the edited data
    setCompany(updatedCompany);

    // Find the index of the updated company in the companies array
    const updatedIndex = companies.findIndex(
      (company) => company.id === updatedCompany.id
    );

    if (updatedIndex !== -1) {
      const updatedCompanies = [...companies];
      updatedCompanies[updatedIndex] = updatedCompany;

      // Update the company's state with the updated array
      setCompanies(updatedCompanies);
    }
  };
  // show the delete company confirmation modal
  const deleteCompany = (id) => {
    setCompanyToDelete(id);
    setShowDeleteModal(true);
  };

  // show the remove contact confirmation modal
  const removeContact = (contact) => {
    setContactToRemove(contact);
    setShowRemoveModal(true);
  };

  // company delete confirmation method
  const confirmDelete = () => {
    CompanyService.deleteCompany(companyToDelete)
      .then(() => {
        fetchCompanies();
        setShowDeleteModal(false);
        window.location.href = "/Companies";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // company delete confirmation method
  const confirmRemove = () => {
    CompanyService.removeContact(contactToRemove)
      .then(() => {
        // Update contacts after successful removal
        fetchContacts();
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // function to handle the pages
  const handlePageChangeContact = (newPage) => {
    setCurrentPageContact((prevPage) => {
      const totalPages = Math.ceil(contacts.length / rowsPerPageContact);
      const updatedPage = Math.min(Math.max(newPage, 1), totalPages);
      return updatedPage;
    });
  };

  // function to handle the rows per page
  const handleRowsPerPageChangeContact = (event) => {
    setRowsPerPageContact(parseInt(event.target.value));
    setCurrentPageContact(1);
  };

  const indexOfLastRowContact = currentPageContact * rowsPerPageContact;
  const indexOfFirstRowContact = indexOfLastRowContact - rowsPerPageContact;
  const currentRowsContact = contacts.slice(
    indexOfFirstRowContact,
    indexOfLastRowContact
  );

  return (
    <div className="container-fluid">
      <h3
        className="container-lg"
        style={{
          marginTop: "50px",
          boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
          color: "black",
          textAlign: "center",
          backgroundColor: "#313949",
          color: "white",
          borderRadius: "50px",
          height: "40px",
        }}
      >
        <BsBuildings style={{ marginRight: "10px", marginBottom: "3px" }} />
        Company Details
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
        {/* Avatar field*/}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            marginRight: "20px",
            textAlign: "left",
            marginTop: "10px",
            marginLeft: "60px",
          }}
        >
          <Avatar
            name={`${name}`}
            size="100"
            round={true}
            className="avatar"
            style={{
              marginRight: "5px",
              boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
            }}
          />
        </div>

        {/* Edit, Delete, Add Contacts, Add SSL Certificate Buttons */}
        <div style={{ position: "absolute", top: "125px", marginLeft: "13px" }}>
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
          {/* render the EditCompanyModal when we click the edit button*/}
          <EditCompanyModal
            isOpen={showEditModal}
            onRequestClose={handleCloseModal}
            company={company}
            onCompanyUpdate={handleCompanyUpdate}
          />
          <button
            type="button"
            className="btn btn-outline-danger"
            style={{ marginBottom: "10px" }}
            onClick={() => deleteCompany(id)}
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

        <div style={{ position: "absolute", top: "175px", marginLeft: "13px" }}>
          <div style={{ marginBottom: "10px" }}>
            <button
              type="button"
              className="btn btn-outline-success"
              style={{ width: "180px" }}
              onClick={handleAddContactsClick}
            >
              Add Contacts
              <IoIosAddCircleOutline
                style={{
                  marginLeft: "2px",
                  marginBottom: "5px",
                  fontSize: "18px",
                }}
              />
            </button>

            {/* render the AddContactsModal when we click the add contacts button*/}
            <AddContactsModal
              isOpen={showAddContactModal}
              onRequestClose={handleCloseAddContactModal}
              company={company}
            />
          </div>
          <div>
            <button
              type="button"
              className="ssl btn btn-outline-info"
              style={{ width: "180px" }}
              onClick={handleAddCertificateClick}
            >
              Add SSL Certificate
              <IoIosAddCircleOutline
                style={{
                  marginLeft: "2px",
                  marginBottom: "3px",
                  fontSize: "18px",
                }}
              />
            </button>
            {/* render the AddSSLCertificateModal when we click the add ssl certificate button*/}
            <AddSSLCertificateModal
              isOpen={showAddCertificateModal}
              onRequestClose={handleCloseCertificateModal}
              customer={company}
            />
          </div>
        </div>

        {/* Name, Website and Phone Number fields */}
        <Row
          className="mt-4"
          style={{
            marginBottom: "30px",
            marginLeft: "250px",
            marginTop: "20px",
          }}
        >
          <Col>
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
            >
              <strong>
                {" "}
                <FaUser
                  style={{ paddingBottom: "5px", fontSize: "18px" }}
                />{" "}
                Name:
              </strong>{" "}
              {name}
            </p>{" "}
          </Col>
          <Col>
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
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
          <Col>
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
            >
              <strong>
                {" "}
                <FaPhone
                  style={{ paddingBottom: "4px", fontSize: "18px" }}
                />{" "}
                Phone Number:
              </strong>{" "}
              {phoneNumber}
            </p>{" "}
          </Col>
        </Row>

        {/* Email and Industry field */}
        <Row
          className="mt-4"
          style={{
            marginTop: "20px",
            marginBottom: "30px",
            marginLeft: "300px",
          }}
        >
          <Col className="text-center">
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
              {email}
            </p>
          </Col>

          <Col>
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
            >
              <strong>
                {" "}
                <FaIndustry
                  style={{ paddingBottom: "4px", fontSize: "18px" }}
                />{" "}
                Industry:
              </strong>{" "}
              {industry}
            </p>{" "}
          </Col>
        </Row>

        {/* Employees Number, Annual revenue and Registration date fields */}
        <Row
          className="mt-4"
          style={{
            marginBottom: "30px",
            marginLeft: "250px",
            marginTop: "20px",
          }}
        >
          <Col>
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
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
          <Col>
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
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
          <Col>
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
            >
              <strong>
                {" "}
                <FaCalendarAlt
                  style={{ paddingBottom: "4px", fontSize: "18px" }}
                />{" "}
                Registration Date:
              </strong>{" "}
              {registrationDate}
            </p>{" "}
          </Col>
        </Row>
      </div>

      <div className="container-md">
        <Row className="mt-4">
          {/* Latest Contact and Description Cards Section */}
          <Col
            style={{ width: "100%", paddingRight: "12px", paddingLeft: "0" }}
          >
            <Row style={{ marginRight: "1px", marginLeft: "1px" }}>
              {/* Latest Contact Card */}
              <Card
                className="customer-card w-20"
                style={{
                  marginBottom: "30px",
                  height: "128px",
                  border: "2px solid #313949",
                  boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                }}
              >
                <CardBody>
                  {biggestContact ? (
                    <Link
                      to={`/Contacts/${biggestContact.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <h5 style={{ marginBottom: "15px", cursor: "pointer" }}>
                        Latest Contact
                      </h5>
                    </Link>
                  ) : (
                    <h5
                      style={{
                        marginBottom: "15px",
                        textAlign: "center",
                        marginTop: "15px",
                        color: "#2a8ffa",
                      }}
                    >
                      <CgDanger style={{ marginBottom: "3px" }} /> No contacts
                      associated with the company yet
                    </h5>
                  )}
                  <Row>
                    <Col xs={4}>
                      {biggestContact && (
                        <div>
                          <p>
                            <strong>
                              {" "}
                              <FaUser
                                style={{
                                  marginBottom: "3px",
                                  color: "#2a8ffa",
                                }}
                              />{" "}
                              First Name:
                            </strong>{" "}
                            {biggestContact.fname}
                          </p>
                        </div>
                      )}
                    </Col>
                    <Col xs={4}>
                      {biggestContact && (
                        <div>
                          <p>
                            <strong>
                              {" "}
                              <FaUser
                                style={{
                                  marginBottom: "3px",
                                  color: "#2a8ffa",
                                }}
                              />{" "}
                              Last Name:
                            </strong>{" "}
                            {biggestContact.lname}
                          </p>
                        </div>
                      )}
                    </Col>
                    <Col xs={4}>
                      {biggestContact && (
                        <div>
                          <p>
                            <strong>
                              {" "}
                              <FaCalendarAlt
                                size={15}
                                style={{
                                  color: "gold",
                                  marginBottom: "4px",
                                }}
                              />{" "}
                              Phone Number:
                            </strong>{" "}
                            {biggestContact.phoneNumber}
                          </p>
                        </div>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Description field */}
              <Card
                className="customer-card w-20"
                style={{
                  height: "250px",
                  border: "2px solid #313949",
                  boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                  width: "648px",
                }}
              >
                <CardBody>
                  <h4>Description</h4>
                  {description}
                </CardBody>
              </Card>
            </Row>
          </Col>

          {/* Contacts Table */}
          <Col
            style={{ width: "100%", paddingLeft: "12px", paddingRight: "0" }}
          >
            <table
              className="components table table-striped table-hover"
              style={{ height: "410px" }}
            >
              <thead>
                <tr>
                  <th
                    style={{ width: "5%" }}
                    scope="row"
                    colSpan="5"
                    className="tasks-in-progress"
                  >
                    Contacts
                  </th>
                </tr>
                <tr>
                  <th style={{ width: "10%" }} scope="col">
                    ID
                  </th>
                  <th style={{ width: "23%" }} scope="col">
                    First Name
                  </th>
                  <th style={{ width: "23%" }} scope="col">
                    Last Name
                  </th>
                  <th style={{ width: "30%" }} scope="col">
                    Email
                  </th>
                  <th style={{ width: "14%" }} scope="col">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.length > 0 ? (
                  currentRowsContact.map((contact, index) => (
                    <tr key={index}>
                      <td style={{ width: "10%", fontWeight: "bold" }}>
                        <Link to={`/Contacts/${contact.id}`}>{contact.id}</Link>
                      </td>

                      <td style={{ width: "23%" }}>{contact.fname}</td>
                      <td style={{ width: "23%" }}>{contact.lname}</td>
                      <td style={{ width: "30%" }}>{contact.email}</td>
                      <td style={{ width: "14%" }}>
                        <Link
                          type="button"
                          onClick={() => removeContact(contact)}
                        >
                          <IoIosRemoveCircleOutline
                            style={{
                              marginLeft: "2px",
                              marginBottom: "3px",
                              fontSize: "25px",
                              color: "#dc3545",
                            }}
                          />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      <div style={{ marginTop: "50px" }}>
                        <FaDatabase
                          style={{ fontSize: "50px", color: "white" }}
                        />
                        <p style={{ color: "white", marginTop: "10px" }}>
                          No Contacts yet
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="table-task-management">
                  <td colSpan="4" style={{ paddingRight: "30px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "25px",
                        }}
                      >
                        <button
                          className="carousel-button"
                          disabled={currentPageContact === 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeContact(currentPageContact - 1);
                          }}
                        >
                          <GrFormPrevious
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <button
                          className="carousel-button"
                          disabled={indexOfLastRowContact >= contacts.length}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeContact(currentPageContact + 1);
                          }}
                        >
                          <GrFormNext
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <span style={{ color: "white" }}>
                          Page {currentPageContact}
                        </span>
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ marginLeft: "10px", color: "white" }}>
                          Rows per page:
                        </span>
                        <select
                          className="form-select custom-select"
                          style={{
                            width: "70px",
                            marginLeft: "10px",
                            marginRight: "10px",
                          }}
                          aria-label="Default select example"
                          value={rowsPerPageContact}
                          onChange={handleRowsPerPageChangeContact}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={15}>15</option>
                        </select>
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          display: "flex",
                          alignItems: "center",
                          paddingRight: 40,
                        }}
                      >
                        <select
                          className="form-select custom-select"
                          onChange={(e) => {
                            const selectedOption = e.target.value;
                            if (selectedOption === "default") {
                              sortByContactId();
                            } else if (selectedOption === "fname") {
                              sortByFirstName();
                            } else if (selectedOption === "lname") {
                              sortByLastName();
                            } else if (selectedOption === "birth date") {
                              sortByBirthDate();
                            } else if (selectedOption === "registration date") {
                              sortByRegistrationDate();
                            }
                          }}
                        >
                          <option value="default">Select Sort By</option>
                          <option value="fname">Sort by First Name</option>
                          <option value="lname">Sort by Last Name</option>
                          <option value="birth date">Sort by Birth Date</option>
                          <option value="registration date">
                            Sort by Registration Date
                          </option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </Col>
        </Row>
      </div>

      {/* Render the company's tables and cards */}
      <CompanyDetailsTables />

      {/* Modal that shows up for delete confirmation */}
      {companyToDelete && (
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
          <h2>Delete Company Confirmation</h2>
          <p>Are you sure you want to delete this company ?</p>
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

      {/* Modal that shows up for remove confirmation */}
      {contactToRemove && (
        <Modal
          className="remove-modal-style"
          isOpen={showRemoveModal}
          onRequestClose={closeRemoveModal}
          contentLabel="Remove Confirmation"
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
          <h2>Remove Contact Confirmation</h2>
          <p>Are you sure you want to remove this contact ?</p>
          <div>
            <button className="btn btn-outline-success" onClick={confirmRemove}>
              <FaCheck style={{ marginRight: "5px" }} /> Yes
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={closeRemoveModal}
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

export default DetailsCompany;
