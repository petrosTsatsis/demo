import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {FaCheck} from "react-icons/fa";
import {ImBin} from "react-icons/im";
import {MdCancel} from "react-icons/md";
import Modal from "react-modal";
import {Link, useLocation, useParams} from "react-router-dom";
import NotificationsService from "../../services/notifications-service";

const DetailsNotification = () => {
  const { id } = useParams();
  const location = useLocation();
  const [content, setContent] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [event, setEvent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  useEffect(() => {
    fetchNotification();
  }, [id]);

  // fetch the notification to display
  const fetchNotification = async () => {
    try {
      const response = await NotificationsService.getNotificationById(id);
      const notificationData = response.data;

      setContent(notificationData.content);
      setTimestamp(new Date(notificationData.timestamp).toLocaleString());
      setEvent(notificationData.event);
    } catch (error) {
      console.error("Error fetching notification:", error);
    }
  };

  // close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // show the delete notification confirmation modal
  const deleteNotification = (id) => {
    setNotificationToDelete(id);
    setShowDeleteModal(true);
  };

  // notification delete confirmation method
  const confirmDelete = () => {
    NotificationsService.deleteNotification(notificationToDelete)
      .then(() => {
        setShowDeleteModal(false);
        window.history.back();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div
      className="container-md"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <div className="notification-display" style={{ textAlign: "center" }}>
        <h3
          style={{
            boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
            textAlign: "center",
            marginBottom: "30px",
            backgroundColor: "#313949",
            color: "#daa520",
            borderRadius: "50px",
            height: "40px",
            marginTop: "15px",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        >
          {" "}
          Details{" "}
        </h3>
        <Row
          className="mt-4"
          style={{
            marginBottom: "20px",
            marginTop: "10px",
          }}
        >
          <Col className="d-flex justify-content-center align-items-center">
            <ImBin
              className="bin"
              style={{
                color: "#dc3545",
                fontSize: "30px",
                cursor: "pointer",
                marginBottom: "15px",
              }}
              onClick={() => deleteNotification(id)}
            />
          </Col>

          <Col className="d-flex justify-content-center align-items-center">
            <p
              style={{
                textAlign: "center",
                width: "320px",
                padding: "10px",
                border: "2px solid black",
                color: "black",
                borderRadius: "50px",
                marginRight: "80px",
              }}
            >
              {content}
            </p>{" "}
          </Col>
        </Row>
        <div style={{ fontWeight: "bold", color: "black" }}>
          <p>Notification sent at: {timestamp}</p>{" "}
        </div>
        <button
          className="btn btn-outline-danger"
          onClick={() => window.history.back()}
          style={{ marginRight: "10px" }}
        >
          Back
        </button>
        {event && (
          <Link to={`/Events/${event.id}`}>
            <button className="starter btn btn-warning">Go to Event</button>
          </Link>
        )}
      </div>

      {/* Modal that shows up for delete confirmation */}
      {notificationToDelete && (
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
              height: "220px",
              textAlign: "center",
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
          <h2>Delete Notification Confirmation</h2>
          <p>Are you sure you want to delete this notification ?</p>
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

export default DetailsNotification;
