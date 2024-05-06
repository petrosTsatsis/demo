import {getMonth, getYear} from "date-fns";
import {range} from "lodash";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {CgDanger} from "react-icons/cg";
import {FaCalendarAlt, FaCheck} from "react-icons/fa";
import {GrStatusUnknown} from "react-icons/gr";
import {MdCancel, MdLowPriority, MdModeEdit, MdOutlineSubject} from "react-icons/md";
import {TbFileDescription} from "react-icons/tb";
import Modal from "react-modal";
import TaskService from "../../services/task-service";

const EditTaskModal = ({ isOpen, onRequestClose, task, onTaskUpdate }) => {
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
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
    if (task) {
      setSubject(task.subject);
      setPriority(task.priority);
      setDescription(task.description);
      setStatus(task.status);
      const parsedDate = moment(task.dueDate, "DD-MM-YYYY").toDate();
      setDueDate(parsedDate);
    }
  }, [task]);

  let existingAlert = document.querySelector(".alert");

  // edit task method
  const handleSubmitEditForm = (e) => {
    e.preventDefault();
    setGenericError("");

    // check if we have any empty fields
    if (!subject || !dueDate || !status || !priority) {
      setGenericError("Please fill in all required fields.");
      return;
    }

    // Format the date to "dd-mm-yyyy"
    const formattedDueDate = moment(dueDate).format("DD-MM-YYYY");

    TaskService.updateTask(task.id, {
      subject,
      dueDate: formattedDueDate,
      status,
      priority,
      description,
    })
      .then(() => {
        onRequestClose();
        fetchUpdatedTaskData();

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
          alertDiv.textContent = "Task details saved successfully.";

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
            "An error occurred while updating the task. Please try again."
          );
          console.log(error);
        }
      });
  };

  // method to update the task in the list-tasks component
  const fetchUpdatedTaskData = () => {
    TaskService.getTask(task.id)
      .then((response) => {
        // update the task in the list-tasks component
        onTaskUpdate(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // method which reset the fields and error status after closing the form
  const resetState = () => {
    setSubject(task.subject);
    setPriority(task.priority);
    setStatus(task.status);
    setDescription(task.description);
    const parsedDate = moment(task.dueDate, "DD-MM-YYYY").toDate();
    setDueDate(parsedDate);
    setGenericError("");
  };

  // method to count the description/notes field characters
  const maxLengthDescription = 355;

  const handleDescriptionChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxLengthDescription) {
      setDescription(inputValue);
    }
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
          {/* edit task form  */}
          <form
            onSubmit={handleSubmitEditForm}
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                textAlign: "center",
                marginTop: "20px",
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
                <MdModeEdit style={{ marginBottom: "4px" }} /> Edit Task
              </h3>
              {/* subject field  */}
              <Row
                className="mt-4"
                style={{
                  marginBottom: "30px",

                  marginTop: "20px",
                }}
              >
                <Col style={{ position: "relative" }}>
                  <label htmlFor="subject">
                    {" "}
                    <MdOutlineSubject
                      style={{
                        paddingBottom: "5px",
                        fontSize: "18px",
                        marginRight: "3px",
                        color: "#daa520",
                      }}
                    />
                    Subject:
                  </label>
                  <br />
                  <input
                    type="text"
                    id="subject"
                    className="form-control-call"
                    value={subject}
                    placeholder="Subject"
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: "300px",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  />
                  {subject === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "33%",
                        top: "70%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </Col>
              </Row>
              {/* priority, status and due date fields  */}
              <Row
                className="mt-4"
                style={{ marginBottom: "30px", marginTop: "20px" }}
              >
                <Col
                  className="text-center"
                  style={{ marginRight: "5px", position: "relative" }}
                >
                  <label htmlFor="name">
                    {" "}
                    <MdLowPriority
                      style={{
                        paddingBottom: "5px",
                        fontSize: "22px",
                        color: "#daa520",
                      }}
                    />{" "}
                    Priority:
                  </label>
                  <br />
                  <select
                    id="priority"
                    className="form-control-call"
                    value={priority}
                    onChange={(e) => {
                      setPriority(e.target.value);
                    }}
                    style={{
                      width: "250px",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    <option value="" disabled>
                      Select Priority
                    </option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  {priority === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "7%",
                        top: "74%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </Col>

                <Col
                  className="text-center"
                  style={{ marginRight: "5px", position: "relative" }}
                >
                  <label htmlFor="name">
                    {" "}
                    <GrStatusUnknown
                      style={{
                        paddingBottom: "5px",
                        fontSize: "22px",
                        color: "#daa520",
                      }}
                    />{" "}
                    Status:
                  </label>
                  <br />
                  <select
                    id="status"
                    className="form-control-call"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                    style={{
                      width: "250px",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    <option value="" disabled>
                      Set Status
                    </option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Expired">Expired</option>
                  </select>
                  {status === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "7%",
                        top: "73%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </Col>

                <Col
                  className="text-center"
                  style={{ marginRight: "5px", position: "relative" }}
                >
                  <label htmlFor="name">
                    {" "}
                    <FaCalendarAlt
                      style={{
                        paddingBottom: "5px",
                        fontSize: "22px",
                        color: "#daa520",
                      }}
                    />{" "}
                    Due Date:
                  </label>
                  <br />
                  <DatePicker
                    className="due-date"
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
                    selected={dueDate}
                    onChange={(dueDate) => {
                      setDueDate(dueDate);
                    }}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                  />
                  {dueDate === "" && (
                    <CgDanger
                      className="danger-icon"
                      style={{
                        position: "absolute",
                        left: "8%",
                        top: "73%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  )}
                </Col>
              </Row>
              {/* description field  */}
              <Row className="mt-4">
                <Col>
                  <label htmlFor="description">
                    {" "}
                    <TbFileDescription
                      style={{ fontSize: "18px", color: "#daa520" }}
                    />{" "}
                    Description:
                  </label>
                  <br />
                  <textarea
                    id="description"
                    className="form-control-call"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Description/Notes for the task..."
                    maxLength={maxLengthDescription}
                    style={{
                      width: "550px",
                      padding: "8px",
                      textAlign: "center",
                      height: "150px",
                      resize: "none",
                    }}
                  />
                  <div style={{ color: "#ff7b00", fontWeight: "bold" }}>
                    Characters Left: {maxLengthDescription - description.length}
                  </div>
                </Col>
              </Row>
            </div>

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

export default EditTaskModal;
