import {getMonth, getYear} from "date-fns";
import {range} from "lodash";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {CgDanger} from "react-icons/cg";
import {FaCalendarAlt, FaCheck, FaUser} from "react-icons/fa";
import {GrCloudSoftware} from "react-icons/gr";
import {MdCancel, MdEuro, MdModeEdit} from "react-icons/md";
import {TbLicense} from "react-icons/tb";
import Modal from "react-modal";
import CustomerService from "../../services/customer-service";
import PurchaseService from "../../services/purchase-service";
import SoftwareService from "../../services/software-service";

const EditPurchaseModal = ({
  isOpen,
  onRequestClose,
  purchase,
  onPurchaseUpdate,
}) => {
  const [price, setPrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [licensingOption, setLicensingOption] = useState("");
  const [theSoftware, setTheSoftware] = useState(null);
  const [customer, setCustomer] = useState("");
  const [software, setSoftware] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [genericError, setGenericError] = useState("");
  const years = range(1955, getYear(new Date()) + 10, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (theSoftware) {
      let updatedPrice = theSoftware.price;

      // Adjust price based on licensing option
      if (licensingOption === "3 Months") {
        updatedPrice *= 2;
      } else if (licensingOption === "6 Months") {
        updatedPrice *= 5;
      } else if (licensingOption === "1 Year") {
        updatedPrice *= 10;
      }

      // Round the price to two decimal places
      updatedPrice = parseFloat(updatedPrice).toFixed(2);
      setPrice(updatedPrice);
      console.log(updatedPrice);
    }
  }, [licensingOption, theSoftware]);

  useEffect(() => {
    // Fetch customers
    CustomerService.getAllCustomers()
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });

    // Fetch software
    SoftwareService.getAllSoftware()
      .then((response) => {
        setSoftware(response.data);
      })
      .catch((error) => {
        console.error("Error fetching software:", error);
      });
  }, []);

  useEffect(() => {
    if (purchase) {
      setTheSoftware(purchase.software);
      setCustomer(purchase.customer);
      setPrice(purchase.price);
      setLicensingOption(purchase.licensingOption);
      const parsedDate = moment(purchase.purchaseDate, "DD-MM-YYYY").toDate();
      setPurchaseDate(parsedDate);
    }
  }, [purchase]);

  let existingAlert = document.querySelector(".alert");

  // edit purchase method
  const handleSubmitEditForm = (e) => {
    e.preventDefault();
    setGenericError("");

    // check if we have any empty fields
    if (
      !price ||
      !purchaseDate ||
      !licensingOption ||
      !customer ||
      !theSoftware
    ) {
      setGenericError("Please fill in all required fields.");
      return;
    }

    // Format the date to "dd-mm-yyyy"
    const formattedPurchaseDate = moment(purchaseDate).format("DD-MM-YYYY");

    PurchaseService.updatePurchase(purchase.id, {
      price,
      purchaseDate: formattedPurchaseDate,
      licensingOption,
      customer: customer,
      software: theSoftware,
    })
      .then(() => {
        onRequestClose();
        fetchUpdatedPurchaseData();

        // Display success alert when we complete the update
        if (!existingAlert) {
          // define the appearance of the alert
          const alertDiv = document.createElement("div");
          alertDiv.className = "alert alert-success";
          alertDiv.setAttribute("role", "alert");
          alertDiv.style.width = "300px";
          alertDiv.style.height = "100px";
          alertDiv.style.position = "fixed";
          alertDiv.style.top = "10px";
          alertDiv.style.left = "50%";
          alertDiv.style.transform = "translateX(-50%)";
          alertDiv.style.zIndex = "9999";
          alertDiv.textContent = "Purchase details saved successfully.";

          // Close button of the alert
          const closeButton = document.createElement("button");
          closeButton.textContent = "Okay";
          closeButton.className = "btn btn-outline-success btn-sm";
          closeButton.style.width = "80px";
          closeButton.style.borderRadius = "50px";
          closeButton.style.marginTop = "10px";
          closeButton.style.marginLeft = "90px";
          closeButton.onclick = () => {
            alertDiv.remove();
            existingAlert = null;
          };

          alertDiv.appendChild(closeButton);
          document.body.appendChild(alertDiv);
          existingAlert = alertDiv;
        }
      })
      .catch((error) => {
        if (error.response) {
          setGenericError(
            "An error occurred while updating the purchase. Please try again."
          );
          console.log(error);
        }
      });
  };

  // method to update the purchase in the list-purchases component
  const fetchUpdatedPurchaseData = () => {
    PurchaseService.getPurchase(purchase.id)
      .then((response) => {
        // update the purchase in the list-purchases component
        onPurchaseUpdate(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // method which reset the fields and error status after closing the form
  const resetState = () => {
    setTheSoftware(purchase.software);
    setCustomer(purchase.customer);
    setPrice(purchase.price);
    setLicensingOption(purchase.licensingOption);
    const parsedDate = moment(purchase.purchaseDate, "DD-MM-YYYY").toDate();
    setPurchaseDate(parsedDate);
    setGenericError("");
  };

  return (
    // modal with the edit form
    <Modal
      className="modal-style"
      isOpen={isOpen}
      onRequestClose={() => {
        onRequestClose();
        resetState();
      }}
      contentLabel="Edit Modal"
      style={{
        content: {
          outline: "none",
        },
        overlay: {
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgb(219, 213, 201, 0.6)",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "85vh",
        }}
      >
        <div className="container-lg">
          {/* edit purchase form  */}
          <form
            onSubmit={handleSubmitEditForm}
            className="container-fluid"
            style={{
              marginTop: "13px",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                textAlign: "center",
                marginBottom: "40px",
                backgroundColor: "#313949",
                color: "#daa520",
                borderRadius: "50px",
                height: "40px",
                marginTop: "15px",
              }}
            >
              {" "}
              <MdModeEdit style={{ marginBottom: "4px" }} /> Edit Purchase
            </h3>
            {/* software, licensing option and price fields */}
            <Row
              className="mt-4"
              style={{
                marginBottom: "30px",

                marginTop: "20px",
              }}
            >
              <Col className="d-flex justify-content-center align-items-center">
                <div
                  style={{
                    marginBottom: "15px",
                    position: "relative",
                  }}
                >
                  <label htmlFor="software" style={{ display: "block" }}>
                    {" "}
                    <GrCloudSoftware
                      style={{
                        paddingBottom: "5px",
                        fontSize: "22px",
                        color: "#daa520",
                      }}
                    />{" "}
                    Software
                  </label>
                  <select
                    id="software"
                    className="form-control-call"
                    value={theSoftware ? theSoftware.id : ""}
                    onChange={(e) => {
                      const selectedSoftwareId = e.target.value;
                      const selectedSoftware = software.find(
                        (item) => item.id === parseInt(selectedSoftwareId)
                      );
                      setTheSoftware(selectedSoftware);
                    }}
                    style={{
                      width: "200px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    <option value="" disabled>
                      Select Software
                    </option>
                    {software.map((softwareItem) => (
                      <option key={softwareItem.id} value={softwareItem.id}>
                        {softwareItem.name}
                      </option>
                    ))}
                  </select>
                  {/* Check if theSoftware is null or undefined */}
                  {!theSoftware && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "6%",
                        top: "72%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </div>
              </Col>
              <Col className="d-flex justify-content-center align-items-center">
                <div
                  style={{
                    marginBottom: "15px",
                    position: "relative",
                  }}
                >
                  <label htmlFor="licensingOption" style={{ display: "block" }}>
                    {" "}
                    <TbLicense
                      style={{
                        paddingBottom: "5px",
                        fontSize: "22px",
                        color: "#daa520",
                      }}
                    />{" "}
                    Licensing Option
                  </label>
                  <select
                    id="licensingOption"
                    className="form-control-call"
                    value={licensingOption}
                    onChange={(e) => {
                      setLicensingOption(e.target.value);
                    }}
                    style={{
                      width: "200px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    <option value="" disabled>
                      Select License
                    </option>
                    {theSoftware &&
                      theSoftware.licensingOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                  </select>
                  {licensingOption === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "8%",
                        top: "70%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </div>
              </Col>
              <Col className="d-flex justify-content-center align-items-center">
                <div
                  style={{
                    marginBottom: "15px",
                    position: "relative",
                  }}
                >
                  <label htmlFor="price" style={{ display: "block" }}>
                    {" "}
                    <MdEuro
                      style={{
                        paddingBottom: "5px",
                        fontSize: "20px",
                        color: "#daa520",
                      }}
                    />{" "}
                    Price
                  </label>
                  <input
                    id="price"
                    type="text"
                    className="form-control-call"
                    value={price}
                    placeholder="Software Price"
                    readOnly
                    style={{
                      width: "200px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  />
                  {price === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "8%",
                        top: "70%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </div>
              </Col>
            </Row>
            {/* customer and purchase date fields */}
            <Row
              className="mt-4 justify-content-center"
              style={{
                marginTop: "20px",
              }}
            >
              <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  style={{
                    marginBottom: "15px",
                    position: "relative",
                  }}
                >
                  <label htmlFor="customer" style={{ display: "block" }}>
                    {" "}
                    <FaUser
                      style={{
                        paddingBottom: "5px",
                        fontSize: "22px",
                        color: "#daa520",
                      }}
                    />{" "}
                    Customer
                  </label>
                  <select
                    id="customers"
                    className="form-control-call"
                    value={customer ? customer.id : ""}
                    onChange={(e) => {
                      const selectedCustomerId = e.target.value;
                      const selectedCustomer = customers.find(
                        (customer) =>
                          customer.id === parseInt(selectedCustomerId)
                      );
                      setCustomer(selectedCustomer);
                    }}
                    style={{
                      width: "200px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    <option value="" disabled>
                      Select Customer
                    </option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name
                          ? `${customer.name}`
                          : `${customer.fname} ${customer.lname}`}
                      </option>
                    ))}
                  </select>
                  {customer === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "5%",
                        top: "72%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </div>
              </Col>
              <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
              >
                <div
                  style={{
                    marginBottom: "15px",
                    position: "relative",
                  }}
                >
                  <label htmlFor="purchaseDate" style={{ display: "block" }}>
                    {" "}
                    <FaCalendarAlt
                      style={{
                        paddingBottom: "5px",
                        fontSize: "22px",
                        color: "#daa520",
                      }}
                    />{" "}
                    Purchase Date
                  </label>
                  <DatePicker
                    className="purchase-date"
                    renderCustomHeader={({ date, changeYear, changeMonth }) => (
                      <div className="custom-header-container">
                        <select
                          className="year-picker"
                          value={getYear(date)}
                          onChange={(e) => changeYear(parseInt(e.target.value))}
                        >
                          {years.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        <select
                          className="month-picker"
                          value={months[getMonth(date)]}
                          onChange={(e) =>
                            changeMonth(months.indexOf(e.target.value))
                          }
                        >
                          {months.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    selected={purchaseDate}
                    onChange={(purchaseDate) => {
                      setPurchaseDate(purchaseDate);
                    }}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                  />
                  {purchaseDate === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "8%",
                        top: "70%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </div>
              </Col>
            </Row>

            <div className="mt-4 text-center" style={{ marginBottom: "15px" }}>
              {genericError && (
                <p style={{ color: "#dc3545" }}>{genericError}</p>
              )}
              <button
                type="submit"
                className="btn btn-outline-success mr-2"
                style={{ marginRight: "10px" }}
              >
                Save{" "}
                <FaCheck
                  style={{
                    marginLeft: "4px",
                    fontSize: "15px",
                    marginBottom: "3px",
                  }}
                />{" "}
              </button>
              <button
                type="button"
                onClick={() => {
                  onRequestClose();
                  resetState();
                }}
                className="btn btn-outline-danger"
              >
                Cancel{" "}
                <MdCancel
                  style={{
                    marginLeft: "4px",
                    fontSize: "15px",
                    marginBottom: "3px",
                  }}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EditPurchaseModal;
