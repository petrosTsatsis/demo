import React, {useEffect, useState} from "react";
import {FaCertificate, FaCheck, FaDatabase, FaRegUser} from "react-icons/fa";
import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import {ImBin} from "react-icons/im";
import {MdCancel, MdModeEdit} from "react-icons/md";
import {TbListDetails} from "react-icons/tb";
import Modal from "react-modal";
import {Link} from "react-router-dom";
import SSLCertificateService from "../../services/ssl-certificate-service";
import EditSSLCertificateModal from "./edit-ssl-certificate-modal";

const ListSSLCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [currentPageCertificate, setCurrentPageCertificate] = useState(1);
  const [rowsPerPageCertificate, setRowsPerPageCertificate] = useState(5);
  const [selectedCertificateId, setSelectedCertificateId] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [clickedCertificate, setClickedCertificate] = useState(null);
  const [latestCertificate, setLatestCertificate] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // call the method that fetches the certificate
    fetchCertificates();
  }, []);

  useEffect(() => {
    // find the certificate with the biggest id and set it as the last added certificate
    if (certificates.length > 0) {
      const maxIdCertificate = certificates.reduce((prev, current) =>
        prev.id > current.id ? prev : current
      );
      setLatestCertificate(maxIdCertificate);
    }
  }, [certificates]);

  // fetch all the certificates
  const fetchCertificates = async () => {
    try {
      const response = await SSLCertificateService.getCertificates();
      setCertificates(response.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
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

  // when a checkbox is checked open the popover with the options for the specific certificate and close it when we remove the check
  const handleCheckboxChange = (certificateId) => {
    if (selectedCertificateId === certificateId) {
      console.log("Unselecting certificates:", certificateId);
      setSelectedCertificateId(null);
      setPopoverOpen(false);
    } else {
      setSelectedCertificateId(certificateId);
      setPopoverOpen(true);
      const clickedCertificate = certificates.find(
        (certificate) => certificate.id === certificateId
      );
      setClickedCertificate(clickedCertificate);
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
    setClickedCertificate(null);
    setSelectedCertificateId(null);
  };

  // method that is updating the certificates array with the new edit array after a certificate's edit
  const handleCertificateUpdate = (updatedCertificate) => {
    // find the certificate
    const updatedIndex = certificates.findIndex(
      (certificate) => certificate.id === updatedCertificate.id
    );

    if (updatedIndex !== -1) {
      const updatedCertificates = [...certificates];
      updatedCertificates[updatedIndex] = updatedCertificate;

      setCertificates(updatedCertificates);
    }
  };

  // view the certificate's details
  const handleViewCertificateDetails = () => {
    if (latestCertificate) {
      window.location.href = `/SSLCertificates/${latestCertificate.id}`;
    }
  };

  // view the selected certificate's details
  const handleViewSelectedCertificateDetails = () => {
    if (selectedCertificateId) {
      window.location.href = `/SSLCertificates/${selectedCertificateId}`;
    }
  };

  // view the selected certificate's customer
  const handleViewSelectedCertificateCustomer = () => {
    if (selectedCertificateId) {
      const selectedCertificate = certificates.find(
        (certificate) => certificate.id === selectedCertificateId
      );
      if (selectedCertificate && selectedCertificate.customer) {
        const customerId = selectedCertificate.customer.id;
        const customerUrl = selectedCertificate.customer.name
          ? `/Companies/id/${customerId}`
          : `/Customers/${customerId}`;
        window.location.href = customerUrl;
      }
    }
  };

  // show the delete certificate confirmation modal
  const deleteCertificate = (id) => {
    setCertificateToDelete(id);
    setShowDeleteModal(true);
  };

  // certificate delete confirmation method
  const confirmDelete = () => {
    SSLCertificateService.deleteSSLCertificate(certificateToDelete)
      .then(() => {
        fetchCertificates();
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

  // method that sorts the certificate by the release date
  const sortByExpirationDate = () => {
    const sortedCertificates = [...certificates].sort((a, b) => {
      const dateA = new Date(a.expirationDate.split("-").reverse().join("-"));
      const dateB = new Date(b.expirationDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setCertificates(sortedCertificates);
  };
  // default sorting
  const sortByCertificateId = () => {
    const sortedCertificates = [...certificates].sort((a, b) => a.id - b.id);
    setCertificates(sortedCertificates);
  };

  // method that sorts the certificate by their type
  const sortByType = () => {
    const sortedCertificates = [...certificates].sort((a, b) =>
      a.type.localeCompare(b.type)
    );
    setCertificates(sortedCertificates);
  };

  const handlePageChangeCertificate = (newPage) => {
    setCurrentPageCertificate((prevPage) => {
      const totalPages = Math.ceil(
        certificates.length / rowsPerPageCertificate
      );
      const updatedPage = Math.min(Math.max(newPage, 1), totalPages);
      return updatedPage;
    });
  };

  const handleRowsPerPageChangeCertificate = (event) => {
    setRowsPerPageCertificate(parseInt(event.target.value));
    setCurrentPageCertificate(1);
  };

  const indexOfLastRowCertificate =
    currentPageCertificate * rowsPerPageCertificate;
  const indexOfFirstRowCertificate =
    indexOfLastRowCertificate - rowsPerPageCertificate;
  const currentRowsCertificate = certificates.slice(
    indexOfFirstRowCertificate,
    indexOfLastRowCertificate
  );

  return (
    // container that contains : add certificate button, popover for certificate, certificate table, latest certificate added
    <div className="container-fluid">
      <div className="row" style={{ marginTop: "60px" }}>
        <div
          className="col-md-2 d-flex justify-content-center"
          style={{ marginTop: "83px" }}
        >
          {/* add certificate button  */}
          <div>
            {/* popover for each certificate  */}
            {popoverOpen && clickedCertificate && (
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

                {/* popover's content  */}

                <div
                  className="popover-content"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <h6 style={{ marginBottom: "45px" }}>
                    <FaCertificate
                      style={{
                        marginRight: "6px",
                        marginBottom: "3px",
                        color: "#2a8ffa",
                      }}
                    />
                    SSL Certificate
                  </h6>

                  {/* view details popover button */}
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    style={{ marginBottom: "25px" }}
                    onClick={handleViewSelectedCertificateDetails}
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
                    style={{ marginBottom: "25px" }}
                    onClick={handleViewSelectedCertificateCustomer}
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

                  {/* delete certificate popover button  */}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    style={{ marginBottom: "25px" }}
                    onClick={() => deleteCertificate(selectedCertificateId)}
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

                  {/* edit certificate popover button  */}
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    style={{ marginBottom: "25px" }}
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

                  {/* render the EditSSLcertificateModal when we click the edit button*/}
                  <EditSSLCertificateModal
                    isOpen={showEditModal}
                    onRequestClose={handleCloseModal}
                    certificate={clickedCertificate}
                    onCertificateUpdate={handleCertificateUpdate}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* certificate table field */}
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
              <FaCertificate
                style={{ marginRight: "10px", marginBottom: "3px" }}
              />
              SSL Certificates
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
                    Type
                  </th>
                  <th style={{ width: "25%" }} scope="col">
                    Issuer
                  </th>
                  <th style={{ width: "15%" }} scope="col">
                    Status
                  </th>
                  <th style={{ width: "25%" }} scope="col">
                    Expiration
                  </th>
                </tr>
              </thead>
              <tbody>
                {certificates.length > 0 ? (
                  currentRowsCertificate.map((certificate, index) => (
                    <tr key={index}>
                      <td style={{ width: "10%" }}>
                        <div
                          className="form-check"
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedCertificateId === certificate.id}
                            onChange={() =>
                              handleCheckboxChange(certificate.id)
                            }
                          />
                        </div>
                      </td>
                      <td style={{ width: "25%" }}>{certificate.type}</td>
                      <td
                        style={{
                          width: "25%",
                        }}
                      >
                        {certificate.issuer}{" "}
                      </td>
                      <td
                        style={{
                          width: "15%",
                          fontWeight: "bold",
                          color: getStatusColor(certificate.status),
                        }}
                      >
                        {certificate.status}{" "}
                      </td>
                      <td
                        style={{
                          width: "25%",
                        }}
                      >
                        {certificate.expirationDate}
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
                          No SSL Certificates yet
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
                          disabled={currentPageCertificate === 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeCertificate(
                              currentPageCertificate - 1
                            );
                          }}
                        >
                          <GrFormPrevious
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <button
                          className="carousel-button"
                          disabled={
                            indexOfLastRowCertificate >= certificates.length
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeCertificate(
                              currentPageCertificate + 1
                            );
                          }}
                        >
                          <GrFormNext
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <span style={{ marginLeft: "10px", color: "white" }}>
                          Page {currentPageCertificate}
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
                          value={rowsPerPageCertificate}
                          onChange={handleRowsPerPageChangeCertificate}
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
                              sortByCertificateId();
                            } else if (selectedOption === "expiration") {
                              sortByExpirationDate();
                            } else if (selectedOption === "type") {
                              sortByType();
                            }
                          }}
                        >
                          <option value="id">Select Sort By</option>
                          <option value="expiration">
                            Sort by Expiration Date
                          </option>
                          <option value="type">Sort by Type</option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        {/* collapse field with the latest certificate */}
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
                  data-bs-target="#collapseCertificate"
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
                  {/* if we have at least one certificate show some fields */}
                  {certificates.length > 0 ? (
                    latestCertificate && (
                      <div>
                        <p style={{ marginBottom: "20px", marginTop: "10px" }}>
                          <span style={{ fontWeight: "bold" }}>Type:</span>{" "}
                          {latestCertificate.type}
                        </p>

                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Issuer:</span>{" "}
                          {latestCertificate.issuer}
                        </p>

                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Customer:</span>{" "}
                          {latestCertificate.customer.name ? (
                            <Link
                              to={`/Companies/id/${latestCertificate.customer.id}`}
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                                transition: "color 0.3s",
                              }}
                              className="hover-red"
                            >
                              {latestCertificate.customer.name}
                            </Link>
                          ) : (
                            <Link
                              to={`/Customers/${latestCertificate.customer.id}`}
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                                transition: "color 0.3s",
                              }}
                              className="hover-red"
                            >
                              {latestCertificate.customer.fname}{" "}
                              {latestCertificate.customer.lname}
                            </Link>
                          )}
                        </p>

                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>
                            Expiration:
                          </span>{" "}
                          {latestCertificate.expirationDate}
                        </p>

                        {/* button to view the certificate's details */}
                        <button
                          type="button"
                          className="btn btn-outline-warning"
                          style={{ marginTop: "10px" }}
                          onClick={handleViewCertificateDetails}
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
                        No SSL Certificates yet
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

export default ListSSLCertificates;
