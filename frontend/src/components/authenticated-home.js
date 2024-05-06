import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import {FaBuilding, FaCalendarAlt} from "react-icons/fa";
import AuthService from "../services/auth-service";
import HomeCards from "./home-components/home-cards";
import HomeTables from "./home-components/home-tables";
import HomeActivity from "./home-components/home-activity";

const AuthenticatedHome = () => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUsername(currentUser.username);
    }

  }, []);


  return (
    <Container>

      {/* Welcome message and Calendar button */}

      <Row className="align-items-center" style={{ marginTop: "30px" }}>
        <Col xs="auto">
          <FaBuilding size={40} style={{ color: "#313949" }} />
        </Col>
        <Col>
          {username && (
            <h5
              style={{
                marginLeft: "10px",
                color: "#313949",
                fontWeight: "bold",
              }}
            >
              Welcome {username}
            </h5>
          )}
        </Col>
        <Col xs="auto">
          <Button
            className="calendar-button btn btn-warning"
            variant="outline-light"
            href="/Calendar"
          >
            View your Calendar{" "}
            <FaCalendarAlt
              size={20}
              style={{ color: "white", marginLeft: "5px", marginBottom: "4px" }}
            />
          </Button>
        </Col>
      </Row>

      <HomeCards />
      <HomeTables />
      <HomeActivity />
      
    </Container>
  );
};

export default AuthenticatedHome;
