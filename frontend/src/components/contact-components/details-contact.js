import React, {useEffect, useState} from "react";
import Avatar from "react-avatar";
import {Card, CardBody, Col, Row} from "react-bootstrap";
import {FaCalendarAlt, FaCheck, FaPhone, FaRegUser, FaUser,} from "react-icons/fa";
import {ImBin} from "react-icons/im";
import {MdCancel, MdEmail, MdLowPriority, MdModeEdit} from "react-icons/md";
import {TbFileDescription} from "react-icons/tb";
import Modal from "react-modal";
import {useParams} from "react-router-dom";
import ContactService from "../../services/contact-service";
import EditContactModal from "../contact-components/edit-contact-modal";
import ContactsAppointmentsHistory from "./contact-appointment-history";

const DetailsContact = () => {
  const [contacts, setContacts] = useState([]);
  const { id } = useParams();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [priority, setPriority] = useState("");
  const [notes, setNotes] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [contact, setContact] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);

  useEffect(() => {
    fetchContacts();
    fetchContact();
  }, [id]);

  // fetch all the contacts
  const fetchContacts = async () => {
    try {
      const response = await ContactService.getMyContacts();
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // fetch the contact to display
  const fetchContact = async () => {
    try {
      const response = await ContactService.getContactById(id);
      const contactData = response.data;

      setContact(contactData);
      setFname(contactData.fname);
      setLname(contactData.lname);
      setEmail(contactData.email);
      setPhoneNumber(contactData.phoneNumber);
      setBirthDate(contactData.birthDate);
      setPriority(contactData.priority);
      setNotes(contactData.notes);
      setRegistrationDate(contactData.registrationDate);

      console.log(contactData);
    } catch (error) {
      console.error("Error fetching contact:", error);
    }
  };

  // function to open the edit modal
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // function to close the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    fetchContact();
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // method that is updating the contacts array with the new edit array after a contact's edit
  const handleContactUpdate = (updatedContact) => {
    // Update the contact state with the edited data
    setContact(updatedContact);

    // Find the index of the updated contact in the contacts array
    const updatedIndex = contacts.findIndex(
      (contact) => contact.id === updatedContact.id
    );

    if (updatedIndex !== -1) {
      const updatedContacts = [...contacts];
      updatedContacts[updatedIndex] = updatedContact;

      // Update the contacts state with the updated array
      setContacts(updatedContacts);
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
        window.history.back();
      })
      .catch((error) => {
        console.log(error);
      });
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
          backgroundColor: "#313949",
          color: "white",
          borderRadius: "50px",
          height: "40px",
        }}
      >
        <FaRegUser style={{ marginRight: "10px", marginBottom: "3px" }} />
        Contact Details
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
            marginTop: "20px",
            marginLeft: "60px",
          }}
        >
          <Avatar
            name={`${fname} ${lname}`}
            size="100"
            round={true}
            className="avatar"
            style={{
              marginRight: "5px",
              boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
            }}
          />
        </div>

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
          {/* render the EditContactModal when we click the edit button*/}
          <EditContactModal
            isOpen={showEditModal}
            onRequestClose={handleCloseModal}
            contact={contact}
            onContactUpdate={handleContactUpdate}
          />
          <button
            type="button"
            className="btn btn-outline-danger"
            style={{ marginBottom: "10px" }}
            onClick={() => deleteContact(id)}
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

        {/* First Name, Priority and Last Name fields */}
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
                First Name:
              </strong>{" "}
              {fname}
            </p>{" "}
          </Col>
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
                Last Name:
              </strong>{" "}
              {lname}
            </p>{" "}
          </Col>
          <Col>
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
            >
              <strong>
                {" "}
                <MdLowPriority
                  style={{ paddingBottom: "5px", fontSize: "18px" }}
                />{" "}
                Priority:
              </strong>{" "}
              {priority}
            </p>{" "}
          </Col>
        </Row>

        {/* Email field */}
        <Row
          className="mt-4"
          style={{
            marginTop: "20px",
            marginBottom: "50px",
            marginLeft: "200px",
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
        </Row>

        {/* Birth date, phone number and registration date fields */}
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
                <FaCalendarAlt
                  style={{ paddingBottom: "5px", fontSize: "20px" }}
                />{" "}
                Birth Date:
              </strong>{" "}
              {birthDate}
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
                  style={{ paddingBottom: "5px", fontSize: "20px" }}
                />{" "}
                Phone Number:
              </strong>{" "}
              {phoneNumber}
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
                  style={{ paddingBottom: "5px", fontSize: "20px" }}
                />{" "}
                Registration Date:
              </strong>{" "}
              {registrationDate}
            </p>{" "}
          </Col>
        </Row>

        {/* Notes field */}
        <Row
          className="mt-4"
          style={{
            marginTop: "20px",
            marginBottom: "50px",
            marginLeft: "200px",
          }}
        >
          <Col className="text-center">
            <Card style={{ backgroundColor: "transparent", border: "none" }}>
              <CardBody
                className="customer-detail-fields"
                style={{
                  width: "1005px",
                  margin: "0 auto",
                  padding: "10px",
                  height: "150px",
                  marginBottom: "30px",
                  backgroundColor: "transparent",
                  marginLeft: "50px",
                }}
              >
                <strong>
                  {" "}
                  <TbFileDescription
                    style={{ paddingBottom: "1px", fontSize: "18px" }}
                  />{" "}
                  Notes:
                </strong>{" "}
                {notes}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Render the contact's appointment history */}
      <ContactsAppointmentsHistory />

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

export default DetailsContact;
