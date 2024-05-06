import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import CustomerService from "../../services/customer-service";
import Avatar from "react-avatar";
import Modal from "react-modal";
import {MdCancel, MdEmail, MdModeEdit} from "react-icons/md";
import {ImBin} from "react-icons/im";
import EditCustomerModal from "./edit-customer-modal";
import CustomerDetailsTables from "./customer-details-tables";
import {FaCalendarAlt, FaCheck, FaPhone, FaRegUser, FaUser} from "react-icons/fa";
import AppointmentsHistory from "./appointment-history-table";
import {IoIosAddCircleOutline} from "react-icons/io";
import AddSSLCertificateModal from "../ssl-certificate-components/add-ssl-certificate-modal";

const DetailsCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const { id } = useParams();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddCertificateModal, setShowAddCertificateModal] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    fetchCustomers();
    fetchCustomer();
  }, [id]);

  // fetch all the customers
  const fetchCustomers = async () => {
    try {
      const response = await CustomerService.getAllCustomers();
      const filteredCustomers = response.data.filter(
        (customer) => customer.fname !== null
      );
      setCustomers(filteredCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // fetch the customer to display
  const fetchCustomer = async () => {
    try {
      const response = await CustomerService.getCustomer(id);
      const customerData = response.data;

      setCustomer(customerData);
      setFname(customerData.fname);
      setLname(customerData.lname);
      setEmail(customerData.email);
      setPhoneNumber(customerData.phoneNumber);
      setBirthDate(customerData.birthDate);
      setRegistrationDate(customerData.registrationDate);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  // function to open the edit modal
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // function to close the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    fetchCustomer();
  };

  // function to open the certificate modal
  const handleAddCertificateClick = () => {
    setShowAddCertificateModal(true);
  };

  // function to close the certificate modal
  const handleCloseCertificateModal = () => {
    setShowAddCertificateModal(false);
    fetchCustomer();
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // method that is updating the customers array with the new edit array after a customer's edit
  const handleCustomerUpdate = (updatedCustomer) => {
    // Update the customer state with the edited data
    setCustomer(updatedCustomer);

    // Find the index of the updated customer in the customers array
    const updatedIndex = customers.findIndex(
      (customer) => customer.id === updatedCustomer.id
    );

    if (updatedIndex !== -1) {
      const updatedCustomers = [...customers];
      updatedCustomers[updatedIndex] = updatedCustomer;

      // Update the customers state with the updated array
      setCustomers(updatedCustomers);
    }
  };
  // show the delete customer confirmation modal
  const deleteCustomer = (id) => {
    setCustomerToDelete(id);
    setShowDeleteModal(true);
  };

  // customer delete confirmation method
  const confirmDelete = () => {
    CustomerService.deleteCustomer(customerToDelete)
      .then(() => {
        fetchCustomers();
        setShowDeleteModal(false);
        window.location.href = "/Customers";
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
          {/* render the EditCustomerModal when we click the edit button*/}
          <EditCustomerModal
            isOpen={showEditModal}
            onRequestClose={handleCloseModal}
            customer={customer}
            onCustomerUpdate={handleCustomerUpdate}
          />
          <button
            type="button"
            className="btn btn-outline-danger"
            style={{ marginBottom: "10px" }}
            onClick={() => deleteCustomer(id)}
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

        <div style={{ position: "absolute", top: "205px", marginLeft: "13px" }}>
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
            {/* render the EditCustomerModal when we click the edit button*/}
            <AddSSLCertificateModal
              isOpen={showAddCertificateModal}
              onRequestClose={handleCloseCertificateModal}
              customer={customer}
            />
          </div>
        </div>

        {/* First Name and Last Name fields */}
        <Row
          className="mt-4"
          style={{
            marginBottom: "30px",
            marginLeft: "350px",
            marginTop: "10px",
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
      </div>

      {/* Render the customer's tables and cards */}
      <CustomerDetailsTables />

      {/* Render the customer's appointment history */}
      <AppointmentsHistory />

      {/* Modal that shows up for delete confirmation */}
      {customerToDelete && (
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
          <h2>Delete Customer Confirmation</h2>
          <p>Are you sure you want to delete this customer ?</p>
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

export default DetailsCustomer;
