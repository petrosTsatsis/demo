import React, {useEffect, useState} from "react";
import Avatar from "react-avatar";
import {BiPurchaseTag} from "react-icons/bi";
import {FaCheck, FaDatabase} from "react-icons/fa";
import {GrCloudSoftware, GrFormNext, GrFormPrevious} from "react-icons/gr";
import {ImBin} from "react-icons/im";
import {IoIosAddCircleOutline} from "react-icons/io";
import {MdCancel, MdEuro, MdModeEdit} from "react-icons/md";
import {TbListDetails} from "react-icons/tb";
import Modal from "react-modal";
import {Link} from "react-router-dom";
import PurchaseService from "../../services/purchase-service";
import EditPurchaseModal from "./edit-purchase-modal";

const ListPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [currentPagePurchase, setCurrentPagePurchase] = React.useState(1);
  const [rowsPerPagePurchase, setRowsPerPagePurchase] = React.useState(5);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [clickedPurchase, setClickedPurchase] = useState(null);
  const [latestPurchase, setLatestPurchase] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // call the method that fetches the purchases
    fetchPurchases();
  }, []);

  useEffect(() => {
    // find the purchase with the biggest id and set it as the last added purchase
    if (purchases.length > 0) {
      const maxIdPurchase = purchases.reduce((prev, current) =>
        prev.id > current.id ? prev : current
      );
      setLatestPurchase(maxIdPurchase);
    }
  }, [purchases]);

  // fetch all the purchases
  const fetchPurchases = async () => {
    try {
      const response = await PurchaseService.getAllPurchases();
      setPurchases(response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
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

  // when a checkbox is checked open the popover with the options for the specific purchase and close it when we remove the check
  const handleCheckboxChange = (purchaseId) => {
    if (selectedPurchaseId === purchaseId) {
      console.log("Unselecting purchase:", purchaseId);
      setSelectedPurchaseId(null);
      setPopoverOpen(false);
    } else {
      setSelectedPurchaseId(purchaseId);
      setPopoverOpen(true);
      const clickedPurchase = purchases.find(
        (purchase) => purchase.id === purchaseId
      );
      setClickedPurchase(clickedPurchase);
    }
  };

  // close the popover and remove the check from the checkbox
  const handlePopoverClose = () => {
    setPopoverOpen(false);
    setClickedPurchase(null);
    setSelectedPurchaseId(null);
  };

  // method that is updating the purchases array with the new edit array after a purchase's edit
  const handlePurchaseUpdate = (updatedPurchase) => {
    // find the purchase
    const updatedIndex = purchases.findIndex(
      (purchase) => purchase.id === updatedPurchase.id
    );

    if (updatedIndex !== -1) {
      const updatedPurchases = [...purchases];
      updatedPurchases[updatedIndex] = updatedPurchase;

      setPurchases(updatedPurchases);
    }
  };

  // view the purchase's details
  const handleViewPurchaseDetails = () => {
    if (latestPurchase) {
      window.location.href = `/Purchases/${latestPurchase.id}`;
    }
  };

  // view the selected purchase's details
  const handleViewSelectedPurchaseDetails = () => {
    if (selectedPurchaseId) {
      window.location.href = `/Purchases/${selectedPurchaseId}`;
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // sort purchases by higher price
  const sortByHigherPrice = () => {
    const sortedPurchases = [...purchases].sort((b, a) => {
      return a.price - b.price;
    });

    setPurchases(sortedPurchases);
  };

  // sort purchases by lower price
  const sortByLowerPrice = () => {
    const sortedPurchases = [...purchases].sort((a, b) => {
      return a.price - b.price;
    });

    setPurchases(sortedPurchases);
  };

  // method that sorts the purchase by the purchase date
  const sortByPurchaseDate = () => {
    const sortedPurchases = [...purchases].sort((a, b) => {
      const dateA = new Date(a.purchaseDate.split("-").reverse().join("-"));
      const dateB = new Date(b.purchaseDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setPurchases(sortedPurchases);
  };

  // default sorting
  const sortByPurchaseId = () => {
    const sortedPurchases = [...purchases].sort((a, b) => a.id - b.id);
    setPurchases(sortedPurchases);
  };

  const handlePageChangePurchase = (newPage) => {
    setCurrentPagePurchase((prevPage) => {
      const totalPages = Math.ceil(purchases.length / rowsPerPagePurchase);
      const updatedPage = Math.min(Math.max(newPage, 1), totalPages);
      return updatedPage;
    });
  };

  const handleRowsPerPageChangePurchase = (event) => {
    setRowsPerPagePurchase(parseInt(event.target.value));
    setCurrentPagePurchase(1);
  };

  const indexOfLastRowPurchase = currentPagePurchase * rowsPerPagePurchase;
  const indexOfFirstRowPurchase = indexOfLastRowPurchase - rowsPerPagePurchase;
  const currentRowsPurchase = purchases.slice(
    indexOfFirstRowPurchase,
    indexOfLastRowPurchase
  );

  return (
    // container that contains : add purchase button, popover for purchase, purchases table, latest purchase added
    <div className="container-fluid">
      <div className="row" style={{ marginTop: "60px" }}>
        <div
          className="col-md-2 d-flex justify-content-center"
          style={{ marginTop: "83px" }}
        >
          {/* add purchase button  */}
          <div>
            <Link
              to="/Purchases/add-purchase"
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
                Add Purchase{" "}
                <IoIosAddCircleOutline
                  style={{ fontSize: "20px", marginBottom: "2px" }}
                />{" "}
              </button>
            </Link>

            {/* popover for each purchase  */}
            {popoverOpen && clickedPurchase && (
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
                    {clickedPurchase.software.name} purchase
                  </h6>

                  {/* view details popover button */}
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    style={{ marginBottom: "10px" }}
                    onClick={handleViewSelectedPurchaseDetails}
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

                  {/* edit purchase popover button  */}
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

                  {/* render the EditPurchaseModal when we click the edit button*/}
                  <EditPurchaseModal
                    isOpen={showEditModal}
                    onRequestClose={handleCloseModal}
                    purchase={clickedPurchase}
                    onPurchaseUpdate={handlePurchaseUpdate}
                  />

                  {/* delete purchase popover button  */}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    style={{ marginBottom: "10px" }}
                    onClick={() => deletePurchase(selectedPurchaseId)}
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

        {/* purchase table field */}
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
              <BiPurchaseTag
                style={{ marginRight: "10px", marginBottom: "3px" }}
              />
              Purchases
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
                    Software
                  </th>
                  <th style={{ width: "25%" }} scope="col">
                    Customer
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Price
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Purchase Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchases.length > 0 ? (
                  currentRowsPurchase.map((purchase, index) => (
                    <tr key={index}>
                      <td style={{ width: "10%" }}>
                        <div
                          className="form-check"
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedPurchaseId === purchase.id}
                            onChange={() => handleCheckboxChange(purchase.id)}
                          />
                        </div>
                      </td>

                      <td style={{ width: "25%" }}>
                        <Link
                          to={`/Software/${purchase.software.id}`}
                          style={{
                            color: "inherit",
                            textDecoration: "none",
                            transition: "color 0.3s",
                          }}
                          className="hover-red"
                        >
                          {purchase.software.name}
                        </Link>
                      </td>
                      <td style={{ width: "25%" }}>
                        {purchase.customer.name ? (
                          <Link
                            to={`/Companies/${purchase.customer.id}`}
                            style={{
                              color: "inherit",
                              textDecoration: "none",
                              transition: "color 0.3s",
                            }}
                            className="hover-red"
                          >
                            <Avatar
                              name={`${purchase.customer.name}`}
                              size="25"
                              round={true}
                              className="avatar"
                              style={{ marginRight: "5px" }}
                            />{" "}
                            {purchase.customer.name}
                          </Link>
                        ) : (
                          <Link
                            to={`/Customers/${purchase.customer.id}`}
                            style={{
                              color: "inherit",
                              textDecoration: "none",
                              transition: "color 0.3s",
                            }}
                            className="hover-red"
                          >
                            <Avatar
                              name={`${purchase.customer.fname} ${purchase.customer.lname}`}
                              size="25"
                              round={true}
                              className="avatar"
                              style={{ marginRight: "5px" }}
                            />{" "}
                            {purchase.customer.fname} {purchase.customer.lname}
                          </Link>
                        )}
                      </td>
                      <td
                        style={{
                          width: "20%",
                          fontWeight: "bold",
                          color: "#12b569",
                        }}
                      >
                        {purchase.price}{" "}
                        <MdEuro style={{ marginBottom: "3px" }} />
                      </td>
                      <td style={{ width: "20%" }}>{purchase.purchaseDate}</td>
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
                          No Purchases yet
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
                          disabled={currentPagePurchase === 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangePurchase(currentPagePurchase - 1);
                          }}
                        >
                          <GrFormPrevious
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <button
                          className="carousel-button"
                          disabled={indexOfLastRowPurchase >= purchases.length}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangePurchase(currentPagePurchase + 1);
                          }}
                        >
                          <GrFormNext
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <span style={{ marginLeft: "10px", color: "white" }}>
                          Page {currentPagePurchase}
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
                          value={rowsPerPagePurchase}
                          onChange={handleRowsPerPageChangePurchase}
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
                              sortByPurchaseId();
                            } else if (selectedOption === "purchase date") {
                              sortByPurchaseDate();
                            } else if (selectedOption === "higher price") {
                              sortByHigherPrice();
                            } else if (selectedOption === "lower price") {
                              sortByLowerPrice();
                            }
                          }}
                        >
                          <option value="id">Select Sort By</option>
                          <option value="purchase date">
                            Sort by Purchase Date
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
        {/* collapse field with the latest purchase */}
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
                  {/* if we have at least one purchase show some fields */}
                  {purchases.length > 0 ? (
                    latestPurchase && (
                      <div>
                        <p>
                          <span style={{ fontWeight: "bold" }}>
                            Software Name:
                          </span>{" "}
                          <Link
                            to={`/Software/${latestPurchase.software.id}`}
                            style={{
                              color: "inherit",
                              textDecoration: "none",
                              transition: "color 0.3s",
                            }}
                            className="hover-gold"
                          >
                            {latestPurchase.software.name}
                          </Link>
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Price:</span>{" "}
                          {latestPurchase.price}{" "}
                          <MdEuro style={{ marginBottom: "3px" }} />{" "}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>
                            Purchase Date:
                          </span>{" "}
                          <br /> {latestPurchase.purchaseDate}
                        </p>

                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Customer:</span>{" "}
                          {latestPurchase.customer.name ? (
                            <Link
                              to={`/Companies/id/${latestPurchase.customer.id}`}
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                                transition: "color 0.3s",
                              }}
                              className="hover-red"
                            >
                              {latestPurchase.customer.name}
                            </Link>
                          ) : (
                            <Link
                              to={`/Customers/${latestPurchase.customer.id}`}
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                                transition: "color 0.3s",
                              }}
                              className="hover-red"
                            >
                              {latestPurchase.customer.fname}{" "}
                              {latestPurchase.customer.lname}
                            </Link>
                          )}
                          <br />
                        </p>

                        {/* button to view the purchase's details */}
                        <button
                          type="button"
                          className="btn btn-outline-warning"
                          style={{ marginTop: "10px" }}
                          onClick={handleViewPurchaseDetails}
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
                        No Purchases yet
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

export default ListPurchases;
