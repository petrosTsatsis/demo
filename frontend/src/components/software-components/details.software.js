import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { Card, CardBody, Col, ListGroup, Row } from "react-bootstrap";
import { FaCalendarAlt, FaCheck, FaDatabase } from "react-icons/fa";
import { GiFlatPlatform } from "react-icons/gi";
import { GoVersions } from "react-icons/go";
import { GrCloudSoftware, GrFormNext, GrFormPrevious } from "react-icons/gr";
import { ImBin } from "react-icons/im";
import {
  MdCancel,
  MdDeveloperBoard,
  MdDriveFileRenameOutline,
  MdEuro,
  MdModeEdit,
} from "react-icons/md";
import { TbCategory, TbLicense } from "react-icons/tb";
import Modal from "react-modal";
import { Link, useParams } from "react-router-dom";
import SoftwareService from "../../services/software-service";
import EditSoftwareModal from "./edit-software-modal";
import SoftwareDetailsTables from "./software-details-tables";

const DetailsSoftware = () => {
  const [software, setSoftware] = useState([]);
  const { id } = useParams();
  const [description, setDescription] = useState("");
  const [systemRequirements, setSystemRequirements] = useState("");
  const [version, setVersion] = useState("");
  const [name, setName] = useState("");
  const [developer, setDeveloper] = useState("");
  const [price, setPrice] = useState("");
  const [supportedPlatforms, setSupportedPlatforms] = useState([]);
  const [licensingOptions, setLicensingOptions] = useState([]);
  const [category, setCategory] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [theSoftware, setTheSoftware] = useState(null);
  const [softwareToDelete, setSoftwareToDelete] = useState(null);
  const [currentPageCustomer, setCurrentPageCustomer] = React.useState(1);
  const [rowsPerPageCustomer, setRowsPerPageCustomer] = React.useState(5);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchSoftware();
    fetchTheSoftware();
    fetchCustomers();
  }, [id]);

  // fetch all the software
  const fetchSoftware = async () => {
    try {
      const response = await SoftwareService.getAllSoftware();
      setSoftware(response.data);
    } catch (error) {
      console.error("Error fetching software:", error);
    }
  };

  // fetch the software to display
  const fetchTheSoftware = async () => {
    try {
      const response = await SoftwareService.getSoftware(id);
      const softwareData = response.data;

      setTheSoftware(softwareData);
      setName(softwareData.name);
      setDescription(softwareData.description);
      setVersion(softwareData.version);
      setPrice(softwareData.price);
      setCategory(softwareData.category);
      setSystemRequirements(softwareData.systemRequirements);
      setSupportedPlatforms(softwareData.supportedPlatforms);
      setReleaseDate(softwareData.releaseDate);
      setLicensingOptions(softwareData.licensingOptions);
      setDeveloper(softwareData.developer);
      setRegistrationDate(softwareData.registrationDate);
    } catch (error) {
      console.error("Error fetching the software:", error);
    }
  };

  // fetch all the customers
  const fetchCustomers = async () => {
    try {
      const response = await SoftwareService.getCustomers(id);
      const filteredCustomers = response.data;

      // use a Set to keep the customer ids so that we do not have duplicate displays
      const uniqueCustomerIds = new Set();
      const uniqueCustomers = filteredCustomers.filter((customer) => {
        if (!uniqueCustomerIds.has(customer.id)) {
          uniqueCustomerIds.add(customer.id);
          return true;
        }
        return false;
      });

      setCustomers(uniqueCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  // function to open the edit modal
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // function to close the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    fetchTheSoftware();
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // method that is updating the software array with the new edit array after a software's edit
  const handleSoftwareUpdate = (updatedSoftware) => {
    // Update the software state with the edited data
    setTheSoftware(updatedSoftware);

    // Find the index of the updated software in the software array
    const updatedIndex = software.findIndex(
      (theSoftware) => theSoftware.id === updatedSoftware.id
    );

    if (updatedIndex !== -1) {
      const updatedSoftwareList = [...software];
      updatedSoftwareList[updatedIndex] = updatedSoftware;

      // Update the software's state with the updated array
      setSoftware(updatedSoftwareList);
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
        window.location.href = "/Software";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // method that sorts the customers by their first name
  const sortByFirstName = () => {
    const sortedCustomers = [...customers].sort((a, b) =>
      a.fname.localeCompare(b.fname)
    );
    setCustomers(sortedCustomers);
  };

  // method that sorts the customers by their first name
  const sortByLastName = () => {
    const sortedCustomers = [...customers].sort((a, b) =>
      a.lname.localeCompare(b.lname)
    );
    setCustomers(sortedCustomers);
  };

  // method that sorts the customers by the registration date
  const sortByRegistrationDate = () => {
    const sortedCustomers = [...customers].sort((a, b) => {
      const dateA = new Date(a.registrationDate.split("-").reverse().join("-"));
      const dateB = new Date(b.registrationDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setCustomers(sortedCustomers);
  };

  // method that sorts the customers by the birth date
  const sortByBirthDate = () => {
    const sortedCustomers = [...customers].sort((a, b) => {
      const dateA = new Date(a.birthDate.split("-").reverse().join("-"));
      const dateB = new Date(b.birthDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setCustomers(sortedCustomers);
  };

  // default sorting
  const sortByCustomerId = () => {
    const sortedCustomers = [...customers].sort((a, b) => a.id - b.id);
    setCustomers(sortedCustomers);
  };

  // function to handle the pages
  const handlePageChangeCustomer = (newPage) => {
    setCurrentPageCustomer((prevPage) => {
      const totalPages = Math.ceil(customers.length / rowsPerPageCustomer);
      const updatedPage = Math.min(Math.max(newPage, 1), totalPages);
      return updatedPage;
    });
  };

  // function to handle the rows per page
  const handleRowsPerPageChangeCustomer = (event) => {
    setRowsPerPageCustomer(parseInt(event.target.value));
    setCurrentPageCustomer(1);
  };

  const indexOfLastRowCustomer = currentPageCustomer * rowsPerPageCustomer;
  const indexOfFirstRowCustomer = indexOfLastRowCustomer - rowsPerPageCustomer;
  const currentRowsCustomer = customers.slice(
    indexOfFirstRowCustomer,
    indexOfLastRowCustomer
  );

  return (
    <div className="container-fluid">
      <h3
        className="container-lg"
        style={{
          marginTop: "50px",
          boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
          color: "black",
          textAlign: "center",
          backgroundColor: "#313949",
          color: "white",
          borderRadius: "50px",
          height: "40px",
        }}
      >
        <GrCloudSoftware style={{ marginRight: "10px", marginBottom: "3px" }} />
        Software Details
      </h3>
      <div
        className="container-md"
        style={{
          boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
          backgroundColor: "#313949",
          marginTop: "30px",
          borderRadius: "10px",
          textAlign: "center",
          paddingTop: "1px",
          position: "relative",
        }}
      >
        {/* Edit and Delete Buttons */}
        <div style={{ position: "absolute", top: "150px", marginLeft: "13px" }}>
          <button
            type="button"
            className="btn btn-outline-success"
            style={{ marginBottom: "10px", marginRight: "10px" }}
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
            theSoftware={theSoftware}
            onSoftwareUpdate={handleSoftwareUpdate}
          />
          <button
            type="button"
            className="btn btn-outline-danger"
            style={{ marginBottom: "10px" }}
            onClick={() => deleteSoftware(id)}
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

        {/* Software Name, Category and Version fields */}
        <Row
          className="mt-4"
          style={{
            marginBottom: "30px",

            marginTop: "20px",
          }}
        >
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <MdDriveFileRenameOutline
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Name:
              </strong>{" "}
              {name}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <GoVersions
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Version:
              </strong>{" "}
              {version}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <TbCategory
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Category:
              </strong>{" "}
              {category}
            </p>{" "}
          </Col>
        </Row>
        {/* Licensing Options and Supported Platforms fields */}
        <Row
          className="mt-4 justify-content-center"
          style={{
            marginTop: "20px",
            marginBottom: "50px",
          }}
        >
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <div
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <TbLicense style={{ paddingBottom: "5px", fontSize: "20px" }} />{" "}
                Licensing Options:
              </strong>{" "}
              <ListGroup>
                {licensingOptions.map((option, index) => (
                  <ListGroup.Item
                    key={index}
                    style={{ backgroundColor: "transparent" }}
                  >
                    {option}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>

          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <div
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <GiFlatPlatform
                  style={{ paddingBottom: "5px", fontSize: "20px" }}
                />{" "}
                Supported Platforms:
              </strong>{" "}
              <ListGroup>
                {supportedPlatforms.map((option, index) => (
                  <ListGroup.Item
                    key={index}
                    style={{ backgroundColor: "transparent" }}
                  >
                    {option}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
        </Row>

        {/* Price, Developer, registration date and release date fields */}
        <Row
          className="mt-4"
          style={{
            marginBottom: "30px",
            marginTop: "20px",
          }}
        >
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>Price:</strong> {price}
              <MdEuro style={{ marginBottom: "3px" }} />{" "}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <MdDeveloperBoard
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Developer:
              </strong>{" "}
              {developer}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <FaCalendarAlt
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Registration Date:
              </strong>{" "}
              {registrationDate}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ width: "300px", padding: "10px" }}
            >
              <strong>
                <FaCalendarAlt
                  style={{ paddingBottom: "3px", fontSize: "20px" }}
                />{" "}
                Release Date:
              </strong>{" "}
              {releaseDate}
            </p>{" "}
          </Col>
        </Row>
      </div>

      <div className="container-md">
        <Row className="mt-4">
          <Col
            style={{ width: "100%", paddingRight: "12px", paddingLeft: "0" }}
          >
            <Row style={{ marginRight: "1px", marginLeft: "1px" }}>
              {/* System Requirements field */}
              <Card
                className="customer-card w-20"
                style={{
                  height: "200px",
                  border: "2px solid #313949",
                  boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                  width: "648px",
                }}
              >
                <CardBody>
                  <h4>System Requirements</h4>
                  {systemRequirements}
                </CardBody>
              </Card>

              {/* Description field */}
              <Card
                className="customer-card w-20"
                style={{
                  height: "200px",
                  border: "2px solid #313949",
                  boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                  width: "648px",
                  marginTop: "10px",
                }}
              >
                <CardBody>
                  <h4>Description</h4>
                  {description}
                </CardBody>
              </Card>
            </Row>
          </Col>

          {/* Purchase Table */}
          <Col
            style={{ width: "100%", paddingLeft: "12px", paddingRight: "0" }}
          >
            <table
              className="components table table-striped table-hover"
              style={{ height: "412px" }}
            >
              <tr>
                <th
                  style={{ width: "5%" }}
                  scope="row"
                  colSpan="5"
                  className="tasks-in-progress"
                >
                  Customers History
                </th>
              </tr>
              <thead>
                <tr>
                  <th style={{ width: "10%" }} scope="col">
                    Select
                  </th>
                  <th style={{ width: "35%" }} scope="col">
                    Name
                  </th>
                  <th style={{ width: "15%" }} scope="col">
                    Phone Number
                  </th>
                  <th style={{ width: "40%" }} scope="col">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  currentRowsCustomer.map((customer, index) => (
                    <tr key={index}>
                      <td style={{ width: "10%", fontWeight: "bold" }}>
                        <Link to={`/Customers/${customer.id}`}>
                          {customer.id}
                        </Link>
                      </td>
                      <td style={{ width: "35%" }}>
                        {customer.name ? (
                          <Link
                            to={`/Companies/${customer.id}`}
                            style={{
                              color: "inherit",
                              textDecoration: "none",
                              transition: "color 0.3s",
                            }}
                            className="hover-red"
                          >
                            <Avatar
                              name={`${customer.name}`}
                              size="25"
                              round={true}
                              className="avatar"
                              style={{ marginRight: "5px" }}
                            />
                            {customer.name}
                          </Link>
                        ) : (
                          <Link
                            to={`/Customers/${customer.id}`}
                            style={{
                              color: "inherit",
                              textDecoration: "none",
                              transition: "color 0.3s",
                            }}
                            className="hover-red"
                          >
                            <Avatar
                              name={`${customer.fname} ${customer.lname}`}
                              size="25"
                              round={true}
                              className="avatar"
                              style={{ marginRight: "5px" }}
                            />
                            {customer.fname} {customer.lname}
                          </Link>
                        )}
                      </td>
                      <td style={{ width: "15%" }}>{customer.phoneNumber}</td>
                      <td
                        style={{
                          width: "40%",
                          fontWeight: "bold",
                        }}
                      >
                        {customer.email}
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
                          No Customers yet
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
                          disabled={currentPageCustomer === 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeCustomer(currentPageCustomer - 1);
                          }}
                        >
                          <GrFormPrevious
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <button
                          className="carousel-button"
                          disabled={indexOfLastRowCustomer >= customers.length}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeCustomer(currentPageCustomer + 1);
                          }}
                        >
                          <GrFormNext
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <span style={{ marginLeft: "10px", color: "white" }}>
                          Page {currentPageCustomer}
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
                          value={rowsPerPageCustomer}
                          onChange={handleRowsPerPageChangeCustomer}
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
                              sortByCustomerId();
                            } else if (selectedOption === "fname") {
                              sortByFirstName();
                            } else if (selectedOption === "lname") {
                              sortByLastName();
                            } else if (selectedOption === "registration date") {
                              sortByRegistrationDate();
                            } else if (selectedOption === "birth date") {
                              sortByBirthDate();
                            }
                          }}
                        >
                          <option value="id">Select Sort By</option>
                          <option value="fname">Sort by First Name</option>
                          <option value="lname">Sort by Last Name</option>
                          <option value="registration date">
                            Sort by Registration Date
                          </option>
                          <option value="birth date">Sort by Birth Date</option>
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

      {/* Render the software tables */}
      <SoftwareDetailsTables />

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

export default DetailsSoftware;
