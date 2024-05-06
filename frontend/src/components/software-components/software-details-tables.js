import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import SoftwareService from "../../services/software-service";
import {FaDatabase} from "react-icons/fa";
import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import {MdEuro} from "react-icons/md";

const SoftwareDetailsTables = () => {
  const { id } = useParams();
  const [theSoftware, setTheSoftware] = useState({});
  const [purchases, setPurchases] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [currentPageLicense, setCurrentPageLicense] = React.useState(1);
  const [rowsPerPageLicense, setRowsPerPageLicense] = React.useState(5);
  const [currentPagePurchase, setCurrentPagePurchase] = useState(1);
  const [rowsPerPagePurchase, setRowsPerPagePurchase] = useState(5);

  useEffect(() => {
    // Fetch purchases
    SoftwareService.getPurchases(id)
      .then((response) => {
        setPurchases(response.data);
      })
      .catch((error) => {
        console.error("Error fetching purchases:", error);
      });

    // Fetch software licenses
    SoftwareService.getLicenses(id)
      .then((response) => {
        setLicenses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching software licenses:", error);
      });

    // Fetch the displayed software
    SoftwareService.getSoftware(id)
      .then((response) => {
        setTheSoftware(response.data);
      })
      .catch((error) => {
        console.error("Error fetching software:", error);
      });
  }, [id]);

  // default sorting for purchases
  const sortByPurchaseId = () => {
    const sortedPurchases = [...purchases].sort((a, b) => a.id - b.id);
    setPurchases(sortedPurchases);
  };

  // sort purchases by purchase date
  const sortByPurchaseDate = () => {
    const sortedPurchases = [...purchases].sort((a, b) => {
      const dateA = new Date(a.purchaseDate.split("-").reverse().join("-"));
      const dateB = new Date(b.purchaseDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setPurchases(sortedPurchases);
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

  // default sorting for licenses
  const sortByLicensesId = () => {
    const sortedLicenses = [...licenses].sort((a, b) => a.id - b.id);
    setLicenses(sortedLicenses);
  };

  // sort licenses by activation date
  const sortByActivationDate = () => {
    const sortedLicenses = [...licenses].sort((a, b) => {
      const dateA = new Date(a.activationDate.split("-").reverse().join("-"));
      const dateB = new Date(b.activationDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setLicenses(sortedLicenses);
  };

  // sort licenses by expiration date
  const sortLicensesByExpirationDate = () => {
    const sortedLicenses = [...licenses].sort((a, b) => {
      const dateA = new Date(a.expirationDate.split("-").reverse().join("-"));
      const dateB = new Date(b.expirationDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setLicenses(sortedLicenses);
  };

  // function to handle the pages
  const handlePageChangeLicense = (newPage) => {
    setCurrentPageLicense((prevPage) => {
      const totalPages = Math.ceil(licenses.length / rowsPerPageLicense);
      const updatedPage = Math.min(Math.max(newPage, 1), totalPages);
      return updatedPage;
    });
  };

  // function to handle the rows per page
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

  // function to handle the pages
  const handlePageChangePurchase = (newPage) => {
    setCurrentPagePurchase((prevPage) => {
      const totalPages = Math.ceil(purchases.length / rowsPerPagePurchase);
      const updatedPage = Math.min(Math.max(newPage, 1), totalPages);
      return updatedPage;
    });
  };

  // function to handle the rows per page
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

  // set the status color based on the value
  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "#12b569";
      case "Active":
        return "#12b569";
      case "Expired":
        return "#dc3545";
      case "Canceled":
        return "#dc3545";
      default:
        return "inherit";
    }
  };
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ width: "100%" }}
    >
      <div className="container-md">
        <Row className="mt-4">
          {/* Purchase History Table  */}
          <Col
            style={{ width: "100%", paddingRight: "12px", paddingLeft: "0" }}
          >
            <table
              className="components table table-striped table-hover"
              style={{ height: "412px" }}
            >
              <thead>
                <tr>
                  <th
                    style={{ width: "5%" }}
                    scope="row"
                    colSpan="5"
                    className="tasks-in-progress"
                  >
                    Purchase History
                  </th>
                </tr>
                <tr>
                  <th style={{ width: "15%" }} scope="col">
                    ID
                  </th>
                  <th style={{ width: "30%" }} scope="col">
                    Software
                  </th>
                  <th style={{ width: "25%" }} scope="col">
                    Price
                  </th>
                  <th style={{ width: "30%" }} scope="col">
                    Purchase Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchases.length > 0 ? (
                  currentRowsPurchase.map((purchase, index) => (
                    <tr key={index}>
                      <td style={{ width: "15%", fontWeight: "bold" }}>
                        <Link to={`/Purchases/${purchase.id}`}>
                          {purchase.id}
                        </Link>
                      </td>

                      <td style={{ width: "30%" }}>
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
                      <td style={{ width: "25%", color: "#12b569" }}>
                        {purchase.price}{" "}
                        <MdEuro
                          style={{ marginBottom: "3px", color: "#12b569" }}
                        />
                      </td>
                      <td style={{ width: "30%" }}>{purchase.purchaseDate}</td>
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
                  <td colSpan="4" style={{ paddingRight: "30px" }}>
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
                          paddingLeft: "25px",
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
                        <span style={{ color: "white" }}>
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
                            marginRight: "10px",
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
                            if (selectedOption === "date") {
                              sortByPurchaseDate();
                            } else if (selectedOption === "lower") {
                              sortByLowerPrice();
                            } else if (selectedOption === "higher") {
                              sortByHigherPrice();
                            } else if (selectedOption === "default") {
                              sortByPurchaseId();
                            }
                          }}
                        >
                          <option value="default">Select Sort By</option>
                          <option value="date">Sort by Date</option>
                          <option value="lower">Sort by Lower Price</option>
                          <option value="higher">Sort by Higher Price</option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </Col>

          {/* Software Licenses Table  */}
          <Col
            style={{ width: "100%", paddingLeft: "12px", paddingRight: "0" }}
          >
            <table
              className="components table table-striped table-hover"
              style={{ height: "412px" }}
            >
              <thead>
                <tr>
                  <th
                    style={{ width: "5%" }}
                    scope="row"
                    colSpan="5"
                    className="tasks-in-progress"
                  >
                    Software Licenses
                  </th>
                </tr>
                <tr>
                  <th style={{ width: "10%" }} scope="col">
                    ID
                  </th>
                  <th style={{ width: "30%" }} scope="col">
                    Name
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Status
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Activation
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Expiration
                  </th>
                </tr>
              </thead>
              <tbody>
                {licenses.length > 0 ? (
                  currentRowsLicense.map((license, index) => (
                    <tr key={index}>
                      <td style={{ width: "10%", fontWeight: "bold" }}>
                        <Link to={`/SoftwareLicenses/${license.id}`}>
                          {license.id}
                        </Link>
                      </td>
                      <td style={{ width: "30%" }}>{license.name}</td>
                      <td
                        style={{
                          width: "20%",
                          color: getStatusColor(license.status),
                          fontWeight: "bold",
                        }}
                      >
                        {license.status}
                      </td>
                      <td style={{ width: "20%" }}>{license.activationDate}</td>
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
                          No Licenses yet
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="table-task-management">
                  <td colSpan="4" style={{ paddingRight: "30px" }}>
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
                          paddingLeft: "25px",
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
                        <span style={{ color: "white" }}>
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
                            marginRight: "10px",
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
                            if (selectedOption === "activation") {
                              sortByActivationDate();
                            } else if (selectedOption === "expiration") {
                              sortLicensesByExpirationDate();
                            } else if (selectedOption === "default") {
                              sortByLicensesId();
                            }
                          }}
                        >
                          <option value="default">Select Sort by</option>
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
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SoftwareDetailsTables;
