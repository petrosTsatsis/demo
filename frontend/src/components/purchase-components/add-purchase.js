import {getMonth, getYear} from "date-fns";
import {range} from "lodash";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {BiSolidPurchaseTag} from "react-icons/bi";
import {CgDanger} from "react-icons/cg";
import {FaCalendarAlt, FaCheck, FaUser} from "react-icons/fa";
import {GrCloudSoftware} from "react-icons/gr";
import {MdCancel, MdEuro} from "react-icons/md";
import {TbLicense} from "react-icons/tb";
import {Link} from "react-router-dom";
import CustomerService from "../../services/customer-service";
import PurchaseService from "../../services/purchase-service";
import SoftwareService from "../../services/software-service";

const AddPurchase = () => {
  const [price, setPrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [licensingOption, setLicensingOption] = useState("");
  const [theSoftware, setTheSoftware] = useState(null);
  const [customer, setCustomer] = useState("");
  const [software, setSoftware] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [genericError, setGenericError] = useState("");
  const [loading, setLoading] = useState(false);
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

      // adjust price based on licensing option
      if (licensingOption === "3 Months") {
        updatedPrice *= 2;
      } else if (licensingOption === "6 Months") {
        updatedPrice *= 5;
      } else if (licensingOption === "1 Year") {
        updatedPrice *= 10;
      }

      // round the price to two decimal places
      updatedPrice = parseFloat(updatedPrice).toFixed(2);
      setPrice(updatedPrice);
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

  // Add purchase method
  const addPurchase = (e) => {
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

    const purchase = {
      price,
      purchaseDate: formattedPurchaseDate,
      licensingOption,
      customer: customer,
      software: theSoftware,
    };

    PurchaseService.addPurchase(purchase)
      .then((response) => {
        //set the loading spinner and 1 second delay before redirect to /Purchases
        setTimeout(() => {
          setLoading(false);
          window.location.href = "/Purchases";
        }, 1000);

        console.log(response.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          setGenericError(
            "An error occurred while adding the purchase. Please try again."
          );
          console.log(error);
        }
      });

    setLoading(true);
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "85vh",
      }}
    >
      {/* render the spinner after we have added the purchase */}
      {loading && (
        <div className="text-center">
          <div
            className="spinner-border"
            role="status"
            style={{
              color: "rgb(140, 191, 64)",
              width: "5rem",
              height: "5rem",
            }}
          >
            <span className="visually-hidden">.</span>
          </div>
          <h4 style={{ color: "rgb(140, 191, 64)", marginTop: "20px" }}>
            Successfully added a new Purchase.
          </h4>
        </div>
      )}
      <div style={{ marginTop: "20px" }}>
        <div className="container-lg">
          {!loading && (
            <form
              onSubmit={addPurchase}
              style={{
                textAlign: "center",
                width: "700px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  textAlign: "center",
                  marginTop: "20px",
                  width: "700px",
                }}
              >
                <h3
                  style={{
                    color: "#7caa56",
                    boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                    textAlign: "center",
                    marginBottom: "20px",
                    backgroundColor: "#313949",
                    borderRadius: "50px",
                    height: "40px",
                  }}
                >
                  {" "}
                  <BiSolidPurchaseTag style={{ marginBottom: "4px" }} /> Add
                  Purchase
                </h3>

                {/* software, license and price fields */}
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
                          style={{ paddingBottom: "5px", fontSize: "22px" }}
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
                      <label
                        htmlFor="licensingOption"
                        style={{ display: "block" }}
                      >
                        {" "}
                        <TbLicense
                          style={{ paddingBottom: "5px", fontSize: "22px" }}
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
                          style={{ paddingBottom: "5px", fontSize: "20px" }}
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
                {/* customerand purchase date fields */}
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
                          style={{ paddingBottom: "5px", fontSize: "22px" }}
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
                      <label
                        htmlFor="purchaseDate"
                        style={{ display: "block" }}
                      >
                        {" "}
                        <FaCalendarAlt
                          style={{ paddingBottom: "5px", fontSize: "22px" }}
                        />{" "}
                        Purchase Date
                      </label>
                      <DatePicker
                        className="purchase-date"
                        renderCustomHeader={({
                          date,
                          changeYear,
                          changeMonth,
                        }) => (
                          <div className="custom-header-container">
                            <select
                              className="year-picker"
                              value={getYear(date)}
                              onChange={(e) =>
                                changeYear(parseInt(e.target.value))
                              }
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
              </div>

              {/* Submit and Cancel buttons field */}
              <div
                className="mt-4 text-center"
                style={{ marginBottom: "10px" }}
              >
                {genericError && (
                  <p style={{ color: "#dc3545" }}>{genericError}</p>
                )}
                <Link
                  to="/Purchases"
                  type="submit"
                  className="btn btn-outline-success"
                  onClick={(e) => addPurchase(e)}
                  style={{ marginBottom: "15px" }}
                >
                  <FaCheck style={{ marginRight: "5px" }} /> Add Purchase
                </Link>

                <Link
                  to="/Purchases"
                  className="btn btn-outline-danger"
                  style={{ marginLeft: "10px", marginBottom: "15px" }}
                >
                  <MdCancel style={{ marginRight: "5px" }} />
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPurchase;
