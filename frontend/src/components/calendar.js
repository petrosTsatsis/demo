import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {Col, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {BsThreeDots} from "react-icons/bs";
import {CgDanger} from "react-icons/cg";
import {FaCalendarAlt, FaCheck, FaDatabase, FaUserAlt} from "react-icons/fa";
import {FaArrowRightLong, FaLink, FaLocationDot} from "react-icons/fa6";
import {FiArrowUpRight} from "react-icons/fi";
import {ImBin} from "react-icons/im";
import {IoIosTime, IoMdContact} from "react-icons/io";
import {IoAddCircleOutline} from "react-icons/io5";
import {MdCancel, MdEvent, MdOutlineSubtitles} from "react-icons/md";
import {TbFileDescription} from "react-icons/tb";
import Modal from "react-modal";
import {Link} from "react-router-dom";
import Select from "react-select";
import "react-time-picker/dist/TimePicker.css";
import "../App.css";
import AppointmentService from "../services/appointment-service";
import ContactService from "../services/contact-service";
import CustomerService from "../services/customer-service";
import EventService from "../services/event-service";

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedSlot, setClickedSlot] = useState(null);
  const [startTime, setStartTime] = useState(
    clickedSlot ? clickedSlot.start : new Date()
  );
  const [endTime, setEndTime] = useState(
    clickedSlot ? clickedSlot.end : new Date()
  );
  const [relatedTo, setRelatedTo] = useState("");
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [callUrl, setCallUrl] = useState("");
  const [description, setDescription] = useState("");
  const [customers, setCustomers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [events, setEvents] = useState([]);
  const [clickedEvent, setClickedEvent] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverCoordinates, setPopoverCoordinates] = useState({ x: 0, y: 0 });
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMyEventsModal, setShowMyEventsModal] = useState(false);
  const [genericError, setGenericError] = useState("");
  const [myEvents, setMyEvents] = useState([]);

  // Fetch all the events
  const fetchEvents = () => {
    EventService.getAllEvents()
      .then((response) => {
        setMyEvents(response.data);
        const transformedEventsForCalendar = transformEvents(response.data);
        setEvents(transformedEventsForCalendar);
        console.log(transformedEventsForCalendar);
      })
      .catch((error) => console.error("Error fetching events:", error));
  };

  // Transform the Events to fit in the format the react-big-calendar needs
  const transformEvents = (events) => {
    return events.map((event) => {
      const startDate = moment
        .utc(`${event.date} ${event.startTime}`, "DD-MM-YYYY HH:mm")
        .toDate();
      const endDate = moment
        .utc(`${event.date} ${event.endTime}`, "DD-MM-YYYY HH:mm")
        .toDate();

      return {
        id: event.id,
        title: event.title,
        start: startDate,
        end: endDate,
        description: event.description,
        customers: event.customers,
        users: event.users,
        contacts: event.contacts,
        software: event.software,
        callUrl: event.callUrl,
        type: event.type,
        relatedTo: event.relatedTo,
      };
    });
  };

  // Set the color for the Event and Appointment
  const eventStyleGetter = (event) => {
    // Check if relatedTo field is undefined and if so we have an Event for all day
    if (typeof event.relatedTo === "undefined") {
      return {
        style: {
          backgroundColor: "rgb(124, 170, 86)",
        },
      };
      // Otherwise we have an Appointment
    } else {
      return {
        style: {
          backgroundColor: "#daa520",
        },
      };
    }
  };

  useEffect(() => {
    fetchEvents();

    // Fetch contacts
    ContactService.getMyContacts()
      .then((response) => {
        setContacts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
      });

    CustomerService.getAllCustomers()
      .then((response) => {
        // Filter customers with null fname, which means it's a company
        const filteredCustomers = response.data.filter(
          (customer) => customer.fname !== null
        );
        setCustomers(filteredCustomers);
      })
      .catch((error) => console.error("Error fetching customers:", error));

    // Add event listener to handle clicks outside of popover content and close the popover
    const handleDocumentClick = (e) => {
      // Check if the click is outside of the popover content
      if (
        popoverOpen &&
        e.target.closest(".popover") === null &&
        e.target.closest(".rbc-event") === null
      ) {
        // Close the popover
        setPopoverOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [clickedSlot, popoverOpen]);

  const handleEventClick = (event, e) => {
    // Get the coordinates of the clicked event relative to the viewport
    const eventRect = e.target.getBoundingClientRect();
    const eventX = eventRect.left + window.scrollX;
    const eventY = eventRect.top + window.scrollY - 210;

    // Set the clicked event details and open the popover
    setClickedEvent(event);
    setPopoverOpen(true);

    // Set the coordinates of the clicked event
    setPopoverCoordinates({ x: eventX, y: eventY });
  };

  const handleButtonClick = () => {
    setStartTime(new Date());
    setEndTime(new Date());
    setIsModalOpen(true);
  };

  const handleMyEventsClick = () => {
    setShowMyEventsModal(true);
  };

  // Reset all fields when we close the modal
  const handleCloseModal = () => {
    setStartTime((prevStartTime) =>
      clickedSlot ? clickedSlot.start : prevStartTime
    );
    setEndTime((prevEndTime) => (clickedSlot ? clickedSlot.end : prevEndTime));
    setSelectedCustomers("");
    setSelectedContacts("");
    setRelatedTo("");
    setType("");
    setTitle("");
    setCallUrl("");
    setDescription("");
    setIsModalOpen(false);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const handleSubmit = async (e) => {
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

    // Create an appointment object
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

    try {
      const response = await AppointmentService.createAppointment(appointment);
      console.log(response.data);
      resetState();
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      if (error.response) {
        setGenericError(
          "An error occurred while adding the software. Please try again."
        );
      }
      console.error("Error creating appointment:", error);
    }
  };

  const resetState = () => {
    // Reset the form fields
    setStartTime(new Date());
    setEndTime(new Date());
    setSelectedCustomers([]);
    setSelectedContacts([]);
    setRelatedTo("");
    setType("");
    setTitle("");
    setCallUrl("");
    setDescription("");
    setIsModalOpen(false);
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

  const deleteEvent = (id) => {
    setEventToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    EventService.deleteEvent(eventToDelete)
      .then(() => {
        fetchEvents();
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const closeMyEventsModal = () => {
    setShowMyEventsModal(false);
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ height: "80vh", width: "80%" }}>
        {/* Calendar Component */}
        <Calendar
          localizer={localizer}
          events={events}
          eventPropGetter={eventStyleGetter}
          startAccessor="start"
          endAccessor="end"
          selectable={true}
          onSelectEvent={handleEventClick}
          onSelectSlot={setClickedSlot}
          views={{
            month: true,
            day: true,
            agenda: true,
          }}
          // Custom Toolbar
          components={{
            toolbar: (props) => {
              return (
                <div>
                  <div style={{ marginBottom: "15px", display: "flex" }}>
                    <div style={{ marginRight: "10px" }}>
                      <button
                        className="appointment btn btn-outline-light"
                        onClick={handleButtonClick}
                      >
                        Add Appointment{" "}
                        <IoAddCircleOutline
                          style={{ fontSize: "22px", marginBottom: "3px" }}
                        />
                      </button>
                    </div>
                    <div>
                      <button
                        className="starter btn btn-warning"
                        onClick={handleMyEventsClick}
                      >
                        My Events{" "}
                        <IoAddCircleOutline
                          style={{ fontSize: "22px", marginBottom: "3px" }}
                        />
                      </button>
                    </div>
                  </div>

                  <div
                    className="rbc-toolbar"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div className="rbc-btn-group">
                      <button
                        type="button"
                        onClick={() => props.onNavigate("TODAY")}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => props.onNavigate("PREV")}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => props.onNavigate("NEXT")}
                      >
                        Next
                      </button>
                    </div>
                    <div className="rbc-label">
                      {props.label && (
                        <span className="rbc-label">{props.label}</span>
                      )}
                    </div>
                    <div className="rbc-btn-group">
                      <button
                        type="button"
                        onClick={() => props.onView("month")}
                      >
                        Month
                      </button>
                      <button type="button" onClick={() => props.onView("day")}>
                        Day
                      </button>
                    </div>
                  </div>
                </div>
              );
            },
          }}
        />
        {/* Popover Component */}
        {popoverOpen && clickedEvent && (
          <div
            className="popover"
            style={{
              position: "absolute",
              top: `${popoverCoordinates.y}px`,
              left: `${popoverCoordinates.x}px`,
              width: "250px",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
              color: "black",
            }}
          >
            {/* Close button */}
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
              onClick={() => setPopoverOpen(false)}
            >
              X
            </button>

            <div className="popover-content">
              {/* Title field */}
              <div className="title-container">
                <div className="blue-circle"></div>
                <h5>{clickedEvent.title}</h5>
              </div>

              {/* Date field */}
              <p>
                <FaCalendarAlt
                  style={{ marginRight: "5px", fontSize: "18px" }}
                />
                {clickedEvent.start.toLocaleDateString()}
              </p>

              {/* If relatedTo is undefined we have an event so we display the time as All Day otherwise Start Time - End Time*/}
              {typeof clickedEvent.relatedTo !== "undefined" ? (
                <>
                  <p>
                    <IoIosTime
                      style={{
                        marginRight: "5px",
                        fontSize: "18px",
                        marginBottom: "3px",
                      }}
                    />
                    {clickedEvent.start.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC",
                    })}
                  </p>
                  <p>
                    <IoIosTime
                      style={{
                        marginRight: "5px",
                        fontSize: "18px",
                        marginBottom: "3px",
                      }}
                    />
                    {clickedEvent.end.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC",
                    })}
                  </p>
                </>
              ) : (
                <p>
                  {" "}
                  <IoIosTime
                    style={{
                      marginRight: "5px",
                      fontSize: "18px",
                      marginBottom: "3px",
                    }}
                  />{" "}
                  All Day
                </p>
              )}
              <div className="popover-buttons-container">
                {/* Button to see the details */}
                <button
                  className="event-details-button"
                  onClick={() =>
                    (window.location.href = `/Events/${clickedEvent.id}`)
                  }
                >
                  <FiArrowUpRight style={{ fontSize: "20px" }} />
                </button>

                {/* Button to delete */}
                <button
                  className="event-details-button"
                  style={{ color: "#dc3545" }}
                  onClick={() => {
                    setPopoverOpen(false);
                    deleteEvent(clickedEvent.id);
                  }}
                >
                  <ImBin style={{ fontSize: "18px" }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal to add an Appointment*/}
        <Modal
          className="modal-style"
          isOpen={isModalOpen}
          onRequestClose={() => {
            handleCloseModal();
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
                onSubmit={handleSubmit}
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
                    color: "#7caa56",
                    borderRadius: "50px",
                    height: "35px",
                    marginTop: "15px",
                  }}
                >
                  {" "}
                  <MdEvent style={{ marginBottom: "8px" }} /> Book Appointment
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
                        style={{ paddingBottom: "5px", fontSize: "22px" }}
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
                      <FaCalendarAlt style={{ marginBottom: "3px" }} /> Date:
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
                        <IoIosTime style={{ marginRight: "8px" }} />
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
                        <FaArrowRightLong style={{ marginRight: "8px" }} />
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
                        <IoIosTime style={{ marginRight: "8px" }} />
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
                          style={{ marginRight: "6px", marginBottom: "3px" }}
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
                            top: "70%",
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
                        <FaLink style={{ marginRight: "6px" }} />
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
                        <TbFileDescription style={{ marginRight: "6px" }} />
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
                  <button type="submit" className="btn btn-outline-success">
                    <FaCheck style={{ marginRight: "5px" }} /> Add Appointment
                  </button>

                  <Link
                    className="btn btn-outline-danger"
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                      setIsModalOpen(false);
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

        {/* Modal that shows up for delete confirmation */}
        {eventToDelete && (
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

        <Modal
          className="modal-style"
          isOpen={showMyEventsModal}
          onRequestClose={closeMyEventsModal}
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
            className="table-container"
            style={{ backgroundColor: "#313949", textAlign: "center" }}
          >
            {events.length > 0 ? (
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
                        color: "rgb(219, 213, 201, 0.9)",
                        borderRadius: "50px",
                        height: "50px",
                        marginTop: "20px",
                        width: "80%",
                      }}
                    >
                      My Events
                    </h3>
                  </div>
                  <tr>
                    <th
                      scope="col"
                      style={{ width: "30%", textAlign: "center" }}
                    >
                      View
                    </th>
                    <th
                      scope="col"
                      style={{ width: "40%", textAlign: "center" }}
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      style={{ width: "30%", textAlign: "center" }}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myEvents.map((event) => (
                    <tr key={event.id}>
                      <td
                        style={{
                          width: "30%",
                          paddingTop: "5px",
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
                          to={`/Events/${event.id}`}
                        >
                          <BsThreeDots style={{ fontSize: "20px" }} />
                        </Link>
                      </td>
                      <td style={{ width: "40%", textAlign: "center" }}>
                        {event.title}
                      </td>
                      <td style={{ width: "30%", textAlign: "center" }}>
                        {event.date}
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
                  My Events
                </h2>
                <FaDatabase style={{ fontSize: "50px", color: "white" }} />
                <h5 style={{ color: "white", marginTop: "10px" }}>
                  No Events yet.
                </h5>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CalendarComponent;
