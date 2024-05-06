import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import React, {useEffect, useState} from "react";
import Avatar from "react-avatar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {Col, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {CgDanger} from "react-icons/cg";
import {FaCalendarAlt, FaCheck, FaUserAlt} from "react-icons/fa";
import {FaArrowRightLong, FaLink, FaLocationDot} from "react-icons/fa6";
import {GrCloudSoftware} from "react-icons/gr";
import {ImBin} from "react-icons/im";
import {IoIosTime, IoMdContact} from "react-icons/io";
import {MdCancel, MdModeEdit, MdOutlineSubtitles} from "react-icons/md";
import {TbFileDescription} from "react-icons/tb";
import Modal from "react-modal";
import {Link, useParams} from "react-router-dom";
import Select from "react-select";
import AppointmentService from "../../services/appointment-service";
import ContactService from "../../services/contact-service";
import CustomerService from "../../services/customer-service";
import EventService from "../../services/event-service";

const AppointmentDetailsPage = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [relatedTo, setRelatedTo] = useState("");
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [callUrl, setCallUrl] = useState("");
  const [description, setDescription] = useState("");
  const [customers, setCustomers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [event, setEvent] = useState(null);
  const [genericError, setGenericError] = useState("");

  // Fetch all the events
  const fetchEvents = async () => {
    try {
      const response = await EventService.getEvent(id);
      const eventData = response.data;

      // Check if endTime is undefined or not
      if (typeof eventData.endTime !== "undefined") {
        // It's an appointment
        setAppointment(eventData);
        setTitle(eventData.title);
        setType(eventData.type);
        setCallUrl(eventData.callUrl);
        setRelatedTo(eventData.relatedTo);
        setDescription(eventData.description);
        setStartTime(parseDateTimeString(eventData.date, eventData.startTime));
        setEndTime(parseDateTimeString(eventData.date, eventData.endTime));
        setSelectedCustomers(
          eventData.customers.map((customer) => customer.id)
        );
        setSelectedContacts(eventData.contacts.map((contact) => contact.id));
      } else {
        // It's a regular event
        setEvent(eventData);
        setTitle(eventData.title);
        setDescription(eventData.description);
        setStartTime(parseDateTimeString(eventData.date, eventData.startTime));
      }

      // Fetch existing customers and contacts data
      const contactsResponse = await ContactService.getMyContacts();
      CustomerService.getAllCustomers()
        .then((response) => {
          // Filter customers with null fname, which means it's a company
          const filteredCustomers = response.data.filter(
            (customer) => customer.fname !== null
          );
          setCustomers(filteredCustomers);
        })
        .catch((error) => console.error("Error fetching customers:", error));

      setContacts(contactsResponse.data);
    } catch (error) {
      console.error("Error fetching appointment:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [id]);

  // parse the start-end time from string to JavaScript objects
  const parseDateTimeString = (dateString, timeString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const paddedHours = hours.padStart(2, "0");
    const paddedMinutes = minutes.padStart(2, "0");
    return `${paddedHours}:${paddedMinutes}`;
  };

  let existingAlert = document.querySelector(".alert");

  const handleSubmitEditForm = (e) => {
    e.preventDefault();

    // check if we have any empty fields
    if (!title || !type || !relatedTo || !startTime || !endTime) {
      setGenericError("Please fill in all required fields.");
      return;
    }

    const selectedCustomersList = customers.filter((cust) =>
      selectedCustomers.includes(cust.id)
    );
    const selectedContactsList = contacts.filter((contact) =>
      selectedContacts.includes(contact.id)
    );

    const appointment = {
      title,
      date: formatDate(startTime),
      startTime: formatTime(moment(startTime).format("HH:mm")),
      endTime: formatTime(moment(endTime).format("HH:mm")),
      type,
      relatedTo,
      callUrl: type === "In Person" ? "" : callUrl,
      description,
      customers: selectedCustomersList,
      contacts: selectedContactsList,
    };

    AppointmentService.updateAppointment(id, appointment)
      .then(() => {
        fetchEvents();
        setShowEditModal(false);
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
          alertDiv.textContent = "Appointment details saved successfully.";

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
            "An error occurred while adding the software. Please try again."
          );
        }
        console.error("Error updating appointment:", error);
      });
  };

  // Stracture of the dropdown from customers and contacts
  const DropdownList = ({ label, options, selectedOptions, onChange }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "300px",
      }}
    >
      <label htmlFor={`${label}Dropdown`} style={{ marginBottom: "8px" }}>
        {label}
      </label>
      <Select
        id={`${label}Dropdown`}
        options={options.map((option) => ({
          value: option.id,
          label: option.name
            ? `${option.id} - ${option.name}`
            : `${option.id} - ${option.fname} ${option.lname}`,
        }))}
        isMulti
        value={
          Array.isArray(selectedOptions)
            ? selectedOptions.map((optionId) => ({
                value: optionId,
                label: options.find((option) => option.id === optionId).name
                  ? `${optionId} - ${
                      options.find((option) => option.id === optionId).name
                    }`
                  : `${optionId} - ${
                      options.find((option) => option.id === optionId).fname
                    } ${
                      options.find((option) => option.id === optionId).lname
                    }`,
              }))
            : []
        }
        onChange={onChange}
        styles={{
          control: (provided) => ({
            ...provided,
            width: "240px",
            height: "90px",
          }),
          valueContainer: (provided) => ({
            ...provided,
            maxHeight: "80px",
            overflowY: "auto",
            paddingRight: "5px",
          }),
          menu: (provided) => ({
            ...provided,
            maxHeight: "120px",
            overflowY: "auto",
          }),
          menuList: (provided) => ({
            ...provided,
            maxHeight: "120px",
            overflowY: "auto",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#546A7B" : "#313949",
            color: "white",
            borderRadius: "50px",
            marginBottom: "5px",
            marginLeft: "5px",
            marginRight: "5px",
            width: "200px",
            "&:hover": {
              backgroundColor: "#546A7B",
              cursor: "pointer",
            },
            "&:active": {
              backgroundColor: "#546A7B",
            },
          }),
        }}
      />
    </div>
  );

  const deleteAppointment = (id) => {
    setAppointmentToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    EventService.deleteEvent(appointmentToDelete)
      .then(() => {
        fetchEvents();
        setShowDeleteModal(false);
        window.location.href = "/Calendar";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const resetState = () => {
    // Reset the form fields
    setStartTime(parseDateTimeString(appointment.date, appointment.startTime));
    setEndTime(parseDateTimeString(appointment.date, appointment.endTime));
    setRelatedTo(appointment.relatedTo);
    setType(appointment.type);
    setTitle(appointment.title);
    setCallUrl(appointment.callUrl);
    setDescription(appointment.description);
    setShowEditModal(false);
  };

  // method to count the description/notes field characters
  const maxLength = 255;

  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxLength) {
      setDescription(inputValue);
    }
  };

  return (
    <div className="container-fluid" style={{ marginTop: "30px" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h3
          style={{
            boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
            textAlign: "center",
            marginBottom: "40px",
            backgroundColor: "#313949",
            color: "white",
            borderRadius: "50px",
            height: "40px",
            marginTop: "15px",
            width: "1250px",
          }}
        >
          {" "}
          Event Details
        </h3>
      </div>

      <div className="appointment-details-container">
        {/* If we have an appointment show these*/}
        {appointment && !event && (
          <>
            {/* Container with back to Calendar button and Customers card */}
            <div className="event-buttons-and-contact">
              {/* Back to Calendar button */}
              <div
                className="event-buttons"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#313949",
                  borderRadius: "50px",
                  marginRight: "30px",
                  height: "40px",
                }}
              >
                <a
                  className="hover-red"
                  variant="outline-light"
                  href="/Calendar"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Back to Calendar{" "}
                  <FaCalendarAlt
                    size={20}
                    style={{
                      color: "white",
                      marginLeft: "5px",
                      marginBottom: "4px",
                    }}
                  />
                </a>
              </div>

              {/* Customers card */}
              <div className="customers-mini card">
                <div className="card-body">
                  <h6
                    className="card-subtitle mb-2"
                    style={{ textAlign: "center" }}
                  >
                    {" "}
                    <FaUserAlt style={{ marginRight: "4px" }} /> Customers:
                  </h6>
                  {appointment &&
                  appointment.customers &&
                  appointment.customers.length > 0 ? (
                    <ul className="customer-list">
                      {appointment.customers.map((customer, index) => (
                        <li key={index} className="customer-item">
                          <Avatar
                            name={
                              customer.name ||
                              `${customer.fname} ${customer.lname}`
                            }
                            size="25"
                            round={true}
                            className="avatar"
                            style={{ marginRight: "5px" }}
                          />
                          <a
                            href={`/Customers/${customer.id}`}
                            className="hover-gold"
                            style={{
                              color: "inherit",
                              textDecoration: "none",
                              transition: "color 0.3s",
                            }}
                          >
                            {customer.name
                              ? customer.name
                              : `${customer.fname || ""} ${
                                  customer.lname || ""
                                }`}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: "60px",
                      }}
                    >
                      No customers.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Card for the appointment's details */}
            <div className="appointment card">
              <div className="card-body">
                <h5
                  className="card-title-event-display"
                  style={{
                    textAlign: "center",
                    backgroundColor: "#efa78f",
                    borderRadius: "50px",
                  }}
                >
                  {appointment.title}
                </h5>
                <div className="appointment-details-grid">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "650px",
                      margin: "0 auto",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      className="appointment-detail-item"
                      style={{
                        width: "200px",
                        height: "40px",
                        overflowY: "auto",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <p className="card-text">
                        {" "}
                        <IoIosTime
                          style={{
                            marginRight: "5px",
                            fontSize: "18px",
                            marginBottom: "3px",
                          }}
                        />{" "}
                        Start Time: {appointment.startTime}
                      </p>
                    </div>
                    <div
                      className="appointment-detail-item"
                      style={{
                        width: "200px",
                        height: "40px",
                        overflowY: "auto",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <p className="card-text">
                        {" "}
                        <FaCalendarAlt
                          style={{
                            marginRight: "5px",
                            fontSize: "18px",
                            marginBottom: "3px",
                          }}
                        />{" "}
                        Date: {appointment.date}
                      </p>
                    </div>
                    <div
                      className="appointment-detail-item"
                      style={{
                        width: "200px",
                        height: "40px",
                        overflowY: "auto",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <p className="card-text">
                        {" "}
                        <IoIosTime
                          style={{
                            marginRight: "5px",
                            fontSize: "18px",
                            marginBottom: "3px",
                          }}
                        />{" "}
                        End Time: {appointment.endTime}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      className="appointment-detail-item"
                      style={{
                        width: "200px",
                        height: "40px",
                        overflowY: "auto",
                        marginRight: "20px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <p className="card-text">
                        {" "}
                        <FaLocationDot
                          style={{ marginRight: "4px", marginBottom: "3px" }}
                        />{" "}
                        Type: {appointment.type}
                      </p>
                    </div>
                    <div
                      className="appointment-detail-item"
                      style={{
                        width: "230px",
                        height: "40px",
                        overflowY: "auto",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <p className="card-text">
                        {" "}
                        <FaArrowRightLong
                          style={{ marginRight: "4px", marginBottom: "3px" }}
                        />{" "}
                        Related To: {appointment.relatedTo}
                      </p>
                    </div>
                  </div>
                  {appointment.type === "Online" && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        className="appointment-detail-item"
                        style={{
                          width: "400px",
                          height: "40px",
                          overflowY: "auto",
                          scrollbarWidth: "thin",
                          scrollbarColor: "#6c757d #f8f9fa",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <p className="card-text">
                          {" "}
                          <FaLink
                            style={{ marginRight: "4px", marginBottom: "3px" }}
                          />
                          Call Url:{" "}
                          <a href={appointment.callUrl}>
                            {appointment.callUrl}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                  <div
                    className="appointment-detail-item"
                    style={{
                      alignItems: "center",
                      width: "670px",
                      height: "180px",
                      overflowY: "auto",
                    }}
                  >
                    <p className="card-text" style={{ marginBottom: "10px" }}>
                      {" "}
                      <TbFileDescription
                        style={{ marginRight: "4px", marginBottom: "3px" }}
                      />{" "}
                      Description:
                    </p>
                    <p
                      style={{
                        width: "600px",
                        textAlign: "center",
                        overflowY: "auto",
                        WebkitOverflowScrolling: "touch",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#6c757d #f8f9fa",
                      }}
                    >
                      {appointment.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit-Delete and Contact card */}
            <div className="event-buttons-and-contact">
              {/* Edit-Delete Buttons */}
              <div
                className="event-buttons"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#313949",
                  borderRadius: "50px",
                  marginLeft: "30px",
                  height: "40px",
                }}
              >
                <MdModeEdit
                  className="bin"
                  style={{
                    color: "green",
                    fontSize: "30px",
                    cursor: "pointer",
                    marginRight: "30px",
                  }}
                  onClick={() => setShowEditModal(true)}
                />
                <ImBin
                  className="bin"
                  style={{
                    color: "#dc3545",
                    fontSize: "30px",
                    cursor: "pointer",
                  }}
                  onClick={() => deleteAppointment(appointment.id)}
                />
              </div>

              {/* Contact card */}
              <div className="contacts-mini card" style={{ marginTop: "20px" }}>
                <div className="card-body">
                  <h6
                    className="card-subtitle mb-2"
                    style={{ textAlign: "center" }}
                  >
                    {" "}
                    <IoMdContact
                      style={{ marginRight: "4px", fontSize: "22" }}
                    />{" "}
                    Contacts:
                  </h6>
                  {appointment &&
                  appointment.contacts &&
                  appointment.contacts.length > 0 ? (
                    <ul className="contact-list">
                      {appointment.contacts.map((contact, index) => (
                        <li key={index} className="contact-item">
                          <Avatar
                            name={`${contact.fname} ${contact.lname}`}
                            size="25"
                            round={true}
                            className="avatar"
                            style={{ marginRight: "5px" }}
                          />
                          <a
                            href={`/Contacts/${contact.id}`}
                            className="hover-gold"
                            style={{
                              color: "inherit",
                              textDecoration: "none",
                              transition: "color 0.3s",
                            }}
                          >
                            {contact.fname} {contact.lname}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: "60px",
                      }}
                    >
                      No contacts.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* If we have an event show these */}
        {!appointment && event && (
          <>
            {/* Card with the event's details */}
            <div className="appointment card">
              <div className="card-body">
                {/* Title field */}
                <h5
                  className="card-title-event-display"
                  style={{
                    textAlign: "center",
                    backgroundColor: "rgb(124, 170, 86)",
                    borderRadius: "50px",
                    height: "26px",
                  }}
                >
                  {event.title}
                </h5>
                <div className="appointment-details-grid">
                  {/* Date field */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "650px",
                      margin: "0 auto",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      className="appointment-detail-item"
                      style={{
                        width: "200px",
                        height: "40px",
                        overflowY: "auto",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <p className="card-text">
                        {" "}
                        <FaCalendarAlt
                          style={{
                            marginRight: "5px",
                            fontSize: "18px",
                            marginBottom: "3px",
                          }}
                        />{" "}
                        Date: {event.date}
                      </p>
                    </div>
                  </div>

                  {/* Software field */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      className="appointment-detail-item"
                      style={{
                        textAlign: "left",
                        width: "400px",
                        height: "40px",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#6c757d #f8f9fa",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <p className="card-text" style={{ marginLeft: "10px" }}>
                        {" "}
                        <GrCloudSoftware
                          style={{
                            marginRight: "8px",
                            marginBottom: "3px",
                            color: "#2a8ffa",
                          }}
                        />
                        Software to be updated :{" "}
                        <a
                          href={`/Software/${event.software.id}`}
                          className="hover-gold"
                          style={{
                            color: "#2a8ffa",
                            textDecoration: "none",
                            transition: "color 0.3s",
                            fontWeight: "bold",
                          }}
                        >
                          {event.software.name}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Notes/Description field */}
                  <div
                    className="appointment-detail-item"
                    style={{
                      alignItems: "center",
                      width: "670px",
                      height: "180px",
                      overflowY: "auto",
                    }}
                  >
                    <p className="card-text" style={{ marginBottom: "10px" }}>
                      {" "}
                      <TbFileDescription
                        style={{ marginRight: "4px", marginBottom: "3px" }}
                      />{" "}
                      Description:
                    </p>
                    <p
                      style={{
                        width: "600px",
                        textAlign: "center",
                        overflowY: "auto",
                        WebkitOverflowScrolling: "touch",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#6c757d #f8f9fa",
                      }}
                    >
                      {event.description}
                    </p>
                  </div>

                  {/* Back to Calendar Button */}
                  <div
                    style={{
                      textAlign: "left",
                      marginBottom: "20px",
                      marginTop: "30px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <a
                      href="/Calendar"
                      style={{
                        backgroundColor: "transparent",
                        color: "rgb(124, 170, 86)",
                        border: "none",
                        borderRadius: "50px",
                        padding: "8px 16px",
                        cursor: "pointer",
                        border: "2px solid rgb(124, 170, 86)",
                        textDecoration: "none",
                      }}
                    >
                      Back to Calendar
                      <FaCalendarAlt
                        size={20}
                        style={{
                          color: "rgb(124, 170, 86)",
                          marginLeft: "5px",
                          marginBottom: "4px",
                        }}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modal that shows up for delete confirmation */}
        {appointmentToDelete && (
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
            <h2>Delete Event Confirmation</h2>
            <p>Are you sure you want to delete this appointment ?</p>
            <div>
              <button
                className="btn btn-outline-success"
                onClick={confirmDelete}
              >
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

        {/* Modal that shows up to edit an appointment */}
        <Modal
          className="modal-style"
          isOpen={showEditModal}
          onRequestClose={() => {
            closeEditModal();
            resetState();
          }}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            <div className="container-lg">
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
                    color: "black",
                    textAlign: "center",
                    marginBottom: "20px",
                    backgroundColor: "#313949",
                    color: "#daa520",
                    borderRadius: "50px",
                    height: "35px",
                    marginTop: "15px",
                  }}
                >
                  {" "}
                  <MdModeEdit style={{ marginBottom: "4px" }} /> Edit
                  Appointment
                </h3>

                {/* Software name field */}
                <Row
                  className="justify-content-center"
                  style={{
                    marginTop: "10px",
                  }}
                >
                  <Col
                    xs={6}
                    className="text-center"
                    style={{ position: "relative" }}
                  >
                    {" "}
                    <label htmlFor="name">
                      {" "}
                      <MdOutlineSubtitles
                        style={{
                          paddingBottom: "5px",
                          fontSize: "22px",
                          color: "#daa520",
                        }}
                      />{" "}
                      Title:
                    </label>
                    <br />
                    <div>
                      <input
                        type="text"
                        id="name"
                        className="form-control-call"
                        value={title}
                        placeholder="Appointment Title"
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                          height: "40px",
                          width: "400px",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      />
                      {title === "" && (
                        <CgDanger
                          className="danger-icon"
                          style={{
                            position: "absolute",
                            left: "7%",
                            top: "68%",
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
                    marginTop: "10px",
                  }}
                >
                  <Col>
                    {/* Customer dropdown field */}
                    <DropdownList
                      label={
                        <div
                          style={{
                            color: "white",
                          }}
                        >
                          <FaUserAlt
                            style={{
                              marginLeft: "10px",
                              marginBottom: "3px",
                              marginRight: "3px",
                              color: "#daa520",
                            }}
                          />{" "}
                          Select Customers
                        </div>
                      }
                      options={customers}
                      selectedOptions={selectedCustomers}
                      onChange={(selectedOptions) =>
                        setSelectedCustomers(
                          selectedOptions.map((option) => option.value)
                        )
                      }
                    />
                  </Col>

                  {/* Date field */}
                  <Col
                    style={{
                      marginTop: "30px",
                      marginLeft: "15px",
                      marginRight: "15px",
                    }}
                  >
                    <label htmlFor="datePicker" style={{ display: "block" }}>
                      <FaCalendarAlt
                        style={{ marginBottom: "3px", color: "#daa520" }}
                      />{" "}
                      Date:
                    </label>
                    <DatePicker
                      className="purchase-date"
                      selected={startTime}
                      onChange={(date) => setStartTime(date)}
                      dateFormat="dd/MM/yyyy"
                    />
                  </Col>

                  <Col>
                    {/* Contact dropdown field */}
                    <DropdownList
                      label={
                        <div
                          style={{
                            color: "white",
                          }}
                        >
                          <IoMdContact
                            style={{
                              marginLeft: "10px",
                              marginBottom: "3px",
                              marginRight: "3px",
                              fontSize: "20px",
                              color: "#daa520",
                            }}
                          />{" "}
                          Select Contacts
                        </div>
                      }
                      options={contacts}
                      selectedOptions={selectedContacts}
                      onChange={(selectedOptions) =>
                        setSelectedContacts(
                          selectedOptions.map((option) => option.value)
                        )
                      }
                    />
                  </Col>
                </Row>

                {/* customerand purchase date fields */}
                <Row
                  className="mt-4 justify-content-center"
                  style={{
                    marginTop: "10px",
                  }}
                >
                  {/* Start time field */}
                  <Col
                    md={4}
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: "100px" }}
                  >
                    <div
                      style={{
                        marginBottom: "15px",
                        position: "relative",
                      }}
                    >
                      <label
                        htmlFor="startTime"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <IoIosTime
                          style={{ marginRight: "8px", color: "#daa520" }}
                        />
                        Start Time:
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        className="form-control"
                        value={moment(startTime).format("HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const updatedStartTime = moment(startTime).set({
                            hours,
                            minutes,
                          });
                          setStartTime(updatedStartTime.toDate());
                        }}
                        tabIndex="27"
                        style={{ width: "120px", padding: "8px" }}
                      />
                    </div>
                  </Col>

                  {/* End time field */}
                  <Col
                    md={4}
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: "350px" }}
                  >
                    <div
                      style={{
                        marginBottom: "15px",
                        position: "relative",
                      }}
                    >
                      <label
                        htmlFor="relatedTo"
                        style={{
                          display: "block",
                          textAlign: "center",
                        }}
                      >
                        <FaArrowRightLong
                          style={{ marginRight: "8px", color: "#daa520" }}
                        />
                        Related To:
                      </label>
                      <select
                        id="relatedTo"
                        className="form-control-call"
                        value={relatedTo}
                        onChange={(e) => {
                          setRelatedTo(e.target.value);
                        }}
                        style={{
                          width: "250px",
                          padding: "8px",
                          textAlign: "center",
                          marginRight: "20px",
                          marginLeft: "20px",
                        }}
                      >
                        <option value="" disabled>
                          Select Relation
                        </option>
                        <option value="Meeting">Meeting</option>
                        <option value="Other">Other</option>
                        <option value="Personal">Personal</option>
                        <option value="Purchase Problem">
                          Purchase Problem
                        </option>
                        <option value="Software Problem">
                          Software Problem
                        </option>
                        <option value="Training">Training</option>
                      </select>
                      {relatedTo === "" && (
                        <CgDanger
                          id="relatedTo-tool"
                          className="danger-icon"
                          style={{
                            position: "absolute",
                            left: "9%",
                            top: "70%",
                            transform: "translateY(-50%)",
                          }}
                        />
                      )}
                      {relatedTo === ""}
                    </div>
                  </Col>

                  {/* End time field */}
                  <Col
                    md={4}
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: "100px" }}
                  >
                    <div
                      style={{
                        marginBottom: "15px",
                        position: "relative",
                      }}
                    >
                      <label
                        htmlFor="endTime"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <IoIosTime
                          style={{ marginRight: "8px", color: "#daa520" }}
                        />
                        End Time:
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        className="form-control"
                        value={moment(endTime).format("HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const updatedEndTime = moment(endTime).set({
                            hours,
                            minutes,
                          });
                          setEndTime(updatedEndTime.toDate());
                        }}
                        tabIndex="28"
                        style={{ width: "120px", padding: "8px" }}
                      />
                    </div>
                  </Col>
                </Row>

                {/* Third line with Type and URL Call fields */}
                <Row
                  className="justify-content-center"
                  style={{
                    marginTop: "10px",
                  }}
                >
                  {/* Type dropdown field */}
                  <Col
                    md={4}
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: "300px" }}
                  >
                    <div
                      style={{
                        marginBottom: "15px",
                        position: "relative",
                      }}
                    >
                      <label
                        htmlFor="type"
                        style={{
                          display: "block",

                          textAlign: "center",
                        }}
                      >
                        <FaLocationDot
                          style={{
                            marginRight: "6px",
                            marginBottom: "3px",
                            color: "#daa520",
                          }}
                        />
                        Type:
                      </label>
                      <select
                        id="type"
                        className="form-control-call"
                        value={type}
                        onChange={(e) => {
                          setType(e.target.value);
                          if (e.target.value === "In Person") {
                            setCallUrl("");
                          }
                        }}
                        style={{
                          width: "200px",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        <option value="" disabled>
                          Select Type
                        </option>
                        <option value="Online">Online</option>
                        <option value="In Person">In Person</option>
                      </select>
                      {type === "" && (
                        <CgDanger
                          id="type-tool"
                          className="danger-icon"
                          style={{
                            position: "absolute",
                            left: "5%",
                            top: "73%",
                            transform: "translateY(-50%)",
                          }}
                        />
                      )}
                    </div>
                  </Col>

                  {/* URL Call field  */}
                  <Col
                    md={4}
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: "300px" }}
                  >
                    <div
                      style={{
                        marginBottom: "15px",
                        position: "relative",
                      }}
                    >
                      <label
                        htmlFor="callUrl"
                        style={{
                          display: "block",

                          textAlign: "center",
                        }}
                      >
                        <FaLink
                          style={{ marginRight: "6px", color: "#daa520" }}
                        />
                        Call URL:
                      </label>
                      <input
                        type="text"
                        id="callUrl"
                        className="form-control-call"
                        value={callUrl}
                        onChange={(e) => setCallUrl(e.target.value)}
                        placeholder="Call URL"
                        style={{
                          width: "300px",
                          padding: "8px",
                          textAlign: "center",
                          opacity: type === "In Person" ? 0.5 : 1,
                        }}
                        disabled={type === "In Person"}
                      />
                    </div>
                  </Col>
                </Row>

                {/* Line with Notes/Description */}
                <Row
                  className="justify-content-center"
                  style={{
                    marginTop: "10px",
                  }}
                >
                  <Col
                    md={4}
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: "650px" }}
                  >
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <label
                        htmlFor="notes"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <TbFileDescription
                          style={{ marginRight: "6px", color: "#daa520" }}
                        />
                        Notes:
                      </label>
                      <textarea
                        id="notes"
                        className="form-control-notes"
                        value={description}
                        onChange={handleChange}
                        placeholder="Add notes..."
                        maxLength={maxLength}
                        style={{
                          width: "650px",
                          padding: "8px",
                          textAlign: "center",
                          height: "80px",
                          resize: "none",
                        }}
                      />
                      <div style={{ color: "orange" }}>
                        Characters Left: {maxLength - description.length}
                      </div>
                    </div>
                  </Col>
                </Row>

                {genericError && (
                  <p style={{ color: "#dc3545" }}>{genericError}</p>
                )}

                {/* Submit and Cancel buttons field */}
                <div
                  className="mt-4 text-center"
                  style={{ marginBottom: "15px" }}
                >
                  <button
                    type="submit"
                    className="btn btn-outline-success"
                  >
                    <FaCheck style={{ marginRight: "5px" }} /> Save
                  </button>

                  <Link
                    className="btn btn-outline-danger"
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                      closeEditModal();
                      resetState();
                    }}
                  >
                    <MdCancel style={{ marginRight: "5px" }} />
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AppointmentDetailsPage;
