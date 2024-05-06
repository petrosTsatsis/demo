import React, {useEffect, useState} from "react";
import {CgDanger} from "react-icons/cg";
import {FaCheck, FaDatabase} from "react-icons/fa";
import {ImBin} from "react-icons/im";
import {IoNotificationsCircle} from "react-icons/io5";
import {MdCancel} from "react-icons/md";
import Modal from "react-modal";
import NotificationsService from "../../services/notifications-service";

const NotificationPopover = () => {
  const [notifications, setNotifications] = React.useState([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    NotificationsService.MyNotifications()
      .then((response) => {
        const sortedNotifications = response.data.sort((b, a) => a.id - b.id);
        setNotifications(sortedNotifications);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNotificationClick = (notificationId) => {
    markNotificationAsRead(notificationId);
    window.location.href = `/Notifications/${notificationId}`;
  };

  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map((notification) => {
      if (notification.id === notificationId && !notification.status) {
        NotificationsService.updateNotification(notification.id, {
          ...notification,
          status: true,
        });

        return { ...notification, status: true };
      }

      return notification;
    });

    setNotifications(updatedNotifications);
  };

  const timeDifference = (timestamp) => {
    const currentDate = new Date();
    const notificationDate = new Date(timestamp);

    const diffInMilliseconds = currentDate - notificationDate;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMonths > 0) {
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    } else if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
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
        setPopoverOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      className="custom-popover"
      style={{
        position: "absolute",
        top: "50px",
        right: "160px",
        width: "400px",
        height: "500px",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "50px",
        boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
        color: "black",
      }}
    >
      {/* Close button */}
      <button
        style={{
          position: "absolute",
          top: "5px",
          right: "25px",
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
      <table
        className="home table table-hover"
        style={{ marginTop: "10px", backgroundColor: "white" }}
      >
        <thead>
          <tr>
            <h5
              style={{
                boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                textAlign: "center",
                backgroundColor: "#313949",
                color: "white",
                borderRadius: "50px",
                height: "40px",
                marginTop: "10px",
                marginRight: "5px",
                marginLeft: "5px",
                marginBottom: "25px",
              }}
            >
              {" "}
              <IoNotificationsCircle
                style={{ marginBottom: "4px", fontSize: "25px" }}
              />{" "}
              Notifications
            </h5>
          </tr>
        </thead>
        <tbody>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <tr key={notification.id} style={{ marginTop: "10px" }}>
                <td
                  style={{
                    paddingRight: "0px",
                    paddingLeft: "0px",
                    backgroundColor: "whitesmoke",
                    borderRadius: "50px",
                  }}
                >
                  <button
                    className="notificationButton"
                    style={{
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "center",
                      textDecoration: "none",
                      color: "inherit",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div style={{ textAlign: "right", marginLeft: "10px" }}>
                      {notification.status === false ? (
                        <CgDanger
                          style={{ color: "#ffc107", fontSize: "25px" }}
                        />
                      ) : (
                        <ImBin
                          className="bin"
                          style={{
                            color: "#dc3545",
                            fontSize: "25px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        />
                      )}
                    </div>
                    <div
                      className="content"
                      style={{ textAlign: "center", flex: 1 }}
                    >
                      {notification.content.length > 25
                        ? `${notification.content.slice(0, 25)}...`
                        : notification.content}
                    </div>
                    <div
                      className="date"
                      style={{
                        textAlign: "left",
                        marginRight: "5px",
                        color: "#ffc107",
                      }}
                    >
                      {timeDifference(notification.timestamp)}
                    </div>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                <div style={{ marginTop: "50px" }}>
                  <FaDatabase style={{ fontSize: "50px", color: "#313949" }} />
                  <p style={{ color: "#313949", marginTop: "10px" }}>
                    No Notifications yet
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

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

export default NotificationPopover;
