import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import NavItem from "react-bootstrap/esm/NavItem";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { BsBuildingsFill } from "react-icons/bs";
import {
  FaCertificate,
  FaHome,
  FaTools,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { GrCloudSoftware } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { IoIosContacts, IoMdContact } from "react-icons/io";
import {
  MdHomeRepairService,
  MdNotifications,
  MdSpaceDashboard,
} from "react-icons/md";
import { TbLicense, TbTargetArrow } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import NotificationService from "../services/notifications-service";
import UserService from "../services/user-service";
import NotificationPopover from "./notification-components/notifications-popover";

const AuthenticatedNavbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const bellRef = useRef(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const response = await UserService.getCurrentUser();
      console.log(response.data);
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchNotificationCount = () => {
    NotificationService.MyNotifications()
      .then((response) => {
        const notificationsWithStatusFalse = response.data.filter(
          (notification) => notification.status === false
        );
        const count = notificationsWithStatusFalse.length;
        setNotificationCount(count);
      })
      .catch((error) => {
        console.error("Error fetching notification count: " + error);
      });
  };

  useEffect(() => {
    fetchNotificationCount();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
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
  }, [popoverOpen]);

  const handleNotificationsClick = () => {
    if (bellRef.current) {
      bellRef.current.classList.add("bounce");
      setTimeout(() => {
        bellRef.current.classList.remove("bounce");
      }, 1000);
    }
    setPopoverOpen(!popoverOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/signin");
  };

  useEffect(() => {
    const offcanvasNavbarDark = document.getElementById("offcanvasNavbarDark");
    offcanvasNavbarDark.addEventListener(
      "shown.bs.offcanvas",
      handleOffcanvasShown
    );
    offcanvasNavbarDark.addEventListener(
      "hidden.bs.offcanvas",
      handleOffcanvasHidden
    );

    return () => {
      offcanvasNavbarDark.removeEventListener(
        "shown.bs.offcanvas",
        handleOffcanvasShown
      );
      offcanvasNavbarDark.removeEventListener(
        "hidden.bs.offcanvas",
        handleOffcanvasHidden
      );
    };
  }, []);

  const handleOffcanvasShown = () => {
    document.body.classList.add("offcanvas-open");
  };

  const handleOffcanvasHidden = () => {
    document.body.classList.remove("offcanvas-open");
    const backdrop = document.querySelector(".offcanvas-backdrop.show");
    if (backdrop) {
      backdrop.style.opacity = "0.0";
    }
  };

  return (
    <nav
      className="sticky-top navbar"
      style={{ backgroundColor: "#313949" }}
      aria-label="Dark offcanvas navbar"
    >
      <div className="container-md">
        <div className="d-flex align-items-center">
          <FaTools style={{ color: "white", marginRight: "5px" }} />
          <a className="navbar-brand" href="/home">
            MyCrm
          </a>
        </div>
        <ul className="nav nav-underline">
          <NavItem>
            <Nav.Link as={Link} to="/home">
              <FaHome style={{ marginBottom: "4px", marginRight: "3px" }} />{" "}
              {""} Home
            </Nav.Link>
          </NavItem>
        </ul>

        <ul className="nav nav-underline">
          <NavItem>
            <Nav.Link as={Link} to="/Contacts/myContacts">
              <IoMdContact style={{ marginBottom: "4px" }} /> {""} Contacts
            </Nav.Link>
          </NavItem>
        </ul>

        <ul className="nav nav-underline">
          <NavItem>
            <Nav.Link as={Link} to="/Customers">
              <FaUser style={{ marginBottom: "4px" }} /> {""} Customers
            </Nav.Link>
          </NavItem>
        </ul>

        <ul className="nav nav-underline">
          <NavItem>
            <Nav.Link as={Link} to="/Purchases">
              <BiSolidPurchaseTag style={{ marginBottom: "4px" }} /> {""}{" "}
              Purchases
            </Nav.Link>
          </NavItem>
        </ul>

        <ul className="nav nav-underline">
          <NavItem>
            <Nav.Link as={Link} to="/Tasks/myTasks">
              <TbTargetArrow style={{ marginBottom: "4px" }} /> {""} Tasks
            </Nav.Link>
          </NavItem>
        </ul>
        <ul className="nav nav-underline">
          <NavItem>
            <Nav.Link as={Link} to="/Software">
              <GrCloudSoftware style={{ marginBottom: "4px" }} /> {""} Software
            </Nav.Link>
          </NavItem>
        </ul>

        <Nav.Item>
          <a className="nav-link" onClick={handleNotificationsClick}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <MdNotifications
                style={{
                  marginBottom: "2px",
                  fontSize: "28px",
                  color: "goldenrod",
                }}
              />
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{
                  fontSize: "14px",
                  backgroundColor: "white",
                  color: "#313949",
                }}
              >
                {notificationCount}
                <span className="visually-hidden">unread messages</span>
              </span>
            </div>
          </a>
        </Nav.Item>

        {/* Popover */}
        {popoverOpen && <NotificationPopover />}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbarDark"
          aria-controls="offcanvasNavbarDark"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end text-bg-dark"
          tabindex="-1"
          id="offcanvasNavbarDark"
          aria-labelledby="offcanvasNavbarDarkLabel"
        >
          <div
            className="offcanvas-header"
            style={{ backgroundColor: "#313949" }}
          >
            <h5 className="offcanvas-title" id="offcanvasNavbarDarkLabel">
              <MdHomeRepairService style={{ marginBottom: "4px" }} /> {""} More
              Services
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div
            className="offcanvas-body"
            style={{ backgroundColor: "#313949" }}
          >
            <ul className="nav nav-underline">
              <NavItem style={{ marginBottom: "15px" }}>
                <Nav.Link href="/SslCertificates">
                  <FaCertificate style={{ marginBottom: "4px" }} /> {""} Ssl
                  Certificates
                </Nav.Link>
              </NavItem>
            </ul>
            <ul className="nav nav-underline">
              <NavItem style={{ marginBottom: "15px" }}>
                <Nav.Link href="/SoftwareLicenses">
                  <TbLicense style={{ marginBottom: "4px" }} /> {""} Software
                  Licenses
                </Nav.Link>
              </NavItem>
            </ul>
            <ul className="nav nav-underline">
              <NavItem style={{ marginBottom: "15px" }}>
                <Nav.Link href="/Companies">
                  <BsBuildingsFill style={{ marginBottom: "4px" }} /> {""}{" "}
                  Companies
                </Nav.Link>
              </NavItem>
            </ul>
            <ul className="nav nav-underline">
              <NavItem style={{ marginBottom: "15px" }}>
                <Nav.Link href="/Dashboards">
                  <MdSpaceDashboard style={{ marginBottom: "4px" }} /> {""}{" "}
                  Dashboards
                </Nav.Link>
              </NavItem>
            </ul>
            <ul className="nav nav-underline">
              <NavItem style={{ marginBottom: "15px" }}>
                <Nav.Link href="/Profile">
                  <ImProfile style={{ marginBottom: "4px" }} /> {""} Profile
                </Nav.Link>
              </NavItem>
            </ul>
            <ul className="nav nav-underline">
              {currentUser &&
                currentUser.roles.some(
                  (role) => role.name === "ROLE_ADMIN"
                ) && (
                  <NavItem style={{ marginBottom: "15px" }}>
                    <Nav.Link href="/Users">
                      {" "}
                      <FaUsers style={{ marginBottom: "4px" }} /> {""}
                      Users
                    </Nav.Link>
                  </NavItem>
                )}
            </ul>

            <ul className="nav nav-underline">
              {currentUser &&
                currentUser.roles.some(
                  (role) => role.name === "ROLE_ADMIN"
                ) && (
                  <NavItem style={{ marginBottom: "15px" }}>
                    <Nav.Link href="/Contacts">
                      {" "}
                      <IoIosContacts style={{ marginBottom: "2px" }} /> {""}
                      Total Contacts
                    </Nav.Link>
                  </NavItem>
                )}
            </ul>
            <ul className="nav nav-underline">
              <NavItem style={{ marginBottom: "15px" }}>
                <Nav.Link href="/contact-us">Contact us</Nav.Link>
              </NavItem>
            </ul>
            <ul className="nav nav-underline">
              <NavItem style={{ marginBottom: "15px" }}>
                <Nav.Link href="/about">About us</Nav.Link>
              </NavItem>
            </ul>
            <Nav.Item className="fork-btn" style={{ marginBottom: "15px" }}>
              <Button variant="outline-danger" onClick={handleLogout}>
                Sign out
              </Button>
            </Nav.Item>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthenticatedNavbar;
