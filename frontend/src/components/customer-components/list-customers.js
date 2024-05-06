import React, {useEffect, useState} from "react";
import Avatar from "react-avatar";
import {BiSolidPurchaseTag} from "react-icons/bi";
import {FaCheck, FaDatabase, FaPhone, FaRegUser} from "react-icons/fa";
import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import {ImBin} from "react-icons/im";
import {IoIosAddCircleOutline} from "react-icons/io";
import {MdCancel, MdModeEdit} from "react-icons/md";
import {TbListDetails} from "react-icons/tb";
import Modal from "react-modal";
import {Link} from "react-router-dom";
import CustomerService from "../../services/customer-service";
import AddSSLCertificateModal from "../ssl-certificate-components/add-ssl-certificate-modal";
import EditCustomerModal from "./edit-customer-modal";

const ListCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPageCustomer, setCurrentPageCustomer] = React.useState(1);
  const [rowsPerPageCustomer, setRowsPerPageCustomer] = React.useState(5);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [clickedCustomer, setClickedCustomer] = useState(null);
  const [latestCustomer, setLatestCustomer] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddCertificateModal, setShowAddCertificateModal] = useState(false);

  useEffect(() => {
    // call the method that fetches the customers
    fetchCustomers();
  }, []);

  useEffect(() => {
    // find the customer with the biggest id and set him/her as the last added customer
    if (customers.length > 0) {
      const maxIdCustomer = customers.reduce((prev, current) =>
        prev.id > current.id ? prev : current
      );
      setLatestCustomer(maxIdCustomer);
    }
  }, [customers]);

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

  // function to open the edit modal
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // function to close the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  // function to open the certificate modal
  const handleAddCertificateClick = () => {
    setShowAddCertificateModal(true);
  };

  // function to close the certificate modal
  const handleCloseCertificateModal = () => {
    setShowAddCertificateModal(false);
  };

  // handle the collapse component
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // when a checkbox is checked open the popover with the options for the specific customer and close it when we remove the check
  const handleCheckboxChange = (customerId) => {
    if (selectedCustomerId === customerId) {
      console.log("Unselecting customer:", customerId);
      setSelectedCustomerId(null);
      setPopoverOpen(false);
    } else {
      setSelectedCustomerId(customerId);
      setPopoverOpen(true);
      const clickedCustomer = customers.find(
        (customer) => customer.id === customerId
      );
      setClickedCustomer(clickedCustomer);
    }
  };

  // method that fetches the last purchase of the last added customer by finding the purchase with the biggest id
  const getLatestPurchase = async (customerId) => {
    try {
      const response = await CustomerService.getPurchases(customerId);
      const purchases = response.data;
      if (purchases.length > 0) {
        const latestPurchase = purchases.reduce((prev, current) =>
          prev.id > current.id ? prev : current
        );
        return latestPurchase.id;
      }
      return null;
    } catch (error) {
      console.error("Error fetching purchases:", error);
      return null;
    }
  };

  let existingAlert = document.querySelector(".alert");

  // handle the cases of latesting purchase exist or not
  const handleViewLatestPurchase = async () => {
    if (latestCustomer) {
      // display the latest purchase
      const latestPurchaseId = await getLatestPurchase(latestCustomer.id);
      if (latestPurchaseId) {
        window.location.href = `/Purchases/${latestPurchaseId}`;
      } else {
        // if there are 0 purchases from the customer display an alert to inform the user
        if (!existingAlert) {
          // define the appearance of the alert
          const alertDiv = document.createElement("div");
          alertDiv.className = "alert alert-warning";
          alertDiv.setAttribute("role", "alert");
          alertDiv.style.width = "300px";
          alertDiv.style.height = "100px";
          alertDiv.style.position = "fixed";
          alertDiv.style.top = "10px";
          alertDiv.style.left = "50%";
          alertDiv.style.transform = "translateX(-50%)";
          alertDiv.style.zIndex = "9999";
          alertDiv.style.display = "flex";
          alertDiv.style.flexDirection = "column";
          alertDiv.textContent = `${latestCustomer.fname} has not made any purchases yet.`;

          // Close button of the alert
          const closeButton = document.createElement("button");
          closeButton.textContent = "Okay";
          closeButton.className = "btn btn-outline-warning btn-sm";
          closeButton.style.width = "80px";
          closeButton.style.borderRadius = "50px";
          closeButton.style.marginTop = "auto";
          closeButton.style.marginLeft = "90px";
          closeButton.onclick = () => {
            alertDiv.remove();
            existingAlert = null;
          };

          alertDiv.appendChild(closeButton);
          document.body.appendChild(alertDiv);
          existingAlert = alertDiv;
        }
      }
    }
  };

  // close the popover and remove the check from the checkbox
  const handlePopoverClose = () => {
    setPopoverOpen(false);
    setClickedCustomer(null);
    setSelectedCustomerId(null);
  };

  // method that is updating the customers array with the new edit array after a customer's edit
  const handleCustomerUpdate = (updatedCustomer) => {
    // find the customer
    const updatedIndex = customers.findIndex(
      (customer) => customer.id === updatedCustomer.id
    );

    if (updatedIndex !== -1) {
      const updatedCustomers = [...customers];
      updatedCustomers[updatedIndex] = updatedCustomer;

      setCustomers(updatedCustomers);
    }
  };

  // view the customer's details
  const handleViewCustomerDetails = () => {
    if (latestCustomer) {
      window.location.href = `/Customers/${latestCustomer.id}`;
    }
  };

  // view the selected customer's details
  const handleViewSelectedCustomerDetails = () => {
    if (selectedCustomerId) {
      window.location.href = `/Customers/${selectedCustomerId}`;
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // method that sorts the customers by their first name
  const sortByFirstName = () => {
    const sortedCustomers = [...customers].sort((a, b) =>
      a.fname.localeCompare(b.fname)
    );
    setCustomers(sortedCustomers);
  };

  // method that sorts the customers by their first name
  const sortByLastName = () => {
    const sortedCustomers = [...customers].sort((a, b) =>
      a.lname.localeCompare(b.lname)
    );
    setCustomers(sortedCustomers);
  };

  // method that sorts the customers by the registration date
  const sortByRegistrationDate = () => {
    const sortedCustomers = [...customers].sort((a, b) => {
      const dateA = new Date(a.registrationDate.split("-").reverse().join("-"));
      const dateB = new Date(b.registrationDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setCustomers(sortedCustomers);
  };

  // method that sorts the customers by the birth date
  const sortByBirthDate = () => {
    const sortedCustomers = [...customers].sort((a, b) => {
      const dateA = new Date(a.birthDate.split("-").reverse().join("-"));
      const dateB = new Date(b.birthDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setCustomers(sortedCustomers);
  };

  // default sorting
  const sortByCustomerId = () => {
    const sortedCustomers = [...customers].sort((a, b) => a.id - b.id);
    setCustomers(sortedCustomers);
  };

  // function to handle the pages
  const handlePageChangeCustomer = (newPage) => {
    setCurrentPageCustomer((prevPage) => {
      const totalPages = Math.ceil(customers.length / rowsPerPageCustomer);
      const updatedPage = Math.min(Math.max(newPage, 1), totalPages);
      return updatedPage;
    });
  };

  // function to handle the rows per page
  const handleRowsPerPageChangeCustomer = (event) => {
    setRowsPerPageCustomer(parseInt(event.target.value));
    setCurrentPageCustomer(1);
  };

  const indexOfLastRowCustomer = currentPageCustomer * rowsPerPageCustomer;
  const indexOfFirstRowCustomer = indexOfLastRowCustomer - rowsPerPageCustomer;
  const currentRowsCustomer = customers.slice(
    indexOfFirstRowCustomer,
    indexOfLastRowCustomer
  );
  return (
    // container that contains : add customer button, popover for customer, customers table, latest customer added
    <div className="container-fluid">
      <div className="row" style={{ marginTop: "60px" }}>
        <div
          className="col-md-2 d-flex justify-content-center"
          style={{ marginTop: "83px" }}
        >
          {/* add customer button  */}
          <div>
            <Link
              to="/Customers/add-customer"
              style={{ textDecoration: "none" }}
            >
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
                Add Customer{" "}
                <IoIosAddCircleOutline
                  style={{ fontSize: "20px", marginBottom: "2px" }}
                />{" "}
              </button>
            </Link>

            {/* popover for each customer  */}
            {popoverOpen && clickedCustomer && (
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
                  <h6 style={{ marginBottom: "20px" }}>
                    <Avatar
                      name={`${clickedCustomer.fname} ${clickedCustomer.lname}`}
                      size="25"
                      round={true}
                      className="avatar"
                      style={{ marginRight: "5px" }}
                    />{" "}
                    {clickedCustomer.fname} {clickedCustomer.lname}
                  </h6>

                  {/* view details popover button */}
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    style={{ marginBottom: "15px" }}
                    onClick={handleViewSelectedCustomerDetails}
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

                  {/* edit customer popover button  */}
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    style={{ marginBottom: "15px" }}
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
                    customer={clickedCustomer}
                    onCustomerUpdate={handleCustomerUpdate}
                  />

                  {/* delete customer popover button  */}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    style={{ marginBottom: "15px" }}
                    onClick={() => deleteCustomer(selectedCustomerId)}
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

                  <button
                    type="button"
                    className="ssl btn btn-outline-info"
                    style={{ marginBottom: "15px" }}
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
                    customer={clickedCustomer}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* customers table field */}
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
              <FaRegUser style={{ marginRight: "10px", marginBottom: "3px" }} />
              Customers
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
                {customers.length > 0 ? (
                  currentRowsCustomer.map((customer, index) => (
                    <tr key={index}>
                      <td style={{ width: "10%" }}>
                        <div
                          className="form-check"
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedCustomerId === customer.id}
                            onChange={() => handleCheckboxChange(customer.id)}
                          />
                        </div>
                      </td>
                      <td style={{ width: "20%" }}>
                        <Avatar
                          name={`${customer.fname} ${customer.lname}`}
                          size="25"
                          round={true}
                          className="avatar"
                          style={{ marginRight: "5px" }}
                        />
                        {customer.fname}
                      </td>
                      <td style={{ width: "20%" }}>{customer.lname}</td>
                      <td
                        style={{
                          width: "30%",
                          fontWeight: "bold",
                        }}
                      >
                        {customer.email}
                      </td>
                      <td style={{ width: "20%" }}>
                        <FaPhone
                          style={{ marginRight: "3px", fontSize: "15px" }}
                        />{" "}
                        {customer.phoneNumber}
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
                          No Customers yet
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
                          disabled={currentPageCustomer === 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeCustomer(currentPageCustomer - 1);
                          }}
                        >
                          <GrFormPrevious
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <button
                          className="carousel-button"
                          disabled={indexOfLastRowCustomer >= customers.length}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeCustomer(currentPageCustomer + 1);
                          }}
                        >
                          <GrFormNext
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <span style={{ marginLeft: "10px", color: "white" }}>
                          Page {currentPageCustomer}
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
                          value={rowsPerPageCustomer}
                          onChange={handleRowsPerPageChangeCustomer}
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
                              sortByCustomerId();
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
        {/* collapse field with the latest customer */}
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
                  data-bs-target="#collapseCustomer"
                  aria-expanded={isCollapsed ? "true" : "false"}
                  aria-controls="collapseCustomer"
                  onClick={toggleCollapse}
                  style={{ width: "220px" }}
                  color="white"
                >
                  Latest Addition
                </button>
              </h2>
              <div
                id="collapseCustomer"
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
                  {/* if we have at least one customer show some fields */}
                  {customers.length > 0 ? (
                    latestCustomer && (
                      <div>
                        <p style={{ marginBottom: "10px" }}>
                          <span style={{ fontWeight: "bold" }}>
                            First Name:
                          </span>{" "}
                          {latestCustomer.fname}
                        </p>
                        <p style={{ marginBottom: "10px" }}>
                          <span style={{ fontWeight: "bold" }}>Last Name:</span>{" "}
                          {latestCustomer.lname}
                        </p>
                        <p style={{ marginBottom: "10px" }}>
                          <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
                          <br /> {latestCustomer.email}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>
                            Registration Date:
                          </span>{" "}
                          <br /> {latestCustomer.registrationDate}
                        </p>
                        {/* button to view the latest purchase */}
                        <button
                          type="button"
                          className="btn btn-outline-warning"
                          style={{ marginBottom: "10px" }}
                          onClick={handleViewLatestPurchase}
                        >
                          Latest Purchase{" "}
                          <BiSolidPurchaseTag
                            style={{
                              fontSize: "18px",
                              matginBottom: "5px",
                              color: "green",
                            }}
                          />
                        </button>

                        {/* button to view the customer's details */}
                        <button
                          type="button"
                          className="btn btn-outline-warning"
                          style={{ marginTop: "10px" }}
                          onClick={handleViewCustomerDetails}
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
                        No Customers yet
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

export default ListCustomers;
