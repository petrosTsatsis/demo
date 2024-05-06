import React, {useEffect, useState} from "react";
import {FaCheck, FaDatabase} from "react-icons/fa";
import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import {ImBin} from "react-icons/im";
import {IoIosAddCircleOutline} from "react-icons/io";
import {MdCancel, MdModeEdit, MdOutlineTaskAlt} from "react-icons/md";
import {TbListDetails, TbTargetArrow} from "react-icons/tb";
import Modal from "react-modal";
import {Link} from "react-router-dom";
import TaskService from "../../services/task-service";
import EditTaskModal from "./edit-task-modal";

const ListTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [currentPageTask, setCurrentPageTask] = React.useState(1);
  const [rowsPerPageTask, setRowsPerPageTask] = React.useState(5);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [clickedTask, setClickedTask] = useState(null);
  const [latestTask, setLatestTask] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // call the method that fetches the tasks
    fetchTasks();
  }, []);

  useEffect(() => {
    // find the task with the biggest id and set it as the last added task
    if (tasks.length > 0) {
      const maxIdTask = tasks.reduce((prev, current) =>
        prev.id > current.id ? prev : current
      );
      setLatestTask(maxIdTask);
    }
  }, [tasks]);

  // fetch all the tasks
  const fetchTasks = async () => {
    try {
      const response = await TaskService.getMyTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // function to open the edit modal
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // function to close the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  // handle the collapse component
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // when a checkbox is checked open the popover with the options for the specific task and close it when we remove the check
  const handleCheckboxChange = (taskId) => {
    if (selectedTaskId === taskId) {
      console.log("Unselecting task:", taskId);
      setSelectedTaskId(null);
      setPopoverOpen(false);
    } else {
      setSelectedTaskId(taskId);
      setPopoverOpen(true);
      const clickedTask = tasks.find((task) => task.id === taskId);
      setClickedTask(clickedTask);
    }
  };

  // close the popover and remove the check from the checkbox
  const handlePopoverClose = () => {
    setPopoverOpen(false);
    setClickedTask(null);
    setSelectedTaskId(null);
  };

  // method that is updating the tasks array with the new edit array after a task's edit
  const handleTaskUpdate = (updatedTask) => {
    // find the task
    const updatedIndex = tasks.findIndex((task) => task.id === updatedTask.id);

    if (updatedIndex !== -1) {
      const updatedTasks = [...tasks];
      updatedTasks[updatedIndex] = updatedTask;

      setTasks(updatedTasks);
    }
  };

  // view the task's details
  const handleViewTaskDetails = () => {
    if (latestTask) {
      window.location.href = `/Tasks/${latestTask.id}`;
    }
  };

  // view the selected task's details
  const handleViewSelectedTaskDetails = () => {
    if (selectedTaskId) {
      window.location.href = `/Tasks/${selectedTaskId}`;
    }
  };

  // show the delete task confirmation modal
  const deleteTask = (id) => {
    setTaskToDelete(id);
    setShowDeleteModal(true);
  };

  // task delete confirmation method
  const confirmDelete = () => {
    TaskService.deleteTask(taskToDelete)
      .then(() => {
        fetchTasks();
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // method that sorts the tasks by the due date
  const sortByDueDate = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const dateA = new Date(a.dueDate.split("-").reverse().join("-"));
      const dateB = new Date(b.dueDate.split("-").reverse().join("-"));
      return dateA - dateB;
    });
    setTasks(sortedTasks);
  };

  // method that sorts the tasks by the priority
  const sortByPriority = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };

      const priorityA = priorityOrder[a.priority] || 0;
      const priorityB = priorityOrder[b.priority] || 0;

      return priorityB - priorityA;
    });

    setTasks(sortedTasks);
  };

  // default sorting
  const sortByTaskId = () => {
    const sortedTasks = [...tasks].sort((a, b) => a.id - b.id);
    setTasks(sortedTasks);
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

  const handlePageChangeTask = (newPage) => {
    setCurrentPageTask((prevPage) => {
      const totalPages = Math.ceil(tasks.length / rowsPerPageTask);
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
  const currentRowsTask = tasks.slice(indexOfFirstRowTask, indexOfLastRowTask);

  return (
    // container that contains : add task button, popover for task, tasks table, latest task added
    <div className="container-fluid">
      <div className="row" style={{ marginTop: "60px" }}>
        <div
          className="col-md-2 d-flex justify-content-center"
          style={{ marginTop: "83px" }}
        >
          {/* add task button  */}
          <div>
            <Link to="/Tasks/add-task" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "220px",
                  backgroundColor: "rgb(76, 101, 151) ",
                  padding: "10px",
                  borderRadius: "15px",
                  boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.5)",
                  color: "white",
                  border: "none",
                  marginBottom: "33px",
                  cursor: "pointer",
                }}
              >
                Add Task{" "}
                <IoIosAddCircleOutline
                  style={{ fontSize: "20px", marginBottom: "2px" }}
                />{" "}
              </button>
            </Link>

            {/* popover for each task  */}
            {popoverOpen && clickedTask && (
              <div
                className="popover"
                style={{
                  width: "220px",
                  backgroundColor: "#313949",
                  padding: "10px",
                  borderRadius: "15px",
                  boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.5)",
                  color: "white",
                  height: "300px",
                }}
              >
                {/* popover's content  */}
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
                  onClick={handlePopoverClose}
                >
                  X
                </button>

                <div
                  className="popover-content"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <h6 style={{ marginBottom: "50px" }}>
                    <MdOutlineTaskAlt
                      style={{
                        marginRight: "4px",
                        color: "#2a8ffa",
                        fontSize: "18px",
                        marginBottom: "3px",
                      }}
                    />
                    {clickedTask.subject}
                  </h6>

                  {/* view details popover button */}
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    style={{ marginBottom: "10px" }}
                    onClick={handleViewSelectedTaskDetails}
                  >
                    View Details
                    <TbListDetails
                      style={{
                        marginLeft: "4px",
                        marginBottom: "3px",
                        fontSize: "18px",
                      }}
                    />
                  </button>

                  {/* edit task popover button  */}
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    style={{ marginBottom: "10px" }}
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

                  {/* render the EditTaskModal when we click the edit button*/}
                  <EditTaskModal
                    isOpen={showEditModal}
                    onRequestClose={handleCloseModal}
                    task={clickedTask}
                    onTaskUpdate={handleTaskUpdate}
                  />

                  {/* delete task popover button  */}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    style={{ marginBottom: "10px" }}
                    onClick={() => deleteTask(selectedTaskId)}
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
              </div>
            )}
          </div>
        </div>

        {/* task table field */}
        <div className="col-md-8">
          <div className="components-table">
            <h3
              style={{
                boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                color: "black",
                textAlign: "center",
                marginBottom: "40px",
                backgroundColor: "#313949",
                color: "white",
                borderRadius: "50px",
                height: "40px",
              }}
            >
              <TbTargetArrow
                style={{ marginRight: "10px", marginBottom: "3px" }}
              />
              Tasks
            </h3>
            <table
              className="components table table-striped table-hover"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={{ width: "10%" }} scope="col">
                    Select
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
                {tasks.length > 0 ? (
                  currentRowsTask.map((task, index) => (
                    <tr key={index}>
                      <td style={{ width: "10%" }}>
                        <div
                          className="form-check"
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedTaskId === task.id}
                            onChange={() => handleCheckboxChange(task.id)}
                          />
                        </div>
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
                          style={{ fontSize: "50px", color: "white" }}
                        />
                        <p style={{ color: "white", marginTop: "10px" }}>
                          No Tasks yet
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
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <button
                          className="carousel-button"
                          disabled={indexOfLastRowTask >= tasks.length}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChangeTask(currentPageTask + 1);
                          }}
                        >
                          <GrFormNext
                            style={{ fontSize: "30px", color: "white" }}
                          />
                        </button>
                        <span style={{ marginLeft: "10px", color: "white" }}>
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
        </div>
        {/* collapse field with the latest task */}
        <div
          className="col-md-2 d-flex justify-content-center"
          style={{ marginTop: "83px" }}
        >
          <div
            className="accordion"
            id="accordionExample"
            style={{ width: "220px" }}
          >
            <div className="accordion-item">
              {/* collapse content  */}
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSoftware"
                  aria-expanded={isCollapsed ? "true" : "false"}
                  aria-controls="collapseSoftware"
                  onClick={toggleCollapse}
                  style={{ width: "220px" }}
                  color="white"
                >
                  Latest Addition
                </button>
              </h2>
              <div
                id="collapseSoftware"
                className={`accordion-collapse collapse ${
                  isCollapsed ? "show" : ""
                }`}
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div
                  className="accordion-body"
                  style={{ width: "220px", minHeight: "323px" }}
                >
                  {/* if we have at least one task show some fields */}
                  {tasks.length > 0 ? (
                    latestTask && (
                      <div>
                        <p style={{ marginBottom: "20px", marginTop: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Subject:</span>{" "}
                          {latestTask.subject}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Priority:</span>{" "}
                          <span
                            style={{
                              color: getPriorityTextColor(latestTask.priority),
                            }}
                          >
                            {latestTask.priority}
                          </span>
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Due Date:</span>{" "}
                          {latestTask.dueDate}
                        </p>
                        <p style={{ marginBottom: "20px" }}>
                          <span style={{ fontWeight: "bold" }}>Status:</span>{" "}
                          <span
                            style={{ color: getStatusColor(latestTask.status) }}
                          >
                            {latestTask.status}
                          </span>
                        </p>

                        {/* button to view the task's details */}
                        <button
                          type="button"
                          className="btn btn-outline-warning"
                          style={{ marginTop: "10px" }}
                          onClick={handleViewTaskDetails}
                        >
                          View Details{" "}
                          <TbListDetails
                            style={{
                              marginLeft: "4px",
                              marginBottom: "3px",
                              fontSize: "18px",
                            }}
                          />{" "}
                        </button>
                      </div>
                    )
                  ) : (
                    <div style={{ marginTop: "50px", textAlign: "center" }}>
                      <FaDatabase
                        style={{ fontSize: "50px", color: "white" }}
                      />
                      <p style={{ color: "white", marginTop: "10px" }}>
                        No Tasks yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal that shows up for delete confirmation */}
      {taskToDelete && (
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
          <h2>Delete Task Confirmation</h2>
          <p>Are you sure you want to delete this task ?</p>
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

export default ListTasks;
