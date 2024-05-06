import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Card, CardBody, Col, Row} from "react-bootstrap";
import CustomerService from "../../services/customer-service";
import {FaCalendarAlt, FaDatabase} from "react-icons/fa";
import {GrCloudSoftware, GrFormNext, GrFormPrevious, GrStatusUnknown,} from "react-icons/gr";
import {MdDriveFileRenameOutline, MdEuro} from "react-icons/md";
import {BiSolidPurchaseTag} from "react-icons/bi";
import {CgDanger} from "react-icons/cg";

const CustomerDetailsTables = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState({});
  const [purchases, setPurchases] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [currentPageLicense, setCurrentPageLicense] = React.useState(1);
  const [rowsPerPageLicense, setRowsPerPageLicense] = React.useState(5);
  const [currentPageCertificate, setCurrentPageCertificate] = useState(1);
  const [rowsPerPageCertificate, setRowsPerPageCertificate] = useState(5);
  const [currentPagePurchase, setCurrentPagePurchase] = useState(1);
  const [rowsPerPagePurchase, setRowsPerPagePurchase] = useState(5);
  const [biggestPurchase, setBiggestPurchase] = useState(null);
  const [biggestCertificate, setBiggestCertificate] = useState(null);
  const [biggestLicense, setBiggestLicense] = useState(null);

  // call these methods to find the customer's biggest purchase, latest certificate and latest license
  useEffect(() => {
    const biggestPurchase = findBiggestPurchase();
    setBiggestPurchase(biggestPurchase);

    const biggestCertificate = findBiggestCertificate();
    setBiggestCertificate(biggestCertificate);

    const biggestLicense = findBiggestLicense();
    setBiggestLicense(biggestLicense);
  }, [purchases, certificates, licenses]);

  useEffect(() => {
    // Fetch purchases
    CustomerService.getPurchases(id)
      .then((response) => {
        setPurchases(response.data);
      })
      .catch((error) => {
        console.error("Error fetching purchases:", error);
      });

    // Fetch SSL certificates
    CustomerService.getCertificates(id)
      .then((response) => {
        setCertificates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching SSL certificates:", error);
      });

    // Fetch software licenses
    CustomerService.getLicenses(id)
      .then((response) => {
        setLicenses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching software licenses:", error);
      });

    // Fetch the displayed customer
    CustomerService.getCustomer(id)
      .then((response) => {
        setCustomer(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customer:", error);
      });
  }, [id]);

  // find customer's biggest purchase by findind the purchase with the biggest id
  const findBiggestPurchase = () => {
    if (purchases.length === 0) return null;

    let biggestPurchase = purchases[0];
    for (let i = 1; i < purchases.length; i++) {
      if (purchases[i].price > biggestPurchase.price) {
        biggestPurchase = purchases[i];
      }
    }
    return biggestPurchase;
  };

  // find customer's latest certificate which is the one with the biggest id
  const findBiggestCertificate = () => {
    if (certificates.length === 0) return null;

    let biggestCertificate = certificates[0];
    for (let i = 1; i < certificates.length; i++) {
      if (certificates[i].id > biggestCertificate.id) {
        biggestCertificate = certificates[i];
      }
    }
    return biggestCertificate;
  };

  // find customer's latest license which is the one with the biggest id
  const findBiggestLicense = () => {
    if (licenses.length === 0) return null;

    let biggestLicense = licenses[0];
    for (let i = 1; i < licenses.length; i++) {
      if (licenses[i].id > biggestLicense.id) {
        biggestLicense = licenses[i];
      }
    }
    return biggestLicense;
  };

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

  // default sorting for certificates
  const sortByCertificateId = () => {
    const sortedCertificates = [...certificates].sort((a, b) => a.id - b.id);
    setCertificates(sortedCertificates);
  };

  // sort certificates by type
  const sortByType = () => {
    const sortedCertificates = [...certificates].sort((a, b) =>
      a.type.localeCompare(b.type)
    );
    setCertificates(sortedCertificates);
  };

  // sort certificates by expiration date
  const sortCertificatesByExpirationDate = () => {
    const sortedCertificates = [...certificates].sort((a, b) => {
      const dateA = new Date(a.expirationDate.split("-").reverse().join("-"));
      const dateB = new Date(b.expirationDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setCertificates(sortedCertificates);
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
  const handlePageChangeCertificate = (newPage) => {
    setCurrentPageCertificate((prevPage) => {
      const totalPages = Math.ceil(
        certificates.length / rowsPerPageCertificate
      );
      const updatedPage = Math.min(Math.max(newPage, 1), totalPages);
      return updatedPage;
    });
  };

  // function to handle the rows per page
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
                    {customer.fname}'s Purchase History
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

          {/* SSL Certificates Table  */}
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
                    {customer.fname}'s SSL Certificates
                  </th>
                </tr>
                <tr>
                  <th style={{ width: "10%" }} scope="col">
                    ID
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Type
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Issuer
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Status
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Expiration
                  </th>
                </tr>
              </thead>
              <tbody>
                {certificates.length > 0 ? (
                  currentRowsCertificate.map((certificate, index) => (
                    <tr key={index}>
                      <td style={{ width: "10%", fontWeight: "bold" }}>
                        <Link to={`/SSLCertificates/${certificate.id}`}>
                          {certificate.id}
                        </Link>
                      </td>
                      <td style={{ width: "20%" }}>{certificate.type}</td>
                      <td style={{ width: "20%" }}>{certificate.issuer}</td>
                      <td
                        style={{
                          width: "20%",
                          color: getStatusColor(certificate.status),
                          fontWeight: "bold",
                        }}
                      >
                        {certificate.status}
                      </td>
                      <td style={{ width: "20%" }}>
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
                          No Certificates yet
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
                        <span style={{ color: "white" }}>
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
                            marginRight: "10px",
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
                            if (selectedOption === "type") {
                              sortByType();
                            } else if (selectedOption === "expiration") {
                              sortCertificatesByExpirationDate();
                            } else if (selectedOption === "default") {
                              sortByCertificateId();
                            }
                          }}
                        >
                          <option value="default">Select Sort by</option>
                          <option value="type">Sort by Type</option>
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

        {/* Software Licenses Table */}
        <Row className="mt-4">
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
                    {customer.fname}'s Software Licenses
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

          {/* Customer's Cards Section */}
          <Col
            style={{ width: "100%", paddingLeft: "12px", paddingRight: "0" }}
          >
            <Row style={{ marginRight: "1px", marginLeft: "1px" }}>
              {/* Biggest Purchase Card */}
              <Card
                className="customer-card w-20"
                style={{
                  marginBottom: "38px",
                  height: "111px",
                  border: "2px solid #313949",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.6)",
                }}
              >
                <CardBody>
                  {biggestPurchase ? (
                    <Link
                      to={`/Purchases/${biggestPurchase.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <h5 style={{ marginBottom: "12px", cursor: "pointer" }}>
                        Biggest Purchase
                      </h5>
                    </Link>
                  ) : (
                    <h5
                      style={{
                        marginBottom: "12px",
                        textAlign: "center",
                        marginTop: "15px",
                        color: "#2a8ffa",
                      }}
                    >
                      {" "}
                      <CgDanger style={{ marginBottom: "3px" }} /> No purchases
                      yet
                    </h5>
                  )}

                  <Row>
                    <Col xs={4}>
                      {biggestPurchase && (
                        <div>
                          <p>
                            <strong>
                              {" "}
                              <GrCloudSoftware
                                style={{
                                  marginBottom: "3px",
                                  color: "#2a8ffa",
                                }}
                              />{" "}
                              Software:
                            </strong>{" "}
                            {biggestPurchase.software.name}
                          </p>
                        </div>
                      )}
                    </Col>
                    <Col xs={3}>
                      {biggestPurchase && (
                        <div>
                          <p>
                            <strong>
                              <BiSolidPurchaseTag
                                style={{ marginBottom: "3px", color: "orange" }}
                              />{" "}
                              Price:
                            </strong>{" "}
                            <span style={{ color: "#12b569" }}>
                              {biggestPurchase.price}
                            </span>{" "}
                            <MdEuro
                              style={{ marginBottom: "3px", color: "#12b569" }}
                            />
                          </p>
                        </div>
                      )}
                    </Col>
                    <Col xs={5}>
                      {biggestPurchase && (
                        <div>
                          <p>
                            <strong>
                              <FaCalendarAlt
                                size={15}
                                style={{
                                  color: "gold",
                                  marginBottom: "4px",
                                }}
                              />{" "}
                              Purchase Date:
                            </strong>{" "}
                            {biggestPurchase.purchaseDate}
                          </p>
                        </div>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Latest SSL Certificate Card */}
              <Card
                className="customer-card w-20"
                style={{
                  marginBottom: "38px",
                  height: "111px",
                  border: "2px solid #313949",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.6)",
                }}
              >
                <CardBody>
                  {biggestCertificate ? (
                    <Link
                      to={`/SSLCertificates/${biggestCertificate.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <h5 style={{ marginBottom: "15px", cursor: "pointer" }}>
                        Latest SSL Certificate
                      </h5>
                    </Link>
                  ) : (
                    <h5
                      style={{
                        marginBottom: "15px",
                        textAlign: "center",
                        marginTop: "15px",
                        color: "#2a8ffa",
                      }}
                    >
                      {" "}
                      <CgDanger style={{ marginBottom: "3px" }} /> No
                      certificates yet
                    </h5>
                  )}
                  <Row>
                    <Col xs={4}>
                      {biggestCertificate && (
                        <div>
                          <p>
                            <strong>
                              {" "}
                              <MdDriveFileRenameOutline
                                style={{
                                  marginBottom: "3px",
                                  color: "#2a8ffa",
                                }}
                              />{" "}
                              Issuer:
                            </strong>{" "}
                            {biggestCertificate.issuer}
                          </p>
                        </div>
                      )}
                    </Col>
                    <Col xs={3}>
                      {biggestCertificate && (
                        <div>
                          <p>
                            <strong>
                              {" "}
                              <GrStatusUnknown
                                style={{ color: "orange", marginBottom: "3px" }}
                              />{" "}
                              Status:
                            </strong>
                            <span
                              style={{
                                color: getStatusColor(
                                  biggestCertificate.status
                                ),
                              }}
                            >
                              {" "}
                              {biggestCertificate.status}
                            </span>
                          </p>
                        </div>
                      )}
                    </Col>
                    <Col xs={5}>
                      {biggestCertificate && (
                        <div>
                          <p>
                            <strong>
                              {" "}
                              <FaCalendarAlt
                                size={15}
                                style={{
                                  color: "gold",
                                  marginBottom: "4px",
                                }}
                              />{" "}
                              Expiration Date:
                            </strong>{" "}
                            {biggestCertificate.expirationDate}
                          </p>
                        </div>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Latest Software License Card */}
              <Card
                className="customer-card w-20"
                style={{
                  height: "111px",
                  border: "2px solid #313949",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.6)",
                }}
              >
                <CardBody>
                  {biggestLicense ? (
                    <Link
                      to={`/SoftwareLicenses/${biggestLicense.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <h5 style={{ marginBottom: "12px", cursor: "pointer" }}>
                        Latest Software License
                      </h5>
                    </Link>
                  ) : (
                    <h5
                      style={{
                        marginBottom: "12px",
                        textAlign: "center",
                        marginTop: "15px",
                        color: "#2a8ffa",
                      }}
                    >
                      {" "}
                      <CgDanger style={{ marginBottom: "3px" }} /> No licenses
                      yet
                    </h5>
                  )}
                  <Row>
                    <Col xs={4}>
                      {biggestLicense && (
                        <div>
                          <p>
                            <strong>
                              {" "}
                              <MdDriveFileRenameOutline
                                style={{
                                  marginBottom: "3px",
                                  color: "#2a8ffa",
                                }}
                              />{" "}
                              Name:
                            </strong>{" "}
                            {biggestLicense.name}
                          </p>
                        </div>
                      )}
                    </Col>
                    <Col xs={3}>
                      {biggestLicense && (
                        <div>
                          <p>
                            <strong>
                              {" "}
                              <GrStatusUnknown
                                style={{ color: "orange", marginBottom: "3px" }}
                              />{" "}
                              Status:
                            </strong>
                            <span
                              style={{
                                color: getStatusColor(biggestLicense.status),
                              }}
                            >
                              {" "}
                              {biggestLicense.status}
                            </span>
                          </p>
                        </div>
                      )}
                    </Col>
                    <Col xs={5}>
                      {biggestLicense && (
                        <div>
                          <p>
                            <strong>
                              {" "}
                              <FaCalendarAlt
                                size={15}
                                style={{
                                  color: "gold",
                                  marginBottom: "4px",
                                }}
                              />{" "}
                              Expiration Date:
                            </strong>{" "}
                            {biggestLicense.expirationDate}
                          </p>
                        </div>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CustomerDetailsTables;
