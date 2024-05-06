import React, {useEffect, useState} from "react";
import Avatar from "react-avatar";
import {BiSolidPurchaseTag} from "react-icons/bi";
import {BsBuildings} from "react-icons/bs";
import {FaCheck, FaDatabase, FaPhone} from "react-icons/fa";
import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import {ImBin} from "react-icons/im";
import {IoIosAddCircleOutline, IoMdContact} from "react-icons/io";
import {MdCancel, MdModeEdit} from "react-icons/md";
import {TbListDetails} from "react-icons/tb";
import Modal from "react-modal";
import {Link} from "react-router-dom";
import CompanyService from "../../services/company-service";
import CustomerService from "../../services/customer-service";
import AddContactsModal from "./add-contacts-modal";
import EditCompanyModal from "./edit-company-modal";

const ListCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [currentPageCompany, setCurrentPageCompany] = React.useState(1);
  const [rowsPerPageCompany, setRowsPerPageCompany] = React.useState(5);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [clickedCompany, setClickedCompany] = useState(null);
  const [latestCompany, setLatestCompany] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  useEffect(() => {
    // call the method that fetches the companies
    fetchCompanies();
  }, []);

  useEffect(() => {
    // find the company with the biggest id and set him/her as the last added company
    if (companies.length > 0) {
      const maxIdCompany = companies.reduce((prev, current) =>
        prev.id > current.id ? prev : current
      );
      setLatestCompany(maxIdCompany);
    }
  }, [companies]);

  // fetch all the companies
  const fetchCompanies = async () => {
    try {
      const response = await CompanyService.getAllCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
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

  // function to open the add contacts modal
  const handleAddContactsClick = () => {
    setShowAddContactModal(true);
  };

  // function to close the add contacts modal
  const handleCloseAddContactModal = () => {
    setShowAddContactModal(false);
  };

  // handle the collapse component
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // when a checkbox is checked open the popover with the options for the specific company and close it when we remove the check
  const handleCheckboxChange = (companyId) => {
    if (selectedCompanyId === companyId) {
      console.log("Unselecting companyr:", companyId);
      setSelectedCompanyId(null);
      setPopoverOpen(false);
    } else {
      setSelectedCompanyId(companyId);
      setPopoverOpen(true);
      const clickedCompany = companies.find(
        (company) => company.id === companyId
      );
      setClickedCompany(clickedCompany);
    }
  };

  // method that fetches the last purchase of the last added company by finding the purchase with the biggest id
  const getLatestPurchase = async (companyId) => {
    try {
      const response = await CustomerService.getPurchases(companyId);
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
    if (latestCompany) {
      // display the latest purchase
      const latestPurchaseId = await getLatestPurchase(latestCompany.id);
      if (latestPurchaseId) {
        window.location.href = `/Purchases/${latestPurchaseId}`;
      } else {
        // if there are 0 purchases from the company display an alert to inform the user
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
          alertDiv.textContent = `${latestCompany.name} has not made any purchases yet.`;

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
    setClickedCompany(null);
    setSelectedCompanyId(null);
  };

  // method that is updating the companies array with the new edit array after a company's edit
  const handleCompanyUpdate = (updatedCompany) => {
    // find the company
    const updatedIndex = companies.findIndex(
      (company) => company.id === updatedCompany.id
    );

    if (updatedIndex !== -1) {
      const updatedCompanies = [...companies];
      updatedCompanies[updatedIndex] = updatedCompany;

      setCompanies(updatedCompanies);
    }
  };

  // view the company's details
  const handleViewCompanyDetails = () => {
    if (latestCompany) {
      window.location.href = `/Companies/${latestCompany.id}`;
    }
  };

  // view the selected company's details
  const handleViewSelectedCompanyDetails = () => {
    if (selectedCompanyId) {
      window.location.href = `/Companies/${selectedCompanyId}`;
    }
  };

  // show the delete company confirmation modal
  const deleteCompany = (id) => {
    setCompanyToDelete(id);
    setShowDeleteModal(true);
  };

  // company delete confirmation method
  const confirmDelete = () => {
    CompanyService.deleteCompany(companyToDelete)
      .then(() => {
        fetchCompanies();
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

  // method that sorts the companies by their name
  const sortByName = () => {
    const sortedCompanies = [...companies].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setCompanies(sortedCompanies);
  };

  // default sorting
  const sortByCompanyId = () => {
    const sortedCompanies = [...companies].sort((a, b) => a.id - b.id);
    setCompanies(sortedCompanies);
  };

  // method that sorts the companies by their number of employees
  const sortByEmployeesNumber = () => {
    const sortedCompanies = [...companies].sort(
      (b, a) => a.employeesNumber - b.employeesNumber
    );
    setCompanies(sortedCompanies);
  };

  // method that sorts the companies by their annual revenue
  const sortByAnnualRevenue = () => {
    const sortedCompanies = [...companies].sort(
      (b, a) => a.annualRevenue - b.annualRevenue
    );
    setCompanies(sortedCompanies);
  };

  // function to handle the pages
  const handlePageChangeCompany = (newPage) => {
    setCurrentPageCompany((prevPage) => {
      const totalPages = Math.ceil(companies.length / rowsPerPageCompany);
      const updatedPage = Math.min(Math.max(newPage, 1), totalPages);
      return updatedPage;
    });
  };

  // function to handle the rows per page
  const handleRowsPerPageChangeCompany = (event) => {
    setRowsPerPageCompany(parseInt(event.target.value));
    setCurrentPageCompany(1);
  };

  const indexOfLastRowCompany = currentPageCompany * rowsPerPageCompany;
  const indexOfFirstRowCompany = indexOfLastRowCompany - rowsPerPageCompany;
  const currentRowsCompany = companies.slice(
    indexOfFirstRowCompany,
    indexOfLastRowCompany
  );
  return (
    // container that contains : add company button, popover for company, companies table, latest company added
    <div className="container-fluid">
      <div className="row" style={{ marginTop: "60px" }}>
        <div
          className="col-md-2 d-flex justify-content-center"
          style={{ marginTop: "83px" }}
        >
          {/* add company button  */}
          <div>
            <Link
              to="/Companies/add-company"
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
                Add Company{" "}
                <IoIosAddCircleOutline
                  style={{ fontSize: "20px", marginBottom: "2px" }}
                />{" "}
              </button>
            </Link>

            {/* popover for each company  */}
            {popoverOpen && clickedCompany && (
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
                      name={`${clickedCompany.name}`}
                      size="25"
                      round={true}
                      className="avatar"
                      style={{ marginRight: "5px" }}
                    />{" "}
                    {clickedCompany.name}
                  </h6>

                  {/* view details popover button */}
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    style={{ marginBottom: "15px" }}
                    onClick={handleViewSelectedCompanyDetails}
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

                  {/* edit company popover button  */}
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

                  {/* render the EditCompanyModal when we click the edit button*/}
                  <EditCompanyModal
                    isOpen={showEditModal}
                    onRequestClose={handleCloseModal}
                    company={clickedCompany}
                    onCompanyUpdate={handleCompanyUpdate}
                  />

                  {/* delete company popover button  */}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    style={{ marginBottom: "15px" }}
                    onClick={() => deleteCompany(selectedCompanyId)}
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

                  {/* Add Contacts Button */}
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={handleAddContactsClick}
                    style={{ marginBottom: "15px" }}
                  >
                    Add Contacts
                    <IoMdContact
                      style={{
                        marginLeft: "6px",
                        marginBottom: "5px",
                        fontSize: "18px",
                      }}
                    />
                  </button>

                  {/* render the AddContactsModal when we click the edit button*/}
                  <AddContactsModal
                    isOpen={showAddContactModal}
                    onRequestClose={handleCloseAddContactModal}
                    company={clickedCompany}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* companies table field */}
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
              <BsBuildings
                style={{ marginRight: "10px", marginBottom: "3px" }}
              />
              Companies
            </h3>
            <table
              className="components table table-striped table-hover"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={{ width: "10%", textAlign: "center" }} scope="col">
                    Select
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Name
                  </th>
                  <th style={{ width: "30%" }} scope="col">
                    Website
                  </th>
                  <th style={{ width: "25%" }} scope="col">
                    Email
                  </th>
                  <th style={{ width: "15%" }} scope="col">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody>
                {companies.length > 0 ? (
                  currentRowsCompany.map((company, index) => (
                    <tr key={index}>
                      <td style={{ width: "10%" }}>
                        <div
                          className="form-check"
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedCompanyId === company.id}
                            onChange={() => handleCheckboxChange(company.id)}
                          />
                        </div>
                      </td>
                      <td style={{ width: "20%" }}>
                        <Avatar
                          name={`${company.name}`}
                          size="25"
                          round={true}
                          className="avatar"
                          style={{ marginRight: "5px" }}
                        />
                        {company.name}
                      </td>
                      <td style={{ width: "30%" }}>
                        <a
                          onClick={() => {
                            let websiteUrl = company.website;
                            if (
                              !websiteUrl.startsWith("https://") &&
                              !websiteUrl.startsWith("http://")
                            ) {
                              websiteUrl = `https://${websiteUrl}`;
                            }
                            window.open(websiteUrl, "_blank");
                          }}
                          style={{
                            textDecoration: "none",
                            color: "#2a8ffa",
                            cursor: "pointer",
                          }}
                        >
                          {company.website || " "}
                        </a>
                      </td>
                      <td style={{ width: "25%", fontWeight: "bold" }}>
                        {company.email}
                      </td>
                      <td style={{ width: "15%" }}>
                        <FaPhone
                          style={{ marginRight: "3px", fontSize: "15px" }}
                        />{" "}
                        {company.phoneNumber}
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
                          No Companies yet
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
                          disabled={currentPageCompany === 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeCompany(currentPageCompany - 1);
                          }}
                        >
                          <GrFormPrevious
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <button
                          className="carousel-button"
                          disabled={indexOfLastRowCompany >= companies.length}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeCompany(currentPageCompany + 1);
                          }}
                        >
                          <GrFormNext
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <span style={{ marginLeft: "10px", color: "white" }}>
                          Page {currentPageCompany}
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
                          value={rowsPerPageCompany}
                          onChange={handleRowsPerPageChangeCompany}
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
                              sortByCompanyId();
                            } else if (selectedOption === "name") {
                              sortByName();
                            } else if (selectedOption === "employee number") {
                              sortByEmployeesNumber();
                            } else if (selectedOption === "annual revenue") {
                              sortByAnnualRevenue();
                            }
                          }}
                        >
                          <option value="id">Select Sort By</option>
                          <option value="name">Sort by Name</option>
                          <option value="employee number">
                            Sort by Employee Number
                          </option>
                          <option value="annual revenue">
                            Sort by Annual Revenue
                          </option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        {/* collapse field with the latest company */}
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
                  data-bs-target="#collapseCompany"
                  aria-expanded={isCollapsed ? "true" : "false"}
                  aria-controls="collapseCompanyr"
                  onClick={toggleCollapse}
                  style={{ width: "220px" }}
                  color="white"
                >
                  Latest Addition
                </button>
              </h2>
              <div
                id="collapseCompany"
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
                  {/* if we have at least one company show some fields */}
                  {companies.length > 0 ? (
                    latestCompany && (
                      <div>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Name:</span>{" "}
                          {latestCompany.name}
                        </p>
                        <p style={{ marginBottom: "20px"}}>
                          <span style={{ fontWeight: "bold" }}>Website:</span>{" "}
                          <a
                            href={latestCompany.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {latestCompany.website}
                          </a>
                        </p>
                        <p style={{ marginBottom: "15px" }}>
                          <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
                          {latestCompany.email}
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

                        {/* button to view the company's details */}
                        <button
                          type="button"
                          className="btn btn-outline-warning"
                          style={{ marginTop: "10px" }}
                          onClick={handleViewCompanyDetails}
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
                        No Companies yet
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
    </div>
  );
};

export default ListCompanies;
