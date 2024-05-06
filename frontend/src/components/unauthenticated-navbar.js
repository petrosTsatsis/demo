import React from "react";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import NavItem from "react-bootstrap/esm/NavItem";
import {FaHome, FaTools} from "react-icons/fa";
import {Link} from "react-router-dom";
import "../App.js";

const UnauthenticatedNavbar = () => {
  return (
    <nav className="navbar" style={{ backgroundColor: "#313949" }}>
      <div className="container-md">
        <div className="d-flex align-items-center">
          <FaTools style={{ color: "white", marginRight: "5px" }} />
          <a className="navbar-brand" href="/">
            MyCrm
          </a>
        </div>
        <ul className="nav nav-underline">
          <NavItem>
            <Nav.Link as={Link} to="/">
              <FaHome style={{ marginBottom: "4px", marginRight: "3px" }} />{" "}
              {""} Home
            </Nav.Link>
          </NavItem>
        </ul>
        <ul className="nav nav-underline">
          <NavItem>
            <Nav.Link as={Link} to="/about">
              About us
            </Nav.Link>
          </NavItem>
        </ul>
        <ul className="nav nav-underline">
          <NavItem>
            <Nav.Link as={Link} to="/contact-us">
              Contact us
            </Nav.Link>
          </NavItem>
        </ul>

        <Nav.Item className="fork-btn">
          <Button as={Link} to="/signin" variant="outline-light">
            Sign in
          </Button>
        </Nav.Item>
      </div>
    </nav>
  );
};

export default UnauthenticatedNavbar;
