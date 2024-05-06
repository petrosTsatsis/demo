import React, {useEffect, useState} from "react";
import Avatar from "react-avatar";
import {Col, Row} from "react-bootstrap";
import {FaDatabase} from "react-icons/fa";
import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import {MdEuro} from "react-icons/md";
import {Link} from "react-router-dom";
import CustomerService from "../../services/customer-service";
import PurchaseService from "../../services/purchase-service";
import SoftwareLicenseService from "../../services/software-license-service";
import SoftwareService from "../../services/software-service";
import SslCertificateService from "../../services/ssl-certificate-service";
import TaskService from "../../services/task-service";

const HomeTables = () => {
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [expiringLicenses, setExpiringLicenses] = useState([]);
  const [currentPageTask, setCurrentPageTask] = React.useState(1);
  const [rowsPerPageTask, setRowsPerPageTask] = React.useState(5);
  const [currentPageLicense, setCurrentPageLicense] = React.useState(1);
  const [rowsPerPageLicense, setRowsPerPageLicense] = React.useState(5);
  const [expiringCertificates, setExpiringCertificates] = useState([]);
  const [currentPageCertificate, setCurrentPageCertificate] = useState(1);
  const [rowsPerPageCertificate, setRowsPerPageCertificate] = useState(5);
  const [monthlyPurchases, setMonthlyPurchases] = useState([]);
  const [currentPagePurchase, setCurrentPagePurchase] = useState(1);
  const [rowsPerPagePurchase, setRowsPerPagePurchase] = useState(5);

  useEffect(() => {
    loadInProgressTasks();

    loadExpiringLicenses();

    loadExpiringCertificates();

    loadMonthlyPurchases();
  }, []);

  const loadInProgressTasks = async () => {
    try {
      const response = await TaskService.getMyTasks();
      setInProgressTasks(
        response.data.filter((task) => task.status === "In Progress")
      );
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const loadExpiringLicenses = async () => {
    try {
      const response = await SoftwareLicenseService.getLicenses();
      const allLicenses = response.data;

      if (!Array.isArray(allLicenses)) {
        console.error("Invalid data format for licenses:", allLicenses);
        return;
      }

      const currentDate = new Date();
      const expiringLicenses = allLicenses.filter((license) => {
        const expirationDateParts = license.expirationDate.split("-");
        const expirationDate = new Date(
          expirationDateParts[2],
          expirationDateParts[1] - 1,
          expirationDateParts[0]
        );

        if (isNaN(expirationDate.getTime())) {
          console.error("Invalid expiration date format for license:", license);
          return false;
        }

        return (
          expirationDate.getMonth() === currentDate.getMonth() &&
          expirationDate.getFullYear() === currentDate.getFullYear()
        );
      });

      setExpiringLicenses(expiringLicenses);
    } catch (error) {
      console.error("Error loading expiring licenses:", error);
    }
  };

  const loadExpiringCertificates = async () => {
    try {
      const response = await SslCertificateService.getCertificates(); // Replace with your actual API call
      const allCertificates = response.data;

      if (!Array.isArray(allCertificates)) {
        console.error("Invalid data format for certificates:", allCertificates);
        return;
      }

      const currentDate = new Date();
      const expiringCertificates = allCertificates.filter((certificate) => {
        const expirationDateParts = certificate.expirationDate.split("-");
        const expirationDate = new Date(
          expirationDateParts[2],
          expirationDateParts[1] - 1,
          expirationDateParts[0]
        );

        if (isNaN(expirationDate.getTime())) {
          console.error(
            "Invalid expiration date format for certificate:",
            certificate
          );
          return false;
        }

        return (
          expirationDate.getMonth() === currentDate.getMonth() &&
          expirationDate.getFullYear() === currentDate.getFullYear()
        );
      });

      setExpiringCertificates(expiringCertificates);
    } catch (error) {
      console.error("Error loading expiring certificates:", error);
    }
  };

  const loadMonthlyPurchases = async () => {
    try {
      const response = await PurchaseService.getAllPurchases();
      const allPurchases = response.data;

      const currentDate = new Date();
      const currentMonthPurchases = allPurchases.filter((purchase) => {
        if (!purchase.purchaseDate) {
          console.error("Invalid date format for purchase:", purchase);
          return false;
        }

        const purchaseDateParts = purchase.purchaseDate.split("-");

        if (purchaseDateParts.length !== 3) {
          console.error("Invalid date format for purchase:", purchase);
          return false;
        }

        const formattedPurchaseDate = new Date(
          `${purchaseDateParts[2]}-${purchaseDateParts[1]}-${purchaseDateParts[0]}`
        );

        return (
          formattedPurchaseDate.getMonth() === currentDate.getMonth() &&
          formattedPurchaseDate.getFullYear() === currentDate.getFullYear()
        );
      });

      // Fetch additional data for each purchase (customer and software details)
      const enrichedPurchases = await Promise.all(
        currentMonthPurchases.map(async (purchase) => {
          try {
            const customerResponse = await CustomerService.getCustomer(
              purchase.customer.id
            );
            const softwareResponse = await SoftwareService.getSoftware(
              purchase.software.id
            );

            // Combine first and last name of the customer
            const customerName = `${customerResponse.data.fname} ${customerResponse.data.lname}`;

            return {
              ...purchase,
              customerName: customerName,
              softwareName: softwareResponse.data.name,
            };
          } catch (error) {
            console.error(
              "Error fetching additional data for purchase:",
              error
            );
            return null; // You may choose to handle this case differently
          }
        })
      );

      // Filter out null values in case of errors during additional data fetching
      const validEnrichedPurchases = enrichedPurchases.filter(
        (purchase) => purchase !== null
      );

      setMonthlyPurchases(validEnrichedPurchases);
    } catch (error) {
      console.error("Error loading monthly purchases:", error);
    }
  };

  const getPriorityTextColor = (priority) => {
    switch (priority) {
      case "High":
        return "#dc3545";
      case "Medium":
        return "coral";
      case "Low":
        return "#ffc107";
      default:
        return "inherit";
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

  /* Table tools */
  const handlePageChangeTask = (newPage) => {
    setCurrentPageTask((prevPage) => {
      const totalPages = Math.ceil(inProgressTasks.length / rowsPerPageTask);
      const updatedPage = Math.min(Math.max(newPage, 1), totalPages);
      return updatedPage;
    });
  };

  const handleRowsPerPageChangeTask = (event) => {
    setRowsPerPageTask(parseInt(event.target.value));
    setCurrentPageTask(1);
  };

  const indexOfLastRowTask = currentPageTask * rowsPerPageTask;
  const indexOfFirstRowTask = indexOfLastRowTask - rowsPerPageTask;
  const currentRowsTask = inProgressTasks.slice(
    indexOfFirstRowTask,
    indexOfLastRowTask
  );

  const handlePageChangeLicense = (newPage) => {
    setCurrentPageLicense((prevPage) => {
      const totalPages = Math.ceil(
        expiringLicenses.length / rowsPerPageLicense
      );
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
  const currentRowsLicense = expiringLicenses.slice(
    indexOfFirstRowLicense,
    indexOfLastRowLicense
  );

  const handlePageChangeCertificate = (newPage) => {
    setCurrentPageCertificate((prevPage) => {
      const totalPages = Math.ceil(
        expiringCertificates.length / rowsPerPageCertificate
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
  const currentRowsCertificate = expiringCertificates.slice(
    indexOfFirstRowCertificate,
    indexOfLastRowCertificate
  );

  const handlePageChangePurchase = (newPage) => {
    setCurrentPagePurchase((prevPage) => {
      const totalPages = Math.ceil(
        monthlyPurchases.length / rowsPerPagePurchase
      );
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
  const currentRowsPurchase = monthlyPurchases.slice(
    indexOfFirstRowPurchase,
    indexOfLastRowPurchase
  );

  const sortByPriority = () => {
    const sortedTasks = [...inProgressTasks].sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };

      const priorityA = priorityOrder[a.priority] || 0;
      const priorityB = priorityOrder[b.priority] || 0;

      return priorityB - priorityA;
    });

    setInProgressTasks(sortedTasks);
  };

  // default sorting
  const sortByTaskId = () => {
    const sortedTasks = [...inProgressTasks].sort((a, b) => a.id - b.id);
    setInProgressTasks(sortedTasks);
  };

  const sortByActivationDate = () => {
    const sortedLicenses = [...expiringLicenses].sort((a, b) => {
      const dateA = new Date(a.activationDate.split("-").reverse().join("-"));
      const dateB = new Date(b.activationDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setExpiringLicenses(sortedLicenses);
  };

  const sortLicensesByExpirationDate = () => {
    const sortedLicenses = [...expiringLicenses].sort((a, b) => {
      const dateA = new Date(a.expirationDate.split("-").reverse().join("-"));
      const dateB = new Date(b.expirationDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setExpiringLicenses(sortedLicenses);
  };

  // default sorting
  const sortByLicenseId = () => {
    const sortedLicenses = [...expiringLicenses].sort((a, b) => a.id - b.id);
    setExpiringLicenses(sortedLicenses);
  };

  const sortByDueDate = () => {
    const sortedTasks = [...inProgressTasks].sort((a, b) => {
      const dateA = new Date(a.dueDate.split("-").reverse().join("-"));
      const dateB = new Date(b.dueDate.split("-").reverse().join("-"));

      return dateA - dateB;
    });

    setInProgressTasks(sortedTasks);
  };

  const sortByType = () => {
    const sortedCertificates = [...expiringCertificates].sort((a, b) =>
      a.type.localeCompare(b.type)
    );
    setExpiringCertificates(sortedCertificates);
  };

  const sortCertificatesByExpirationDate = () => {
    const sortedCertificates = [...expiringCertificates].sort((a, b) => {
      const dateA = new Date(a.expirationDate.split("-").reverse().join("-"));
      const dateB = new Date(b.expirationDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setExpiringCertificates(sortedCertificates);
  };

  // default sorting
  const sortByCertificateId = () => {
    const sortedCertificates = [...expiringCertificates].sort(
      (a, b) => a.id - b.id
    );
    setExpiringCertificates(sortedCertificates);
  };

  // sort purchases by higher price
  const sortByHigherPrice = () => {
    const sortedPurchases = [...monthlyPurchases].sort((b, a) => {
      return a.price - b.price;
    });

    setMonthlyPurchases(sortedPurchases);
  };

  // sort purchases by lower price
  const sortByLowerPrice = () => {
    const sortedPurchases = [...monthlyPurchases].sort((a, b) => {
      return a.price - b.price;
    });

    setMonthlyPurchases(sortedPurchases);
  };

  // method that sorts the purchase by the purchase date
  const sortByPurchaseDate = () => {
    const sortedPurchases = [...monthlyPurchases].sort((a, b) => {
      const dateA = new Date(a.purchaseDate.split("-").reverse().join("-"));
      const dateB = new Date(b.purchaseDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setMonthlyPurchases(sortedPurchases);
  };

  // default sorting
  const sortByPurchaseId = () => {
    const sortedPurchases = [...monthlyPurchases].sort((a, b) => a.id - b.id);
    setMonthlyPurchases(sortedPurchases);
  };

  return (
    <div>
      {/* Tables Section */}

      <Row className="mt-4">
        <Col>
          <div className="table-container">
            <table className="home table table-hover">
              <thead>
                <tr>
                  <th
                    style={{ width: "5%" }}
                    scope="row"
                    colSpan="5"
                    className="tasks-in-progress"
                  >
                    Tasks in Progress
                  </th>
                </tr>
                <tr>
                  <th style={{ width: "10%" }} scope="col">
                    ID
                  </th>
                  <th style={{ width: "25%" }} scope="col">
                    Subject
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Status
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Priority
                  </th>
                  <th style={{ width: "25%" }} scope="col">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {inProgressTasks.length > 0 ? (
                  currentRowsTask.map((task) => (
                    <tr key={task.id}>
                      <td style={{ width: "10%", fontWeight: "bold" }}>
                        <Link to={`/Tasks/${task.id}`}>{task.id}</Link>
                      </td>
                      <td style={{ width: "25%" }}>{task.subject}</td>
                      <td
                        style={{
                          width: "20%",
                          color: getStatusColor(task.status),
                          fontWeight: "bold",
                        }}
                      >
                        {task.status}
                      </td>
                      <td
                        style={{
                          width: "20%",
                          color: getPriorityTextColor(task.priority),
                          fontWeight: "bold",
                        }}
                      >
                        {task.priority}
                      </td>
                      <td style={{ width: "25%" }}>{task.dueDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      <div style={{ marginTop: "50px" }}>
                        <FaDatabase
                          style={{ fontSize: "50px", color: "#313949" }}
                        />
                        <p style={{ color: "#313949", marginTop: "10px" }}>
                          No Tasks in progress yet
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
                          disabled={currentPageTask === 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeTask(currentPageTask - 1);
                          }}
                        >
                          <GrFormPrevious
                            style={{ fontSize: "30px", color: "black" }}
                          />
                        </button>
                        <button
                          className="carousel-button"
                          disabled={
                            indexOfLastRowTask >= inProgressTasks.length
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeTask(currentPageTask + 1);
                          }}
                        >
                          <GrFormNext
                            style={{ fontSize: "30px", color: "black" }}
                          />
                        </button>
                        <span style={{ marginLeft: "10px", color: "black" }}>
                          Page {currentPageTask}
                        </span>
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ marginLeft: "10px", color: "black" }}>
                          Rows per page:
                        </span>
                        <select
                          className="form-select custom-select"
                          style={{
                            width: "70px",
                            marginLeft: "10px",
                          }}
                          aria-label="Default select example"
                          value={rowsPerPageTask}
                          onChange={handleRowsPerPageChangeTask}
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
                              sortByTaskId();
                            } else if (selectedOption === "due date") {
                              sortByDueDate();
                            } else if (selectedOption === "priority") {
                              sortByPriority();
                            }
                          }}
                        >
                          <option value="id">Select Sort By</option>
                          <option value="due date">Sort by Due Date</option>
                          <option value="priority">Sort by Priority</option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Col>
        <Col>
          <div className="table-container">
            <table className="home table table-hover">
              <thead>
                <tr>
                  <th
                    style={{ width: "5%" }}
                    scope="row"
                    colSpan="5"
                    className="tasks-in-progress"
                  >
                    Software Licenses Expiring This Month
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
                {expiringLicenses.length > 0 ? (
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
                          style={{ fontSize: "50px", color: "#313949" }}
                        />
                        <p style={{ color: "#313949", marginTop: "10px" }}>
                          No Licenses expiring this month yet
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
                            style={{ fontSize: "30px", color: "black" }}
                          />
                        </button>
                        <button
                          className="carousel-button"
                          disabled={
                            indexOfLastRowLicense >= expiringLicenses.length
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeLicense(currentPageLicense + 1);
                          }}
                        >
                          <GrFormNext
                            style={{ fontSize: "30px", color: "black" }}
                          />
                        </button>
                        <span style={{ color: "black" }}>
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
                        <span style={{ marginLeft: "10px", color: "black" }}>
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
                            if (selectedOption === "id") {
                              sortByLicenseId();
                            } else if (selectedOption === "expiration") {
                              sortLicensesByExpirationDate();
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
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <div className="table-container">
            <table className="home table table-hover">
              <thead>
                <tr>
                  <th
                    style={{ width: "5%" }}
                    scope="row"
                    colSpan="5"
                    className="tasks-in-progress"
                  >
                    SSL Certificates Expiring This Month
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
                {expiringCertificates.length > 0 ? (
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
                          style={{ fontSize: "50px", color: "#313949" }}
                        />
                        <p style={{ color: "#313949", marginTop: "10px" }}>
                          No certificates expiring this month yet
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
                            style={{ fontSize: "30px", color: "black" }}
                          />
                        </button>
                        <button
                          className="carousel-button"
                          disabled={
                            indexOfLastRowCertificate >=
                            expiringCertificates.length
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeCertificate(
                              currentPageCertificate + 1
                            );
                          }}
                        >
                          <GrFormNext
                            style={{ fontSize: "30px", color: "black" }}
                          />
                        </button>
                        <span style={{ color: "black" }}>
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
                        <span style={{ marginLeft: "10px", color: "black" }}>
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
                            if (selectedOption === "id") {
                              sortByCertificateId();
                            } else if (selectedOption === "expiration") {
                              sortCertificatesByExpirationDate();
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
        </Col>

        {/* Fourth Table */}
        <Col>
          <div className="table-container">
            <table className="home table table-hover">
              <thead>
                <tr>
                  <th
                    style={{ width: "5%" }}
                    scope="row"
                    colSpan="5"
                    className="tasks-in-progress"
                  >
                    Monthly Purchases
                  </th>
                </tr>
                <tr>
                  <th style={{ width: "7%" }} scope="col">
                    ID
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Software
                  </th>
                  <th style={{ width: "28%" }} scope="col">
                    Customer
                  </th>
                  <th style={{ width: "15%" }} scope="col">
                    Price
                  </th>
                  <th style={{ width: "20%" }} scope="col">
                    Purchase Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyPurchases.length > 0 ? (
                  currentRowsPurchase.map((purchase, index) => (
                    <tr key={index}>
                      <td style={{ width: "7%", fontWeight: "bold" }}>
                        <Link to={`/Purchases/${purchase.id}`}>
                          {purchase.id}
                        </Link>
                      </td>

                      <td style={{ width: "20%" }}>
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
                      <td style={{ width: "28%" }}>
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
                            />
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
                            />
                            {purchase.customer.fname} {purchase.customer.lname}
                          </Link>
                        )}
                      </td>
                      <td
                        style={{
                          width: "15%",
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
                          style={{ fontSize: "50px", color: "#313949" }}
                        />
                        <p style={{ color: "#313949", marginTop: "10px" }}>
                          No Sales this Month yet
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
                            style={{ fontSize: "30px", color: "black" }}
                          />
                        </button>
                        <button
                          className="carousel-button"
                          disabled={
                            indexOfLastRowPurchase >= monthlyPurchases.length
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangePurchase(currentPagePurchase + 1);
                          }}
                        >
                          <GrFormNext
                            style={{ fontSize: "30px", color: "black" }}
                          />
                        </button>
                        <span style={{ color: "black" }}>
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
                        <span style={{ marginLeft: "10px", color: "black" }}>
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
        </Col>
      </Row>
    </div>
  );
};

export default HomeTables;
