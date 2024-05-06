import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {CircularProgressbar} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ContactService from "../../services/contact-service";
import SoftwareLicenseService from "../../services/software-license-service";
import SSLCertificateService from "../../services/ssl-certificate-service";
import TaskService from "../../services/task-service";

const PercentageCircles = () => {
  const [completedTasksPercentage, setCompletedTasksPercentage] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [highPriorityContactsPercentage, setHighPriorityContactsPercentage] =
    useState(0);
  const [highPriorityTasksPercentage, setHighPriorityTasksPercentage] =
    useState(0);
  const [totalContacts, setTotalContacts] = useState(0);
  const [activeCertificatesPercentage, setActiveCertificatesPercentage] =
    useState(0);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [activeLicensesPercentage, setActiveLicensesPercentage] = useState(0);
  const [totalLicenses, setTotalLicenses] = useState(0);

  useEffect(() => {
    fetchCompletedTasks();

    fetchHighPriorityTasks();

    fetchHighPriorityContacts();

    fetchActiveCertificates();

    fetchActiveLicenses();
  }, []);

  // function to fetch the completed Tasks

  const fetchCompletedTasks = async () => {
    try {
      const response = await TaskService.getMyTasks();
      const completedTasks = response.data.filter(
        (task) => task.status === "Completed"
      );
      const totalTasksCount = response.data.length;
      const percentage = totalTasksCount
        ? Math.round((completedTasks.length / totalTasksCount) * 100 * 100) /
          100
        : 0;
      setCompletedTasksPercentage(percentage);
      setTotalTasks(totalTasksCount);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // function to fetch the high priority Tasks

  const fetchHighPriorityTasks = async () => {
    try {
      const response = await TaskService.getMyTasks();
      const highTasks = response.data.filter(
        (task) => task.priority === "High"
      );
      const totalTasksCount = response.data.length;
      const percentage = totalTasksCount
        ? Math.round((highTasks.length / totalTasksCount) * 100 * 100) / 100
        : 0;
      setHighPriorityTasksPercentage(percentage);
      setTotalTasks(totalTasksCount);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // function to fetch the high priority contacts
  const fetchHighPriorityContacts = async () => {
    try {
      const response = await ContactService.getMyContacts();
      const highContacts = response.data.filter(
        (contact) => contact.priority === "High"
      );
      const totalContactsCount = response.data.length;
      const percentage = totalContactsCount
        ? Math.round((highContacts.length / totalContactsCount) * 100 * 100) /
          100
        : 0;
      setHighPriorityContactsPercentage(percentage);
      setTotalContacts(totalContactsCount);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // function to fetch the active certificates

  const fetchActiveCertificates = async () => {
    try {
      const response = await SSLCertificateService.getCertificates();
      const activeCertificates = response.data.filter(
        (certificate) => certificate.status === "Active"
      );
      const totalCertificatesCount = response.data.length;
      const percentage = totalCertificatesCount
        ? Math.round(
            (activeCertificates.length / totalCertificatesCount) * 100 * 100
          ) / 100
        : 0;
      setActiveCertificatesPercentage(percentage);
      setTotalCertificates(totalCertificatesCount);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  // function to fetch the active licenses

  const fetchActiveLicenses = async () => {
    try {
      const response = await SoftwareLicenseService.getLicenses();
      const activeLicenses = response.data.filter(
        (license) => license.status === "Active"
      );
      const totalLicensesCount = response.data.length;
      const percentage = totalLicensesCount
        ? Math.round((activeLicenses.length / totalLicensesCount) * 100 * 100) /
          100
        : 0;
      setActiveLicensesPercentage(percentage);
      setTotalLicenses(totalLicensesCount);
    } catch (error) {
      console.error("Error fetching licenses:", error);
    }
  };

  return (
    <div
      className="container-md d-flex justify-content-center align-items-center"
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
      <Row
        className="h-100 justify-content-center align-items-center"
        style={{ marginTop: "30px", marginBottom: "30px" }}
      >
        <Col>
          <div style={{ width: "150px", height: "230px", marginRight: "70px" }}>
            <h5 style={{ marginBottom: "15px" }}>Completed Tasks</h5>
            <CircularProgressbar
              value={completedTasksPercentage}
              text={`${completedTasksPercentage}%`}
              styles={{
                path: {
                  stroke: "#03C03C",
                },
                text: {
                  fill: "#03C03C",
                },
              }}
            />
          </div>
        </Col>
        <Col>
          <div style={{ width: "150px", height: "230px", marginRight: "70px" }}>
            <h5 style={{ marginBottom: "15px" }}>High Priority Tasks</h5>
            <CircularProgressbar
              value={highPriorityTasksPercentage}
              text={`${highPriorityTasksPercentage}%`}
              styles={{
                path: {
                  stroke: "#03C03C",
                },
                text: {
                  fill: "#03C03C",
                },
              }}
            />
          </div>
        </Col>
        <Col>
          <div style={{ width: "150px", height: "230px", marginRight: "70px" }}>
            <h5 style={{ marginBottom: "15px" }}>Active SSL Certificates</h5>
            <CircularProgressbar
              value={activeCertificatesPercentage}
              text={`${activeCertificatesPercentage}%`}
              styles={{
                path: {
                  stroke: "#03C03C",
                },
                text: {
                  fill: "#03C03C",
                },
              }}
            />
          </div>
        </Col>
        <Col>
          <div style={{ width: "150px", height: "230px", marginRight: "70px" }}>
            <h5 style={{ marginBottom: "15px" }}>Active Software Licenses</h5>
            <CircularProgressbar
              value={activeLicensesPercentage}
              text={`${activeLicensesPercentage}%`}
              styles={{
                path: {
                  stroke: "#03C03C",
                },
                text: {
                  fill: "#03C03C",
                },
              }}
            />
          </div>
        </Col>
        <Col>
          <div style={{ width: "150px", height: "230px" }}>
            <h5 style={{ marginBottom: "15px" }}>High Priority Contacts</h5>
            <CircularProgressbar
              value={highPriorityContactsPercentage}
              text={`${highPriorityContactsPercentage}%`}
              styles={{
                path: {
                  stroke: "#03C03C",
                },
                text: {
                  fill: "#03C03C",
                },
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PercentageCircles;
