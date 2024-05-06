import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import Footer from "./footer";
import Type from "./type";

const UnauthenticatedHome = () => {
  return (
    <div className="container">
      <Container fluid className="home-section" id="home">
        <Container className="home-content">
          <Row>
            <Col md={7} className="home-header">
              <h1 className="heading-name">
                Hello
                <strong className="main-name"> There!</strong>
              </h1>
              <div style={{ padding: 50, textAlign: "left", paddingTop: 20 }}>
                <Type />
                <Link
                  to="/signin"
                  className="starter btn btn-warning btn-lg mt-4"
                  variant="outline-warning"
                >
                  Get Started
                </Link>
              </div>
            </Col>
            <Col md={5} style={{ paddingBottom: 30 }}>
              <img
                src={process.env.PUBLIC_URL + "crm.png"}
                alt="home pic"
                className="img-fluid"
                style={{ maxHeight: "450px", paddingBottom: 30 }}
              />
            </Col>
          </Row>
        </Container>
      </Container>
      <Footer />
    </div>
  );
};

export default UnauthenticatedHome;
