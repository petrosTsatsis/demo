import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {FaCalendarAlt, FaDatabase} from "react-icons/fa";
import {FaLocationDot} from "react-icons/fa6";
import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import {IoIosTime} from "react-icons/io";
import {MdSubject} from "react-icons/md";
import {Link, useParams} from "react-router-dom";
import ContactService from "../../services/contact-service";

const ContactsAppointmentsHistory = () => {
  const { id } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [currentPageAppointment, setCurrentPageAppointment] = useState(1);
  const [rowsPerPageAppointment, setRowsPerPageAppointment] = useState(5);

  useEffect(() => {
    // fetch the contact's and the user's common appointments
    const fetchAppointments = async () => {
      try {
        const response = await ContactService.getCommonAppointments(id);
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // method that sorts the appointments by the date
  const sortByDate = () => {
    const sortedAppointments = [...appointments].sort((a, b) => {
      const dateA = new Date(a.date.split("-").reverse().join("-"));
      const dateB = new Date(b.date.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setAppointments(sortedAppointments);
  };

  // default sorting
  const sortByAppointmentId = () => {
    const sortedAppointments = [...appointments].sort((a, b) => a.id - b.id);
    setAppointments(sortedAppointments);
  };

  // method that sorts the appointments by their Location
  const sortByLocation = () => {
    const sortedAppointments = [...appointments].sort((a, b) =>
      a.type.localeCompare(b.type)
    );
    setAppointments(sortedAppointments);
  };

  // function to handle the pages
  const handlePageChangeAppointment = (newPage) => {
    setCurrentPageAppointment((prevPage) => {
      const totalPages = Math.ceil(
        appointments.length / rowsPerPageAppointment
      );
      const updatedPage = Math.min(Math.max(newPage, 1), totalPages);
      return updatedPage;
    });
  };

  // function to handle the rows per page
  const handleRowsPerPageChangeAppointment = (event) => {
    setRowsPerPageAppointment(parseInt(event.target.value));
    setCurrentPageAppointment(1);
  };

  const indexOfLastRowAppointment =
    currentPageAppointment * rowsPerPageAppointment;
  const indexOfFirstRowPAppointment =
    indexOfLastRowAppointment - rowsPerPageAppointment;
  const currentRowsAppointment = appointments.slice(
    indexOfFirstRowPAppointment,
    indexOfLastRowAppointment
  );

  return (
    /* appointments table field */
    <div className="container-md">
      <Row className="mt-4">
        <Col style={{ width: "100%", padding: "0" }}>
          <table
            className="components table table-striped table-hover"
            style={{ height: "413px", marginBottom: "50px" }}
          >
            <thead>
              <tr>
                <th
                  style={{ width: "5%" }}
                  scope="row"
                  colSpan="5"
                  className="tasks-in-progress"
                >
                  Appointments History
                </th>
              </tr>
              <tr>
                <th style={{ width: "10%" }} scope="col">
                  ID
                </th>
                <th style={{ width: "20%" }} scope="col">
                  <MdSubject style={{ marginBottom: "3px" }} /> Subject
                </th>
                <th style={{ width: "20%" }} scope="col">
                  <FaCalendarAlt
                    style={{ marginBottom: "3px", color: "gold" }}
                  />{" "}
                  Date
                </th>
                <th style={{ width: "15%" }} scope="col">
                  <IoIosTime style={{ marginBottom: "3px", color: "orange" }} />{" "}
                  Start Time
                </th>
                <th style={{ width: "15%" }} scope="col">
                  <IoIosTime style={{ marginBottom: "3px", color: "orange" }} />{" "}
                  End Time
                </th>
                <th style={{ width: "20%" }} scope="col">
                  <FaLocationDot
                    style={{ marginBottom: "3px", color: "rgb(18, 181, 105)" }}
                  />{" "}
                  Location
                </th>
              </tr>
            </thead>

            <tbody>
              {appointments.length > 0 ? (
                currentRowsAppointment.map((appointment, index) => (
                  <tr key={index}>
                    <td style={{ width: "10%", fontWeight: "bold" }}>
                      <Link to={`/Events/${appointment.id}`}>
                        {appointment.id}
                      </Link>
                    </td>
                    <td style={{ width: "20%" }}>{appointment.title}</td>
                    <td style={{ width: "20%" }}>{appointment.date}</td>
                    <td style={{ width: "15%" }}>{appointment.startTime}</td>
                    <td style={{ width: "15%" }}>{appointment.endTime}</td>
                    <td style={{ width: "20%" }}>{appointment.type}</td>
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
                        No Appointments yet
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
                        disabled={currentPageAppointment === 1}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChangeAppointment(
                            currentPageAppointment - 1
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
                          indexOfLastRowAppointment >= appointments.length
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChangeAppointment(
                            currentPageAppointment + 1
                          );
                        }}
                      >
                        <GrFormNext
                          style={{ fontSize: "30px", color: "white" }}
                        />
                      </button>
                      <span style={{ color: "white" }}>
                        Page {currentPageAppointment}
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
                        value={rowsPerPageAppointment}
                        onChange={handleRowsPerPageChangeAppointment}
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
                            sortByDate();
                          } else if (selectedOption === "location") {
                            sortByLocation();
                          } else if (selectedOption === "default") {
                            sortByAppointmentId();
                          }
                        }}
                      >
                        <option value="default">Select Sort By</option>
                        <option value="location">Sort by Location</option>
                        <option value="date">Sort by Date</option>
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
  );
};

export default ContactsAppointmentsHistory;
