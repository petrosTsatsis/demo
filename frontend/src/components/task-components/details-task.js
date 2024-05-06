import React, {useEffect, useState} from "react";
import {Card, CardBody, Col, Row} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import {FaCheck, FaUser} from "react-icons/fa";
import {ImBin} from "react-icons/im";
import {MdCancel, MdEmail, MdLowPriority, MdModeEdit} from "react-icons/md";
import {TbFileDescription, TbTargetArrow} from "react-icons/tb";
import Modal from "react-modal";
import {useParams} from "react-router-dom";
import TaskService from "../../services/task-service";
import EditTaskModal from "./edit-task-modal";

const DetailsTask = () => {
  const [tasks, setTasks] = useState([]);
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [task, setTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchTask();
  }, [id]);

  // fetch all the tasks
  const fetchTasks = async () => {
    try {
      const response = await TaskService.getMyTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // fetch the task to display
  const fetchTask = async () => {
    try {
      const response = await TaskService.getTask(id);
      const taskData = response.data;

      setTask(taskData);
      setSubject(taskData.subject);
      setPriority(taskData.priority);
      setDescription(taskData.description);
      setStatus(taskData.status);
      setDueDate(taskData.dueDate);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  // function to open the edit modal
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // function to close the edit modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    fetchTask();
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // method that is updating the tasks array with the new edit array after a task's edit
  const handleTaskUpdate = (updatedTask) => {
    // Update the task state with the edited data
    setTask(updatedTask);

    // Find the index of the updated task in the tasks array
    const updatedIndex = tasks.findIndex((task) => task.id === updatedTask.id);

    if (updatedIndex !== -1) {
      const updatedTasks = [...tasks];
      updatedTasks[updatedIndex] = updatedTasks;

      // Update the tasks state with the updated array
      setTasks(updatedTasks);
    }
  };
  // show the delete task confirmation modal
  const deleteTask = (id) => {
    setTaskToDelete(id);
    setShowDeleteModal(true);
  };

  // purchase delete confirmation method
  const confirmDelete = () => {
    TaskService.deleteTask(taskToDelete)
      .then(() => {
        fetchTasks();
        setShowDeleteModal(false);
        window.location.href = "/Tasks/MyTasks";
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        <TbTargetArrow style={{ marginRight: "10px", marginBottom: "3px" }} />
        Task Details
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
        <div style={{ position: "absolute", top: "150px" }}>
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
          {/* render the EditTaskModal when we click the edit button*/}
          <EditTaskModal
            isOpen={showEditModal}
            onRequestClose={handleCloseModal}
            task={task}
            onTaskUpdate={handleTaskUpdate}
          />
          <button
            type="button"
            className="btn btn-outline-danger"
            style={{ marginBottom: "10px" }}
            onClick={() => deleteTask(id)}
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

        {/* Subject, priority and status fields */}
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
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
            >
              <strong>
                {" "}
                <FaUser
                  style={{ paddingBottom: "5px", fontSize: "18px" }}
                />{" "}
                Subject:
              </strong>{" "}
              {subject}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
            >
              <strong>
                {" "}
                <FaUser
                  style={{ paddingBottom: "5px", fontSize: "18px" }}
                />{" "}
                Status:
              </strong>{" "}
              {status}
            </p>{" "}
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <p
              className="customer-detail-fields"
              style={{ textAlign: "center", width: "300px", padding: "10px" }}
            >
              <strong>
                {" "}
                <MdLowPriority
                  style={{ paddingBottom: "5px", fontSize: "18px" }}
                />{" "}
                Priority:
              </strong>{" "}
              {priority}
            </p>{" "}
          </Col>
        </Row>

        {/* description field */}
        <Row
          className="mt-4"
          style={{
            marginTop: "20px",
            marginBottom: "50px",
            marginLeft: "150px",
          }}
        >
          <Col className="text-center">
            <Card style={{ backgroundColor: "transparent", border: "none" }}>
              <CardBody
                className="customer-detail-fields"
                style={{
                  width: "900px",
                  margin: "0 auto",
                  padding: "10px",
                  height: "150px",

                  backgroundColor: "transparent",
                  marginLeft: "50px",
                }}
              >
                <strong>
                  {" "}
                  <TbFileDescription
                    style={{ paddingBottom: "1px", fontSize: "18px" }}
                  />{" "}
                  Description:
                </strong>{" "}
                {description}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Due Date field */}
        <Row
          className="mt-4"
          style={{
            marginTop: "20px",
            marginBottom: "50px",
          }}
        >
          <Col className="text-center">
            <p
              className="customer-detail-fields"
              style={{
                width: "300px",
                margin: "0 auto",
                padding: "10px",
                marginBottom: "20px",
              }}
            >
              <strong>
                {" "}
                <MdEmail
                  style={{ paddingBottom: "1px", fontSize: "18px" }}
                />{" "}
                Due Date:
              </strong>{" "}
              {dueDate}
            </p>
          </Col>
        </Row>
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

export default DetailsTask;
