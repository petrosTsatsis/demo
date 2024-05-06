import React, {useEffect, useState} from "react";
import Avatar from "react-avatar";
import {FaCheck, FaDatabase, FaPhone} from "react-icons/fa";
import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import {ImBin} from "react-icons/im";
import {IoIosAddCircleOutline, IoMdContact} from "react-icons/io";
import {MdCancel, MdModeEdit} from "react-icons/md";
import {TbListDetails} from "react-icons/tb";
import Modal from "react-modal";
import {Link} from "react-router-dom";
import ContactService from "../services/contact-service";
import EditContactModal from "./contact-components/edit-contact-modal";

const ListTotalContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [currentPageContact, setCurrentPageContact] = React.useState(1);
  const [rowsPerPageContact, setRowsPerPageContact] = React.useState(5);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [clickedContact, setClickedContact] = useState(null);
  const [latestContact, setLatestContact] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // call the method that fetches the contacts
    fetchContacts();
  }, []);

  useEffect(() => {
    // find the contact with the biggest id and set him/her as the last added contact
    if (contacts.length > 0) {
      const maxIdContact = contacts.reduce((prev, current) =>
        prev.id > current.id ? prev : current
      );
      setLatestContact(maxIdContact);
    }
  }, [contacts]);

  // fetch all the contacts
  const fetchContacts = async () => {
    try {
      const response = await ContactService.getAllContacts();
      setContacts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // function to open the edit modal
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // function to close the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  // handle the collapse component
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // when a checkbox is checked open the popover with the options for the specific contact and close it when we remove the check
  const handleCheckboxChange = (contactId) => {
    if (selectedContactId === contactId) {
      console.log("Unselecting contact:", contactId);
      setSelectedContactId(null);
      setPopoverOpen(false);
    } else {
      setSelectedContactId(contactId);
      setPopoverOpen(true);
      const clickedContact = contacts.find(
        (contact) => contact.id === contactId
      );
      setClickedContact(clickedContact);
    }
  };

  // close the popover and remove the check from the checkbox
  const handlePopoverClose = () => {
    setPopoverOpen(false);
    setClickedContact(null);
    setSelectedContactId(null);
  };

  // method that is updating the contacts array with the new edit array after a contact's edit
  const handleContactUpdate = (updatedContact) => {
    // find the contact
    const updatedIndex = contacts.findIndex(
      (contacts) => contacts.id === updatedContact.id
    );

    if (updatedIndex !== -1) {
      const updatedContacts = [...contacts];
      updatedContacts[updatedIndex] = updatedContact;

      setContacts(updatedContacts);
    }
  };

  // view the contact's details
  const handleViewContactDetails = () => {
    if (latestContact) {
      window.location.href = `/Contacts/${latestContact.id}`;
    }
  };

  // view the selected contact's details
  const handleViewSelectedContactDetails = () => {
    if (selectedContactId) {
      window.location.href = `/Contacts/${selectedContactId}`;
    }
  };

  // show the delete contact confirmation modal
  const deleteContact = (id) => {
    setContactToDelete(id);
    setShowDeleteModal(true);
  };

  // contact delete confirmation method
  const confirmDelete = () => {
    ContactService.deleteContact(contactToDelete)
      .then(() => {
        fetchContacts();
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
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
    // container that contains : add contact button, popover for contact, contacts table, latest contact added
    <div className="container-fluid">
      <div className="row" style={{ marginTop: "60px" }}>
        <div
          className="col-md-2 d-flex justify-content-center"
          style={{ marginTop: "83px" }}
        >
          {/* add contact button  */}
          <div>
            <Link to="/Contacts/add-contact" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "220px",
                  backgroundColor: "rgb(76, 101, 151) ",
                  padding: "10px",
                  borderRadius: "15px",
                  boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.5)",
                  color: "white",
                  border: "none",
                  marginBottom: "33px",
                  cursor: "pointer",
                }}
              >
                Add Contact{" "}
                <IoIosAddCircleOutline
                  style={{ fontSize: "20px", marginBottom: "2px" }}
                />{" "}
              </button>
            </Link>

            {/* popover for each contact  */}
            {popoverOpen && clickedContact && (
              <div
                className="popover"
                style={{
                  width: "220px",
                  backgroundColor: "#313949",
                  padding: "10px",
                  borderRadius: "15px",
                  boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.5)",
                  color: "white",
                  height: "300px",
                }}
              >
                {/* popover's content  */}
                <button
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "#aaa",
                  }}
                  onClick={handlePopoverClose}
                >
                  X
                </button>

                <div
                  className="popover-content"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <h6 style={{ marginBottom: "50px" }}>
                    <Avatar
                      name={`${clickedContact.fname} ${clickedContact.lname}`}
                      size="25"
                      round={true}
                      className="avatar"
                      style={{ marginRight: "5px" }}
                    />{" "}
                    {clickedContact.fname} {clickedContact.lname}
                  </h6>

                  {/* view details popover button */}
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    style={{ marginBottom: "10px" }}
                    onClick={handleViewSelectedContactDetails}
                  >
                    View Details
                    <TbListDetails
                      style={{
                        marginLeft: "4px",
                        marginBottom: "3px",
                        fontSize: "18px",
                      }}
                    />
                  </button>

                  {/* edit contact popover button  */}
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    style={{ marginBottom: "10px" }}
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

                  {/* render the EditContactModal when we click the edit button*/}
                  <EditContactModal
                    isOpen={showEditModal}
                    onRequestClose={handleCloseModal}
                    contact={clickedContact}
                    onContactUpdate={handleContactUpdate}
                  />

                  {/* delete contact popover button  */}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    style={{ marginBottom: "10px" }}
                    onClick={() => deleteContact(selectedContactId)}
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
              </div>
            )}
          </div>
        </div>

        {/* contacts table field */}
        <div className="col-md-8">
          <div className="components-table">
            <h3
              style={{
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
              <IoMdContact
                style={{
                  marginRight: "10px",
                  marginBottom: "3px",
                  fontSize: "30",
                }}
              />
              All Contacts
            </h3>
            <table
              className="components table table-striped table-hover"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={{ width: "10%" }} scope="col">
                    Select
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    First Name
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Last Name
                  </th>
                  <th style={{ width: "30%" }} scope="col">
                    Email
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.length > 0 ? (
                  currentRowsContact.map((contact, index) => (
                    <tr key={index}>
                      <td style={{ width: "10%" }}>
                        <div
                          className="form-check"
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedContactId === contact.id}
                            onChange={() => handleCheckboxChange(contact.id)}
                          />
                        </div>
                      </td>
                      <td style={{ width: "20%" }}>
                        <Avatar
                          name={`${contact.fname} ${contact.lname}`}
                          size="25"
                          round={true}
                          className="avatar"
                          style={{ marginRight: "5px" }}
                        />
                        {contact.fname}
                      </td>
                      <td style={{ width: "20%" }}>{contact.lname}</td>
                      <td
                        style={{
                          width: "30%",
                          fontWeight: "bold",
                        }}
                      >
                        {contact.email}
                      </td>
                      <td style={{ width: "20%" }}>
                        <FaPhone
                          style={{ marginRight: "3px", fontSize: "15px" }}
                        />{" "}
                        {contact.phoneNumber}
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
                  <td colSpan="4">
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
                          paddingLeft: "40px",
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
                        <span style={{ marginLeft: "10px", color: "white" }}>
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
                            if (selectedOption === "id") {
                              sortByContactId();
                            } else if (selectedOption === "fname") {
                              sortByFirstName();
                            } else if (selectedOption === "lname") {
                              sortByLastName();
                            } else if (selectedOption === "registration date") {
                              sortByRegistrationDate();
                            } else if (selectedOption === "birth date") {
                              sortByBirthDate();
                            }
                          }}
                        >
                          <option value="id">Select Sort By</option>
                          <option value="fname">Sort by First Name</option>
                          <option value="lname">Sort by Last Name</option>
                          <option value="registration date">
                            Sort by Registration Date
                          </option>
                          <option value="birth date">Sort by Birth Date</option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        {/* collapse field with the latest contact */}
        <div
          className="col-md-2 d-flex justify-content-center"
          style={{ marginTop: "83px" }}
        >
          <div
            className="accordion"
            id="accordionExample"
            style={{ width: "220px" }}
          >
            <div className="accordion-item">
              {/* collapse content  */}
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseContact"
                  aria-expanded={isCollapsed ? "true" : "false"}
                  aria-controls="collapseContact"
                  onClick={toggleCollapse}
                  style={{ width: "220px" }}
                  color="white"
                >
                  Latest Addition
                </button>
              </h2>
              <div
                id="collapseContact"
                className={`accordion-collapse collapse ${
                  isCollapsed ? "show" : ""
                }`}
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div
                  className="accordion-body"
                  style={{ width: "220px", minHeight: "323px" }}
                >
                  {/* if we have at least one contact show some fields */}
                  {contacts.length > 0 ? (
                    latestContact && (
                      <div>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>
                            First Name:
                          </span>{" "}
                          {latestContact.fname}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Last Name:</span>{" "}
                          {latestContact.lname}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
                          {latestContact.email}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>
                            Registration Date:
                          </span>{" "}
                          <br /> {latestContact.registrationDate}
                        </p>

                        {/* button to view the contact's details */}
                        <button
                          type="button"
                          className="btn btn-outline-warning"
                          onClick={handleViewContactDetails}
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
                    )
                  ) : (
                    <div style={{ marginTop: "50px", textAlign: "center" }}>
                      <FaDatabase
                        style={{ fontSize: "50px", color: "white" }}
                      />
                      <p style={{ color: "white", marginTop: "10px" }}>
                        No Contacts yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal that shows up for delete confirmation */}
      {contactToDelete && (
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
          <h2>Delete Contact Confirmation</h2>
          <p>Are you sure you want to delete this contact ?</p>
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

export default ListTotalContacts;
