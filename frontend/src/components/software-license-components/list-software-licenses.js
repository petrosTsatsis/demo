import React, {useEffect, useState} from "react";
import {FaCheck, FaDatabase, FaRegUser} from "react-icons/fa";
import {GrCloudSoftware, GrFormNext, GrFormPrevious, GrLicense,} from "react-icons/gr";
import {ImBin} from "react-icons/im";
import {MdCancel, MdModeEdit} from "react-icons/md";
import {TbListDetails} from "react-icons/tb";
import Modal from "react-modal";
import {Link} from "react-router-dom";
import SoftwareLicenseService from "../../services/software-license-service";
import EditSoftwareLicenseModal from "./edit-license-modal";

const ListSoftwareLicenses = () => {
  const [licenses, setLicenses] = useState([]);
  const [currentPageLicense, setCurrentPageLicense] = React.useState(1);
  const [rowsPerPageLicense, setRowsPerPageLicense] = React.useState(5);
  const [selectedLicenseId, setSelectedLicenseId] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [clickedLicense, setClickedLicense] = useState(null);
  const [latestLicense, setLatestLicense] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [licenseToDelete, setLicenseToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // call the method that fetches the licenses
    fetchLicenses();
  }, []);

  useEffect(() => {
    // find the license with the biggest id and set it as the last added license
    if (licenses.length > 0) {
      const maxIdLicense = licenses.reduce((prev, current) =>
        prev.id > current.id ? prev : current
      );
      setLatestLicense(maxIdLicense);
    }
  }, [licenses]);

  // fetch all the licenses
  const fetchLicenses = async () => {
    try {
      const response = await SoftwareLicenseService.getLicenses();
      setLicenses(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching licenses:", error);
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

  // when a checkbox is checked open the popover with the options for the specific license and close it when we remove the check
  const handleCheckboxChange = (licenseId) => {
    if (selectedLicenseId === licenseId) {
      console.log("Unselecting licenses:", licenseId);
      setSelectedLicenseId(null);
      setPopoverOpen(false);
    } else {
      setSelectedLicenseId(licenseId);
      setPopoverOpen(true);
      const clickedLicense = licenses.find(
        (license) => license.id === licenseId
      );
      setClickedLicense(clickedLicense);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "#ffc107";
      case "Active":
        return "#12b569";
      case "Expired":
        return "#dc3545";
      case "Completed":
        return "#12b569";
      default:
        return "inherit";
    }
  };

  // close the popover and remove the check from the checkbox
  const handlePopoverClose = () => {
    setPopoverOpen(false);
    setClickedLicense(null);
    setSelectedLicenseId(null);
  };

  // method that is updating the license array with the new edit array after a license's edit
  const handleLicenseUpdate = (updatedLicense) => {
    // find the license
    const updatedIndex = licenses.findIndex(
      (license) => license.id === updatedLicense.id
    );

    if (updatedIndex !== -1) {
      const updatedLicenses = [...licenses];
      updatedLicenses[updatedIndex] = updatedLicense;

      setLicenses(updatedLicenses);
    }
  };

  // view the license's details
  const handleViewLicenseDetails = () => {
    if (latestLicense) {
      window.location.href = `/SoftwareLicenses/${latestLicense.id}`;
    }
  };

  // view the selected license's details
  const handleViewSelectedLicenseDetails = () => {
    if (selectedLicenseId) {
      window.location.href = `/SoftwareLicenses/${selectedLicenseId}`;
    }
  };

  // view the selected license's customer
  const handleViewSelectedLicenseCustomer = () => {
    if (selectedLicenseId) {
      const selectedLicense = licenses.find(
        (license) => license.id === selectedLicenseId
      );
      if (selectedLicense && selectedLicense.customer) {
        const customerId = selectedLicense.customer.id;
        const customerUrl = selectedLicense.customer.name
          ? `/Companies/id/${customerId}`
          : `/Customers/${customerId}`;
        window.location.href = customerUrl;
      }
    }
  };

  // view the selected license's details
  const handleViewSelectedLicenseSoftware = () => {
    if (selectedLicenseId) {
      const selectedLicense = licenses.find(
        (license) => license.id === selectedLicenseId
      );
      if (selectedLicense && selectedLicense.software) {
        const softwareId = selectedLicense.software.id;
        window.location.href = `/Software/${softwareId}`;
      }
    }
  };

  // show the delete license confirmation modal
  const deleteLicense = (id) => {
    setLicenseToDelete(id);
    setShowDeleteModal(true);
  };

  // license delete confirmation method
  const confirmDelete = () => {
    SoftwareLicenseService.deleteSoftwareLicense(licenseToDelete)
      .then(() => {
        fetchLicenses();
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

  // method that sorts the license by the release date
  const sortByActivationDate = () => {
    const sortedLicenses = [...licenses].sort((a, b) => {
      const dateA = new Date(a.activationDate.split("-").reverse().join("-"));
      const dateB = new Date(b.activationDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setLicenses(sortedLicenses);
  };

  // method that sorts the license by the release date
  const sortByExpirationDate = () => {
    const sortedLicenses = [...licenses].sort((a, b) => {
      const dateA = new Date(a.expirationDate.split("-").reverse().join("-"));
      const dateB = new Date(b.expirationDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setLicenses(sortedLicenses);
  };
  // default sorting
  const sortByLicenseId = () => {
    const sortedLicenses = [...licenses].sort((a, b) => a.id - b.id);
    setLicenses(sortedLicenses);
  };

  const handlePageChangeLicense = (newPage) => {
    setCurrentPageLicense((prevPage) => {
      const totalPages = Math.ceil(licenses.length / rowsPerPageLicense);
      const updatedPage = Math.min(Math.max(newPage, 1), totalPages);
      return updatedPage;
    });
  };

  const handleRowsPerPageChangeLicense = (event) => {
    setRowsPerPageLicense(parseInt(event.target.value));
    setCurrentPageLicense(1);
  };

  const indexOfLastRowLicense = currentPageLicense * rowsPerPageLicense;
  const indexOfFirstRowLicense = indexOfLastRowLicense - rowsPerPageLicense;
  const currentRowsLicense = licenses.slice(
    indexOfFirstRowLicense,
    indexOfLastRowLicense
  );

  return (
    // container that contains : add license button, popover for license, license table, latest license added
    <div className="container-fluid">
      <div className="row" style={{ marginTop: "60px" }}>
        <div
          className="col-md-2 d-flex justify-content-center"
          style={{ marginTop: "83px" }}
        >
          {/* add license button  */}
          <div>
            {/* popover for each license  */}
            {popoverOpen && clickedLicense && (
              <div
                className="popover"
                style={{
                  width: "220px",
                  backgroundColor: "#313949",
                  padding: "10px",
                  borderRadius: "15px",
                  boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.5)",
                  color: "white",
                  height: "375px",
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
                  <h6 style={{ marginBottom: "30px" }}>
                    <GrLicense
                      style={{
                        marginRight: "6px",
                        marginBottom: "3px",
                        color: "#2a8ffa",
                      }}
                    />
                    {clickedLicense.name}
                  </h6>

                  {/* view details popover button */}
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    style={{ marginBottom: "15px" }}
                    onClick={handleViewSelectedLicenseDetails}
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

                  {/* view details popover button */}
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    style={{ marginBottom: "15px" }}
                    onClick={handleViewSelectedLicenseCustomer}
                  >
                    Customer
                    <FaRegUser
                      style={{
                        marginLeft: "4px",
                        marginBottom: "3px",
                        fontSize: "18px",
                      }}
                    />
                  </button>

                  {/* view details popover button */}
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    style={{ marginBottom: "15px" }}
                    onClick={handleViewSelectedLicenseSoftware}
                  >
                    Software
                    <GrCloudSoftware
                      style={{
                        marginLeft: "4px",
                        marginBottom: "3px",
                        fontSize: "18px",
                      }}
                    />
                  </button>

                  {/* delete license popover button  */}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    style={{ marginBottom: "15px" }}
                    onClick={() => deleteLicense(selectedLicenseId)}
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

                  {/* edit license popover button  */}
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

                  {/* render the EditLicenseModal when we click the edit button*/}
                  <EditSoftwareLicenseModal
                    isOpen={showEditModal}
                    onRequestClose={handleCloseModal}
                    license={clickedLicense}
                    onLicenseUpdate={handleLicenseUpdate}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* license table field */}
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
              <GrLicense style={{ marginRight: "10px", marginBottom: "3px" }} />
              Software Licenses
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
                  <th style={{ width: "25%" }} scope="col">
                    Name
                  </th>
                  <th style={{ width: "15%" }} scope="col">
                    Status
                  </th>
                  <th style={{ width: "25%" }} scope="col">
                    Activation Date
                  </th>
                  <th style={{ width: "25%" }} scope="col">
                    Expiration
                  </th>
                </tr>
              </thead>
              <tbody>
                {licenses.length > 0 ? (
                  currentRowsLicense.map((license, index) => (
                    <tr key={index}>
                      <td style={{ width: "10%" }}>
                        <div
                          className="form-check"
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedLicenseId === license.id}
                            onChange={() => handleCheckboxChange(license.id)}
                          />
                        </div>
                      </td>
                      <td style={{ width: "25%" }}>{license.name}</td>
                      <td
                        style={{
                          width: "15%",
                          fontWeight: "bold",
                          color: getStatusColor(license.status),
                        }}
                      >
                        {license.status}{" "}
                      </td>
                      <td
                        style={{
                          width: "25%",
                        }}
                      >
                        {license.activationDate}
                      </td>
                      <td style={{ width: "25%" }}>{license.expirationDate}</td>
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
                          No Software Licenses yet
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
                          disabled={currentPageLicense === 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeLicense(currentPageLicense - 1);
                          }}
                        >
                          <GrFormPrevious
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <button
                          className="carousel-button"
                          disabled={indexOfLastRowLicense >= licenses.length}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeLicense(currentPageLicense + 1);
                          }}
                        >
                          <GrFormNext
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <span style={{ marginLeft: "10px", color: "white" }}>
                          Page {currentPageLicense}
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
                          value={rowsPerPageLicense}
                          onChange={handleRowsPerPageChangeLicense}
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
                              sortByLicenseId();
                            } else if (selectedOption === "expiration") {
                              sortByExpirationDate();
                            } else if (selectedOption === "activation") {
                              sortByActivationDate();
                            }
                          }}
                        >
                          <option value="id">Select Sort By</option>
                          <option value="activation">
                            Sort by Activation Date
                          </option>
                          <option value="expiration">
                            Sort by Expiration Date
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
        {/* collapse field with the latest license */}
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
                  data-bs-target="#collapseSoftware"
                  aria-expanded={isCollapsed ? "true" : "false"}
                  aria-controls="collapseSoftware"
                  onClick={toggleCollapse}
                  style={{ width: "220px" }}
                  color="white"
                >
                  Latest Addition
                </button>
              </h2>
              <div
                id="collapseSoftware"
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
                  {/* if we have at least one license show some fields */}
                  {licenses.length > 0 ? (
                    latestLicense && (
                      <div>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Name:</span>{" "}
                          {latestLicense.name}
                        </p>

                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Customer:</span>{" "}
                          {latestLicense.customer.name ? (
                            <Link
                              to={`/Companies/id/${latestLicense.customer.id}`}
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                                transition: "color 0.3s",
                              }}
                              className="hover-red"
                            >
                              {latestLicense.customer.name}
                            </Link>
                          ) : (
                            <Link
                              to={`/Customers/${latestLicense.customer.id}`}
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                                transition: "color 0.3s",
                              }}
                              className="hover-red"
                            >
                              {latestLicense.customer.fname}{" "}
                              {latestLicense.customer.lname}
                            </Link>
                          )}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Software:</span>{" "}
                          <Link
                            to={`/Software/${latestLicense.software.id}`}
                            style={{
                              color: "inherit",
                              textDecoration: "none",
                              transition: "color 0.3s",
                            }}
                            className="hover-red"
                          >
                            {latestLicense.software.name}
                          </Link>{" "}
                        </p>

                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>
                            Activation:
                          </span>{" "}
                          {latestLicense.activationDate}
                        </p>

                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>
                            Expiration:
                          </span>{" "}
                          {latestLicense.expirationDate}
                        </p>

                        {/* button to view the license's details */}
                        <button
                          type="button"
                          className="btn btn-outline-warning"
                          style={{ marginTop: "10px" }}
                          onClick={handleViewLicenseDetails}
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
                        No Software Licenses yet
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

export default ListSoftwareLicenses;
