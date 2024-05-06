import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Modal from "react-modal";
import SoftwareService from "../../services/software-service";
import {GrCloudSoftware, GrFormNext, GrFormPrevious} from "react-icons/gr";
import {FaCheck, FaDatabase} from "react-icons/fa";
import {IoIosAddCircleOutline} from "react-icons/io";
import {BiSolidPurchaseTag} from "react-icons/bi";
import {TbListDetails} from "react-icons/tb";
import {MdCancel, MdEuro, MdModeEdit} from "react-icons/md";
import {ImBin} from "react-icons/im";
import EditSoftwareModal from "./edit-software-modal";

const ListSoftware = () => {
  const [software, setSoftware] = useState([]);
  const [currentPageSoftware, setCurrentPageSoftware] = React.useState(1);
  const [rowsPerPageSoftware, setRowsPerPageSoftware] = React.useState(5);
  const [selectedSoftwareId, setSelectedSoftwareId] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [clickedSoftware, setClickedSoftware] = useState(null);
  const [latestSoftware, setLatestSoftware] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [softwareToDelete, setSoftwareToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // call the method that fetches the software
    fetchSoftware();
  }, []);

  useEffect(() => {
    // find the software with the biggest id and set it as the last added software
    if (software.length > 0) {
      const maxIdSoftware = software.reduce((prev, current) =>
        prev.id > current.id ? prev : current
      );
      setLatestSoftware(maxIdSoftware);
    }
  }, [software]);

  // fetch all the software
  const fetchSoftware = async () => {
    try {
      const response = await SoftwareService.getAllSoftware();
      setSoftware(response.data);
    } catch (error) {
      console.error("Error fetching software:", error);
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

  // when a checkbox is checked open the popover with the options for the specific software and close it when we remove the check
  const handleCheckboxChange = (softwareId) => {
    if (selectedSoftwareId === softwareId) {
      console.log("Unselecting software:", softwareId);
      setSelectedSoftwareId(null);
      setPopoverOpen(false);
    } else {
      setSelectedSoftwareId(softwareId);
      setPopoverOpen(true);
      const clickedSoftware = software.find(
        (theSoftware) => theSoftware.id === softwareId
      );
      setClickedSoftware(clickedSoftware);
    }
  };

  // method that fetches the last purchase of the last added software by finding the purchase with the biggest id
  const getLatestPurchase = async (softwareId) => {
    try {
      const response = await SoftwareService.getPurchases(softwareId);
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
    if (latestSoftware) {
      // display the latest purchase
      const latestPurchaseId = await getLatestPurchase(latestSoftware.id);
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
          alertDiv.textContent = `${latestSoftware.name} has not be purchased by anyone yet.`;

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
    setClickedSoftware(null);
    setSelectedSoftwareId(null);
  };

  // method that is updating the software array with the new edit array after a software's edit
  const handleSoftwareUpdate = (updatedSoftware) => {
    // find the software
    const updatedIndex = software.findIndex(
      (theSoftware) => theSoftware.id === updatedSoftware.id
    );

    if (updatedIndex !== -1) {
      const theUpdatedSoftwareList = [...software];
      theUpdatedSoftwareList[updatedIndex] = updatedSoftware;

      setSoftware(theUpdatedSoftwareList);
    }
  };

  // view the software's details
  const handleViewSoftwareDetails = () => {
    if (latestSoftware) {
      window.location.href = `/Software/${latestSoftware.id}`;
    }
  };

  // view the selected software's details
  const handleViewSelectedSoftwareDetails = () => {
    if (selectedSoftwareId) {
      window.location.href = `/Software/${selectedSoftwareId}`;
    }
  };

  // show the delete software confirmation modal
  const deleteSoftware = (id) => {
    setSoftwareToDelete(id);
    setShowDeleteModal(true);
  };

  // software delete confirmation method
  const confirmDelete = () => {
    SoftwareService.deleteSoftware(softwareToDelete)
      .then(() => {
        fetchSoftware();
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

  // method that sorts the software by their name
  const sortByName = () => {
    const sortedSoftware = [...software].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setSoftware(sortedSoftware);
  };

  // method that sorts the software by their category
  const sortByCategory = () => {
    const sortedSoftware = [...software].sort((a, b) =>
      a.category.localeCompare(b.category)
    );
    setSoftware(sortedSoftware);
  };
  // sort software by higher price
  const sortByHigherPrice = () => {
    const sortedSoftware = [...software].sort((b, a) => {
      return a.price - b.price;
    });

    setSoftware(sortedSoftware);
  };

  // sort software by lower price
  const sortByLowerPrice = () => {
    const sortedSoftware = [...software].sort((a, b) => {
      return a.price - b.price;
    });

    setSoftware(sortedSoftware);
  };

  //   // method that sorts the software by the release date
  const sortByReleaseDate = () => {
    const sortedSoftware = [...software].sort((a, b) => {
      const dateA = new Date(a.releaseDate.split("-").reverse().join("-"));
      const dateB = new Date(b.releaseDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setSoftware(sortedSoftware);
  };

  // default sorting
  const sortBySoftwareId = () => {
    const sortedSoftware = [...software].sort((a, b) => a.id - b.id);
    setSoftware(sortedSoftware);
  };

  // function to handle the pages
  const handlePageChangeSoftware = (newPage) => {
    setCurrentPageSoftware((prevPage) => {
      const totalPages = Math.ceil(software.length / rowsPerPageSoftware);
      const updatedPage = Math.min(Math.max(newPage, 1), totalPages);
      return updatedPage;
    });
  };

  // function to handle the rows per page
  const handleRowsPerPageChangeSoftware = (event) => {
    setRowsPerPageSoftware(parseInt(event.target.value));
    setCurrentPageSoftware(1);
  };

  const indexOfLastRowSoftware = currentPageSoftware * rowsPerPageSoftware;
  const indexOfFirstRowSoftware = indexOfLastRowSoftware - rowsPerPageSoftware;
  const currentRowsSoftware = software.slice(
    indexOfFirstRowSoftware,
    indexOfLastRowSoftware
  );
  return (
    // container that contains : add software button, popover for software, software table, latest software added
    <div className="container-fluid">
      <div className="row" style={{ marginTop: "60px" }}>
        <div
          className="col-md-2 d-flex justify-content-center"
          style={{ marginTop: "83px" }}
        >
          {/* add software button  */}
          <div>
            <Link
              to="/Software/add-software"
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
                Add Software{" "}
                <IoIosAddCircleOutline
                  style={{ fontSize: "20px", marginBottom: "2px" }}
                />{" "}
              </button>
            </Link>

            {/* popover for each software  */}
            {popoverOpen && clickedSoftware && (
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
                    <GrCloudSoftware
                      style={{ marginRight: "4px", color: "#2a8ffa" }}
                    />
                    {clickedSoftware.name}
                  </h6>

                  {/* view details popover button */}
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    style={{ marginBottom: "10px" }}
                    onClick={handleViewSelectedSoftwareDetails}
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

                  {/* edit software popover button  */}
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

                  {/* render the EditSoftwareModal when we click the edit button*/}
                  <EditSoftwareModal
                    isOpen={showEditModal}
                    onRequestClose={handleCloseModal}
                    theSoftware={clickedSoftware}
                    onSoftwareUpdate={handleSoftwareUpdate}
                  />

                  {/* delete software popover button  */}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    style={{ marginBottom: "10px" }}
                    onClick={() => deleteSoftware(selectedSoftwareId)}
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

        {/* software table field */}
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
              <GrCloudSoftware
                style={{ marginRight: "10px", marginBottom: "3px" }}
              />
              Software
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
                  <th style={{ width: "20%" }} scope="col">
                    Price per Month
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Version
                  </th>
                  <th style={{ width: "25%" }} scope="col">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody>
                {software.length > 0 ? (
                  currentRowsSoftware.map((theSoftware, index) => (
                    <tr key={index}>
                      <td style={{ width: "10%" }}>
                        <div
                          className="form-check"
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedSoftwareId === theSoftware.id}
                            onChange={() =>
                              handleCheckboxChange(theSoftware.id)
                            }
                          />
                        </div>
                      </td>
                      <td style={{ width: "25%" }}>{theSoftware.name}</td>
                      <td
                        style={{
                          width: "20%",
                          fontWeight: "bold",
                          color: "#12b569",
                        }}
                      >
                        {theSoftware.price}{" "}
                        <MdEuro style={{ marginBottom: "3px" }} />{" "}
                      </td>
                      <td
                        style={{
                          width: "20%",
                          fontWeight: "bold",
                        }}
                      >
                        {theSoftware.version}
                      </td>
                      <td style={{ width: "25%" }}>{theSoftware.category}</td>
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
                          No Software yet
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
                          disabled={currentPageSoftware === 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeSoftware(currentPageSoftware - 1);
                          }}
                        >
                          <GrFormPrevious
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <button
                          className="carousel-button"
                          disabled={indexOfLastRowSoftware >= software.length}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeSoftware(currentPageSoftware + 1);
                          }}
                        >
                          <GrFormNext
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <span style={{ marginLeft: "10px", color: "white" }}>
                          Page {currentPageSoftware}
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
                          value={rowsPerPageSoftware}
                          onChange={handleRowsPerPageChangeSoftware}
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
                              sortBySoftwareId();
                            } else if (selectedOption === "name") {
                              sortByName();
                            } else if (selectedOption === "category") {
                              sortByCategory();
                            } else if (selectedOption === "release date") {
                              sortByReleaseDate();
                            } else if (selectedOption === "higher price") {
                              sortByHigherPrice();
                            } else if (selectedOption === "lower price") {
                              sortByLowerPrice();
                            }
                          }}
                        >
                          <option value="id">Select Sort By</option>
                          <option value="name">Sort by Name</option>
                          <option value="category">Sort by Category</option>
                          <option value="release date">
                            Sort by Release Date
                          </option>
                          <option value="higher price">
                            Sort by Higher Price
                          </option>
                          <option value="lower price">
                            Sort by Lower Price
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
        {/* collapse field with the latest software */}
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
                  {/* if we have at least one software show some fields */}
                  {software.length > 0 ? (
                    latestSoftware && (
                      <div>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Name:</span>{" "}
                          {latestSoftware.name}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Version:</span>{" "}
                          {latestSoftware.version}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Price:</span>{" "}
                          {latestSoftware.price}{" "}
                          <MdEuro style={{ marginBottom: "3px" }} />{" "}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>
                            Registration Date:
                          </span>{" "}
                          <br /> {latestSoftware.registrationDate}
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

                        {/* button to view the software's details */}
                        <button
                          type="button"
                          className="btn btn-outline-warning"
                          style={{ marginTop: "10px" }}
                          onClick={handleViewSoftwareDetails}
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
                        No Software yet
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
      {softwareToDelete && (
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
          <h2>Delete Software Confirmation</h2>
          <p>Are you sure you want to delete this software ?</p>
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

export default ListSoftware;
