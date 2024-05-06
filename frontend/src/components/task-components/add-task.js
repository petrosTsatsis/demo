import {getMonth, getYear} from "date-fns";
import {range} from "lodash";
import moment from "moment";
import React, {useState} from "react";
import {Col, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {BiSolidPurchaseTag} from "react-icons/bi";
import {CgDanger} from "react-icons/cg";
import {FaCalendarAlt, FaCheck} from "react-icons/fa";
import {GrStatusUnknown} from "react-icons/gr";
import {MdCancel, MdLowPriority, MdOutlineSubject} from "react-icons/md";
import {TbFileDescription} from "react-icons/tb";
import {Link} from "react-router-dom";
import TaskService from "../../services/task-service";

const AddTask = () => {
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
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

  // Add task method
  const addTask = (e) => {
    e.preventDefault();

    setGenericError("");

    // check if we have any empty fields
    if (!subject || !dueDate || !status || !priority) {
      setGenericError("Please fill in all required fields.");
      return;
    }

    // Format the date to "dd-mm-yyyy"
    const formattedDueDate = moment(dueDate).format("DD-MM-YYYY");

    const task = {
      subject,
      dueDate: formattedDueDate,
      status,
      priority,
      description,
    };

    TaskService.addTask(task)
      .then((response) => {
        //set the loading spinner and 1 second delay before redirect to /Tasks
        setTimeout(() => {
          setLoading(false);
          window.location.href = "/Tasks/myTasks";
        }, 1000);

        console.log(response.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          setGenericError(
            "An error occurred while adding the task. Please try again."
          );
          console.log(error);
        }
      });

    setLoading(true);
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "85vh",
      }}
    >
      {/* render the spinner after we have added the task */}
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
            Successfully added a new Task.
          </h4>
        </div>
      )}
      <div style={{ marginTop: "20px" }}>
        <div className="container-lg">
          {!loading && (
            <form
              onSubmit={addTask}
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
                  Task
                </h3>
                {/* Subject field */}
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
                {/* priority, status and due date fields */}
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
                        style={{ paddingBottom: "5px", fontSize: "22px" }}
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
                        style={{ paddingBottom: "5px", fontSize: "22px" }}
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
                        style={{ paddingBottom: "5px", fontSize: "22px" }}
                      />{" "}
                      Due Date:
                    </label>
                    <br />
                    <DatePicker
                      className="due-date"
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
                {/* description field */}
                <Row className="mt-4">
                  <Col>
                    <label htmlFor="description">
                      {" "}
                      <TbFileDescription style={{ fontSize: "18px" }} />{" "}
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
                      Characters Left:{" "}
                      {maxLengthDescription - description.length}
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
                  to="/Tasks/myTasks"
                  type="submit"
                  className="btn btn-outline-success"
                  onClick={(e) => addTask(e)}
                  style={{ marginBottom: "15px" }}
                >
                  <FaCheck style={{ marginRight: "5px" }} /> Add Task
                </Link>

                <Link
                  to="/Tasks/myTasks"
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

export default AddTask;
