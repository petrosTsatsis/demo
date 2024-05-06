import React, {useEffect, useState} from "react";
import {Card, Col, Row} from "react-bootstrap";
import {BsThreeDots} from "react-icons/bs";
import {FaDatabase} from "react-icons/fa";
import Modal from "react-modal";
import {Link} from "react-router-dom";
import ContactService from "../../services/contact-service";
import EventService from "../../services/event-service";
import TaskService from "../../services/task-service";

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

const HomeCards = () => {
  const [currentDayEventsCount, setCurrentDayEventsCount] = useState(0);
  const [futureEventsCount, setFutureEventsCount] = useState(0);
  const [expiringTasksCount, setExpiringTasksCount] = useState(0);
  const [highContactsCount, setHighContactsCount] = useState(0);
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);
  const [isExpiringTasksModalOpen, setIsExpiringTasksModalOpen] =
    useState(false);
  const [isFutureAppointmentsModalOpen, setIsFutureAppointmentsModalOpen] =
    useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedExpiringTasks, setSelectedExpiringTasks] = useState([]);
  const [selectedFutureAppointments, setSelectedFutureAppointments] = useState(
    []
  );
  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => {
    loadCurrentDayEventsCount();

    loadFutureEventsCount();

    loadExpiringTasksCount();

    loadHighContactsCount();
  }, []);

  /* Today's Events */

  const loadCurrentDayEventsCount = async () => {
    try {
      const currentDayEvents = await loadCurrentDayEvents();
      const appointments = currentDayEvents.filter(
        (event) => event.software === null
      );
      setCurrentDayEventsCount(appointments.length);
    } catch (error) {
      console.error("Error loading current day events count:", error);
    }
  };

  const loadAllEvents = async () => {
    try {
      const response = await EventService.getAllEvents();
      return response.data;
    } catch (error) {
      console.error("Error fetching all events:", error);
      return [];
    }
  };

  const loadCurrentDayEvents = async () => {
    try {
      const allEvents = await loadAllEvents();
      const currentDate = new Date().toISOString().split("T")[0];

      const currentDayEvents = allEvents.filter((event) => {
        const parts = event.date.split("-");

        if (parts.length !== 3) {
          console.error("Invalid date format for event:", event);
          return false;
        }

        const formattedEventDate = new Date(
          `${parts[2]}-${parts[1]}-${parts[0]}`
        )
          .toISOString()
          .split("T")[0];

        // Check if endTime is defined
        return (
          formattedEventDate === currentDate &&
          typeof event.endTime !== "undefined" &&
          event.software === null
        );
      });

      return currentDayEvents;
    } catch (error) {
      console.error("Error loading current day events:", error);
      return [];
    }
  };

  const handleDetailsClick = async () => {
    try {
      const currentDayAppointments = await loadCurrentDayEvents();
      setSelectedAppointments(currentDayAppointments);
      setIsAppointmentsModalOpen(true);
    } catch (error) {
      console.error("Error loading current day appointments:", error);
    }
  };

  /* Future Events */

  const loadFutureEventsCount = async () => {
    try {
      const futureEvents = await loadFutureEvents();
      const appointments = futureEvents.filter(
        (event) => event.software === null
      );
      setFutureEventsCount(appointments.length);
    } catch (error) {
      console.error("Error loading future events count:", error);
    }
  };

  const loadFutureEvents = async () => {
    try {
      const allEvents = await loadAllEvents();
      const currentDate = new Date().toISOString().split("T")[0];

      const futureEvents = allEvents.filter((event) => {
        const parts = event.date.split("-");

        if (parts.length !== 3) {
          console.error("Invalid date format for event:", event);
          return false;
        }

        const formattedEventDate = new Date(
          `${parts[2]}-${parts[1]}-${parts[0]}`
        )
          .toISOString()
          .split("T")[0];

        return formattedEventDate > currentDate && event.software === null;
      });

      return futureEvents;
    } catch (error) {
      console.error("Error loading future events:", error);
      return [];
    }
  };

  const handleFutureAppointmentsDetailsClick = async () => {
    try {
      const futureAppointments = await loadFutureEvents();
      setSelectedFutureAppointments(futureAppointments);
      setIsFutureAppointmentsModalOpen(true);
    } catch (error) {
      console.error("Error loading future appointments:", error);
    }
  };

  /* Expiring Tasks */

  const loadExpiringTasksCount = async () => {
    try {
      const expiringTasks = await loadExpiringTasks();
      setExpiringTasksCount(expiringTasks.length);
    } catch (error) {
      console.error("Error loading expiring tasks count:", error);
    }
  };

  const loadAllTasks = async () => {
    try {
      const response = await TaskService.getMyTasks();
      return response.data;
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      return [];
    }
  };

  const loadExpiringTasks = async () => {
    try {
      const allTasks = await loadAllTasks();
      const currentDate = new Date().toISOString().split("T")[0];

      const expiringTasks = allTasks.filter((task) => {
        const parts = task.dueDate.split("-");

        if (parts.length !== 3) {
          console.error("Invalid date format for task:", task);
          return false;
        }

        const formattedTaskDate = new Date(
          `${parts[2]}-${parts[1]}-${parts[0]}`
        )
          .toISOString()
          .split("T")[0];

        return (
          formattedTaskDate === currentDate && task.status === "In Progress"
        );
      });

      return expiringTasks;
    } catch (error) {
      console.error("Error loading expiring tasks:", error);
      return [];
    }
  };

  const handleExpiringTasksDetailsClick = async () => {
    try {
      const expiringTasksToday = await loadExpiringTasks();
      setSelectedExpiringTasks(expiringTasksToday);
      setIsExpiringTasksModalOpen(true);
    } catch (error) {
      console.error("Error loading expiring tasks today:", error);
    }
  };

  /* Contact Count */

  const loadHighContactsCount = async () => {
    try {
      const contacts = await loadHighContacts();
      setHighContactsCount(contacts.length);
    } catch (error) {
      console.error("Error loading contacts count:", error);
    }
  };

  const loadHighContacts = async () => {
    try {
      const response = await ContactService.getAllContacts();
      // Filter contacts with priority "High"
      const highPriorityContacts = response.data.filter(
        (contact) => contact.priority === "High"
      );
      return highPriorityContacts;
    } catch (error) {
      console.error("Error fetching the contacts:", error);
      return [];
    }
  };

  const handleHighContactsDetailsClick = async () => {
    try {
      const highContacts = await loadHighContacts();
      setSelectedContacts(highContacts);
      setIsContactsModalOpen(true);
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  };

  return (
    <div>
      <Row className="mt-4">
        <Col>
          <Card className="home w-20">
            <Card.Body>
              <h5 className="card-title">Today's Appointments</h5>
              <h4 className="card-text">{currentDayEventsCount}</h4>
              <a
                onClick={handleDetailsClick}
                className="home-cards btn btn-primary"
              >
                Details
              </a>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="home w-20">
            <Card.Body>
              <h5 className="card-title">Tasks Expiring Today</h5>
              <h4 className="card-text">{expiringTasksCount}</h4>
              <a
                onClick={handleExpiringTasksDetailsClick}
                className="home-cards btn btn-primary"
              >
                Details
              </a>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="home w-20">
            <Card.Body>
              <h5 className="card-title">Future Appointments</h5>
              <h4 className="card-text">{futureEventsCount}</h4>
              <a
                onClick={handleFutureAppointmentsDetailsClick}
                className="home-cards btn btn-primary"
              >
                Details
              </a>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="home w-20">
            <Card.Body>
              <h5 className="card-title">High Priority Contacts</h5>
              <h4 className="card-text">{highContactsCount}</h4>
              <a
                onClick={handleHighContactsDetailsClick}
                className="home-cards btn btn-primary"
              >
                Details
              </a>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Today's appointments modal  */}

      <Modal
        className="modal-style"
        isOpen={isAppointmentsModalOpen}
        onRequestClose={() => setIsAppointmentsModalOpen(false)}
        contentLabel="Details Modal"
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
        <div className="table-container" style={{ backgroundColor: "#313949" }}>
          {selectedAppointments.length > 0 ? (
            <table
              className="home event table table-hover"
              style={{ border: "none" }}
            >
              <thead>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <h3
                    style={{
                      boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                      textAlign: "center",
                      marginBottom: "20px",
                      backgroundColor: "#313949",
                      color: "#daa520",
                      borderRadius: "50px",
                      height: "50px",
                      marginTop: "20px",
                      width: "80%",
                    }}
                  >
                    Today's Appointments
                  </h3>
                </div>
                <tr>
                  <th scope="col" style={{ width: "15%" }}>
                    View
                  </th>
                  <th scope="col" style={{ width: "25%" }}>
                    Title
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                    Type
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                    Starting Time
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                    End Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td
                      style={{
                        width: "15%",
                        paddingTop: "5px",
                        paddingLeft: "12px",
                      }}
                    >
                      <Link
                        className="btn btn-outline-light"
                        style={{
                          border: "2px solid #b84823",
                          borderRadius: "50%",
                          padding: "5px",
                          background: "transparent",
                        }}
                        to={`/Events/${appointment.id}`}
                      >
                        <BsThreeDots style={{ fontSize: "20px" }} />
                      </Link>
                    </td>
                    <td style={{ width: "25%" }}>{appointment.title}</td>
                    <td style={{ width: "20%" }}>{appointment.type}</td>
                    <td style={{ width: "20%" }}>{appointment.startTime}</td>
                    <td style={{ width: "20%" }}>{appointment.endTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                marginTop: "50px",
                textAlign: "center",
                width: "400px",
                backgroundColor: "#313949",
                height: "200px",
              }}
            >
              <h2
                style={{
                  color: "white",
                  marginBottom: "20px",
                  border: "none",
                  padding: "0",
                }}
              >
                Today's Appointments
              </h2>
              <FaDatabase style={{ fontSize: "50px", color: "white" }} />
              <h5 style={{ color: "white", marginTop: "10px" }}>
                No appointments for today
              </h5>
            </div>
          )}
        </div>
      </Modal>

      {/* Tasks expiring today modal */}

      <Modal
        className="modal-style"
        isOpen={isExpiringTasksModalOpen}
        onRequestClose={() => setIsExpiringTasksModalOpen(false)}
        contentLabel="Details Modal"
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
        <div className="table-container" style={{ backgroundColor: "#313949" }}>
          {selectedExpiringTasks.length > 0 ? (
            <table
              className="home event table table-hover"
              style={{
                border: "none",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <thead>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <h3
                    style={{
                      boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                      textAlign: "center",
                      marginBottom: "20px",
                      backgroundColor: "#313949",
                      color: "#daa520",
                      borderRadius: "50px",
                      height: "50px",
                      marginTop: "20px",
                      width: "80%",
                    }}
                  >
                    Uncompleted Tasks Expiring Today
                  </h3>
                </div>
                <tr>
                  <th scope="col" style={{ width: "25%", textAlign: "center" }}>
                    View
                  </th>
                  <th scope="col" style={{ width: "25%", textAlign: "center" }}>
                    Subject
                  </th>
                  <th scope="col" style={{ width: "25%", textAlign: "center" }}>
                    Status
                  </th>
                  <th scope="col" style={{ width: "25%", textAlign: "center" }}>
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedExpiringTasks.map((task) => (
                  <tr key={task.id}>
                    <td
                      style={{
                        width: "25%",
                        paddingTop: "5px",
                        paddingLeft: "12px",
                        textAlign: "center",
                      }}
                    >
                      <Link
                        className="btn btn-outline-light"
                        style={{
                          border: "2px solid #b84823",
                          borderRadius: "50%",
                          padding: "5px",
                          background: "transparent",
                        }}
                        to={`/Tasks/${task.id}`}
                      >
                        <BsThreeDots style={{ fontSize: "20px" }} />
                      </Link>
                    </td>
                    <td style={{ width: "25%", textAlign: "center" }}>
                      {task.subject}
                    </td>
                    <td
                      style={{
                        width: "25%",
                        color: getStatusColor(task.status),
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {task.status}
                    </td>
                    <td
                      style={{
                        width: "25%",
                        color: getPriorityTextColor(task.priority),
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {task.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                marginTop: "50px",
                textAlign: "center",
                width: "400px",
                backgroundColor: "#313949",
                height: "200px",
              }}
            >
              <h2
                style={{
                  color: "white",
                  marginBottom: "20px",
                  border: "none",
                  padding: "0",
                }}
              >
                Expiring Tasks Today
              </h2>
              <FaDatabase style={{ fontSize: "50px", color: "white" }} />
              <h5 style={{ color: "white", marginTop: "10px" }}>
                No expiring tasks for today
              </h5>
            </div>
          )}
        </div>
      </Modal>

      {/* Future Appointments modal  */}

      <Modal
        className="modal-style"
        isOpen={isFutureAppointmentsModalOpen}
        onRequestClose={() => setIsFutureAppointmentsModalOpen(false)}
        contentLabel="Details Modal"
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
        <div className="table-container" style={{ backgroundColor: "#313949" }}>
          {selectedFutureAppointments.length > 0 ? (
            <table
              className="home event table table-hover"
              style={{ border: "none" }}
            >
              <thead>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <h3
                    style={{
                      boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                      textAlign: "center",
                      marginBottom: "20px",
                      backgroundColor: "#313949",
                      color: "#daa520",
                      borderRadius: "50px",
                      height: "50px",
                      marginTop: "20px",
                      width: "80%",
                    }}
                  >
                    Future Appointments
                  </h3>
                </div>
                <tr>
                  <th scope="col" style={{ width: "15%" }}>
                    View
                  </th>
                  <th scope="col" style={{ width: "25%" }}>
                    Title
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                    Type
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                    Starting Time
                  </th>
                  <th scope="col" style={{ width: "20%" }}>
                    End Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedFutureAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td
                      style={{
                        width: "15%",
                        paddingTop: "5px",
                        paddingLeft: "12px",
                      }}
                    >
                      <Link
                        className="btn btn-outline-light"
                        style={{
                          border: "2px solid #b84823",
                          borderRadius: "50%",
                          padding: "5px",
                          background: "transparent",
                        }}
                        to={`/Events/${appointment.id}`}
                      >
                        <BsThreeDots style={{ fontSize: "20px" }} />
                      </Link>
                    </td>
                    <td style={{ width: "25%" }}>{appointment.title}</td>
                    <td style={{ width: "20%" }}>{appointment.type}</td>
                    <td style={{ width: "20%", paddingLeft: 30 }}>
                      {appointment.startTime}
                    </td>
                    <td style={{ width: "20%", paddingLeft: 30 }}>
                      {appointment.endTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                marginTop: "50px",
                textAlign: "center",
                width: "400px",
                backgroundColor: "#313949",
                height: "200px",
              }}
            >
              <h2
                style={{
                  color: "white",
                  marginBottom: "20px",
                  border: "none",
                  padding: "0",
                }}
              >
                Future Appointments
              </h2>
              <FaDatabase style={{ fontSize: "50px", color: "white" }} />
              <h5 style={{ color: "white", marginTop: "10px" }}>
                No future appointments
              </h5>
            </div>
          )}
        </div>
      </Modal>

      {/* Hign Priority modal  */}

      <Modal
        className="modal-style"
        isOpen={isContactsModalOpen}
        onRequestClose={() => setIsContactsModalOpen(false)}
        contentLabel="Details Modal"
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
        <div className="table-container" style={{ backgroundColor: "#313949" }}>
          {selectedContacts.length > 0 ? (
            <table
              className="home event table table-hover"
              style={{ border: "none" }}
            >
              <thead>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <h3
                    style={{
                      boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                      textAlign: "center",
                      marginBottom: "20px",
                      backgroundColor: "#313949",
                      color: "#daa520",
                      borderRadius: "50px",
                      height: "50px",
                      marginTop: "20px",
                      width: "80%",
                    }}
                  >
                    High Priority Contacts
                  </h3>
                </div>
                <tr>
                  <th scope="col" style={{ width: "10%", textAlign: "center" }}>
                    View
                  </th>
                  <th scope="col" style={{ width: "20%", textAlign: "center" }}>
                    First Name
                  </th>
                  <th scope="col" style={{ width: "20%", textAlign: "center" }}>
                    Last Name
                  </th>
                  <th scope="col" style={{ width: "20%", textAlign: "center" }}>
                    Phone Number
                  </th>
                  <th style={{ width: "30%", textAlign: "center" }} scope="col">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td
                      style={{
                        width: "10%",
                        paddingTop: "5px",
                        paddingLeft: "20px",
                      }}
                    >
                      <Link
                        className="btn btn-outline-light"
                        style={{
                          border: "2px solid #b84823",
                          borderRadius: "50%",
                          padding: "5px",
                          background: "transparent",
                        }}
                        to={`/Contacts/${contact.id}`}
                      >
                        <BsThreeDots style={{ fontSize: "20px" }} />
                      </Link>
                    </td>
                    <td style={{ width: "20%", textAlign: "center" }}>
                      {contact.fname}
                    </td>
                    <td style={{ width: "20%", textAlign: "center" }}>
                      {contact.lname}
                    </td>
                    <td style={{ width: "20%", textAlign: "center" }}>
                      {contact.phoneNumber}
                    </td>
                    <td style={{ width: "30%", textAlign: "center" }}>
                      {contact.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                marginTop: "50px",
                textAlign: "center",
                width: "400px",
                backgroundColor: "#313949",
                height: "200px",
              }}
            >
              <h2
                style={{
                  color: "white",
                  marginBottom: "20px",
                  border: "none",
                  padding: "0",
                }}
              >
                High Priority Contacts
              </h2>
              <FaDatabase style={{ fontSize: "50px", color: "white" }} />
              <h5 style={{ color: "white", marginTop: "10px" }}>
                No contacts available
              </h5>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default HomeCards;
