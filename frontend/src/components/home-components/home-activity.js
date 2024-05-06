import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { FaCheck, FaDatabase } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import { IoMdRemoveCircle } from "react-icons/io";
import { LuActivitySquare } from "react-icons/lu";
import {
  MdAddTask,
  MdCancel,
  MdEuro,
  MdOutlineTaskAlt,
  MdOutlineUpdate,
} from "react-icons/md";
import { PiCellSignalHighBold } from "react-icons/pi";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import ActivityService from "../../services/activity-service";
import CustomerService from "../../services/customer-service";
import PurchaseService from "../../services/purchase-service";
import SoftwareService from "../../services/software-service";
import TaskService from "../../services/task-service";

const HomeActivity = () => {
  const [highestPurchase, setHighestPurchase] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [latestCompletedTask, setLatestCompletedTask] = useState(null);
  const [activities, setActivities] = useState([]);
  const [monthlyPurchases, setMonthlyPurchases] = useState([]);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadMonthlyPurchases();
    findHighestPurchase();

    loadCompletedTasks();

    loadActivities();
  }, []);

  const loadCompletedTasks = async () => {
    try {
      const response = await TaskService.getMyTasks();
      setCompletedTasks(
        response.data.filter((task) => task.status === "Completed")
      );
      setTotalTasks(response.data.length);
      const lastCompletedTask = findLastCompletedTask(response.data);
      setLatestCompletedTask(lastCompletedTask);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const loadMonthlyPurchases = async () => {
    try {
      const response = await PurchaseService.getAllPurchases();
      const allPurchases = response.data;

      const currentDate = new Date();
      const currentMonthPurchases = allPurchases.filter((purchase) => {
        if (!purchase.purchaseDate) {
          console.error("Invalid date format for purchase:", purchase);
          return false;
        }

        const purchaseDateParts = purchase.purchaseDate.split("-");

        if (purchaseDateParts.length !== 3) {
          console.error("Invalid date format for purchase:", purchase);
          return false;
        }

        const formattedPurchaseDate = new Date(
          `${purchaseDateParts[2]}-${purchaseDateParts[1]}-${purchaseDateParts[0]}`
        );

        return (
          formattedPurchaseDate.getMonth() === currentDate.getMonth() &&
          formattedPurchaseDate.getFullYear() === currentDate.getFullYear()
        );
      });

      // Fetch additional data for each purchase (customer and software details)
      const enrichedPurchases = await Promise.all(
        currentMonthPurchases.map(async (purchase) => {
          try {
            const customerResponse = await CustomerService.getCustomer(
              purchase.customer.id
            );
            const softwareResponse = await SoftwareService.getSoftware(
              purchase.software.id
            );

            // Combine first and last name of the customer
            const customerName = `${customerResponse.data.fname} ${customerResponse.data.lname}`;

            return {
              ...purchase,
              customerName: customerName,
              softwareName: softwareResponse.data.name,
            };
          } catch (error) {
            console.error(
              "Error fetching additional data for purchase:",
              error
            );
            return null; // You may choose to handle this case differently
          }
        })
      );

      // Filter out null values in case of errors during additional data fetching
      const validEnrichedPurchases = enrichedPurchases.filter(
        (purchase) => purchase !== null
      );

      const highestPurchase = findHighestPurchase(currentMonthPurchases);

      setMonthlyPurchases(validEnrichedPurchases);
      setHighestPurchase(highestPurchase);
    } catch (error) {
      console.error("Error loading monthly purchases:", error);
    }
  };

  const findHighestPurchase = (purchases) => {
    if (!purchases || purchases.length === 0) {
      return null;
    }

    return purchases.reduce((maxPurchase, currentPurchase) => {
      return currentPurchase.price > maxPurchase.price
        ? currentPurchase
        : maxPurchase;
    }, purchases[0]);
  };

  const findLastCompletedTask = (completedTasks) => {
    if (completedTasks.length === 0) {
      return null;
    }

    // Sort completed tasks by completion timestamp in descending order
    const sortedCompletedTasks = [...completedTasks].sort((a, b) => {
      return new Date(b.completedTimestamp) - new Date(a.completedTimestamp);
    });

    return sortedCompletedTasks[sortedCompletedTasks.length - 1];
  };

  const loadActivities = async () => {
    try {
      const response = await ActivityService.getLatestActivities();
      const closestActivities = findClosestActivities(response.data, 10);
      setActivities(closestActivities);
    } catch (error) {
      console.error("Error loading activities:", error);
    }
  };

  const findClosestActivities = (activities, count) => {
    if (activities.length === 0) {
      return [];
    }

    const sortedActivities = [...activities].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    return sortedActivities.slice(0, count);
  };

  const deleteActivity = (id) => {
    setActivityToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    ActivityService.deleteActivity(activityToDelete)
      .then(() => {
        loadActivities();
        setShowModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Row>
        <Col>
          <div
            style={{
              display: "flex",
              marginTop: "20px",
              justifyContent: "center",
            }}
          >
            {highestPurchase ? (
              <Link
                to={`/Purchases/${highestPurchase.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card className="child-home-card" style={{ flex: "1" }}>
                  <Card.Body style={{ paddingTop: 10 }}>
                    <h5
                      style={{
                        boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                        textAlign: "center",
                        marginBottom: "15px",
                        backgroundColor: "#313949",
                        borderRadius: "50px",
                        height: "40px",
                        paddingTop: "6px",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        <PiCellSignalHighBold
                          style={{
                            marginBottom: "5px",
                            fontWeight: "bold",
                            color: "#12b569",
                            fontSize: "25px",
                          }}
                        />{" "}
                        {""} Highest Purchase
                      </span>
                    </h5>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Price:</span>
                      <span style={{ marginLeft: "5px", color: "#12b569" }}>
                        {`${highestPurchase.price}`}{" "}
                        <MdEuro style={{ marginBottom: "3px" }} />{" "}
                      </span>
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Software Name:</span>{" "}
                      <Link
                        to={`/Software/${highestPurchase.software.id}`}
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          transition: "color 0.3s",
                        }}
                        className="hover-gold"
                      >
                        {highestPurchase.software.name}
                      </Link>
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Customer:</span>{" "}
                      {highestPurchase.customer.name ? (
                        <Link
                          to={`/Companies/id/${highestPurchase.customer.id}`}
                          style={{
                            color: "inherit",
                            textDecoration: "none",
                            transition: "color 0.3s",
                          }}
                          className="hover-red"
                        >
                          {highestPurchase.customer.name}
                        </Link>
                      ) : (
                        <Link
                          to={`/Customers/${highestPurchase.customer.id}`}
                          style={{
                            color: "inherit",
                            textDecoration: "none",
                            transition: "color 0.3s",
                          }}
                          className="hover-red"
                        >
                          {highestPurchase.customer.fname}{" "}
                          {highestPurchase.customer.lname}
                        </Link>
                      )}
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Purchase Date:</span>
                      <span style={{ marginLeft: "5px" }}>
                        {highestPurchase.purchaseDate}
                      </span>
                    </p>
                  </Card.Body>
                </Card>
              </Link>
            ) : (
              <Card className="child-home-card text-center">
                <Card.Body>
                  <h5
                    style={{
                      fontWeight: "bold",
                      marginBottom: "20px",
                      marginTop: "20px",
                    }}
                  >
                    Highest Purchase
                  </h5>
                  <FaDatabase
                    style={{
                      fontSize: "50px",
                      color: "white",
                      marginLeft: "auto",
                      marginRight: "auto",
                      display: "block",
                    }}
                  />
                  <p style={{ color: "white", marginTop: "10px" }}>
                    No Purchases this Month yet
                  </p>
                </Card.Body>
              </Card>
            )}

            <Card
              className="child-home-card"
              style={{ marginLeft: "20px", flex: "1" }}
            >
              <Card.Body style={{ paddingTop: 10 }}>
                <h5
                  style={{
                    boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
                    textAlign: "center",
                    marginBottom: "15px",
                    backgroundColor: "#313949",
                    borderRadius: "50px",
                    height: "40px",
                    paddingTop: "6px",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    <MdOutlineTaskAlt
                      style={{
                        marginBottom: "5px",
                        fontWeight: "bold",
                        color: "#12b569",
                        fontSize: "25px",
                      }}
                    />{" "}
                    {""} Completed Tasks info
                  </span>
                </h5>

                <p>
                  <span style={{ fontWeight: "bold" }}>Count:</span>{" "}
                  {completedTasks.length}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Total Tasks Count:</span>{" "}
                  {totalTasks}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>
                    Percentage Completion:
                  </span>{" "}
                  <span
                    style={{
                      color:
                        totalTasks > 0
                          ? (completedTasks.length / totalTasks) * 100 >= 50
                            ? "#12b569"
                            : "red"
                          : "inherit",
                    }}
                  >
                    {totalTasks > 0
                      ? ((completedTasks.length / totalTasks) * 100).toFixed(
                          2
                        ) + "%"
                      : "-"}
                  </span>
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>
                    Latest Completed Task:
                  </span>{" "}
                  {latestCompletedTask ? (
                    <Link
                      id="completed"
                      to={`/Tasks/${latestCompletedTask.id}`}
                      style={{
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                      className="task-link"
                    >
                      View
                    </Link>
                  ) : (
                    "-"
                  )}
                </p>
              </Card.Body>
            </Card>
          </div>
        </Col>
        <Col>
          <Card.Body>
            <table
              className="activity table table-hover"
              style={{ marginTop: "20px" }}
            >
              <thead>
                <tr>
                  <th
                    style={{ width: "100%", textAlign: "center" }}
                    colSpan="2"
                    className="tasks-in-progress"
                  >
                    <LuActivitySquare style={{ marginBottom: "3px" }} /> Latest
                    Activities
                  </th>
                </tr>
              </thead>

              <tbody>
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div>
                            {activity.description.startsWith("Added") ? (
                              <MdAddTask
                                style={{
                                  marginRight: "5px",
                                  color: "#12b569",
                                  fontSize: "24px",
                                }}
                              />
                            ) : activity.description.startsWith("Updated") ? (
                              <MdOutlineUpdate
                                style={{
                                  marginRight: "5px",
                                  color: "#0dcaf0",
                                  fontSize: "24px",
                                }}
                              />
                            ) : activity.description.startsWith("Deleted") ||
                              activity.description.startsWith("Removed") ? (
                              <IoMdRemoveCircle
                                style={{
                                  marginRight: "5px",
                                  color: "#dc3545",
                                  fontSize: "24px",
                                }}
                              />
                            ) : (
                              <div style={{ width: "24px", height: "24px" }} />
                            )}
                          </div>
                          <div style={{ marginLeft: "10px" }}>
                            <strong>Subject:</strong> {activity.description}
                            <br />
                            <strong>Date:</strong>{" "}
                            {new Date(activity.date).toLocaleString()}
                          </div>
                        </div>
                        {/* Add your delete button here */}
                        <ImBin
                          className="bin"
                          style={{
                            color: "#dc3545",
                            fontSize: "25px",
                            cursor: "pointer",
                          }}
                          onClick={() => deleteActivity(activity.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ marginTop: "50px" }}>
                        <FaDatabase
                          style={{ fontSize: "50px", color: "white" }}
                        />
                        <p style={{ color: "white", marginTop: "10px" }}>
                          No activities yet
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card.Body>
        </Col>
      </Row>
      {activityToDelete && (
        <Modal
          className="delete-modal-style"
          isOpen={showModal}
          onRequestClose={closeModal}
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
          <h2>Delete Activity Confirmation</h2>
          <p>Are you sure you want to delete this activity ?</p>
          <div>
            <button className="btn btn-outline-success" onClick={confirmDelete}>
              <FaCheck style={{ marginRight: "5px" }} /> Yes
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={closeModal}
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

export default HomeActivity;
