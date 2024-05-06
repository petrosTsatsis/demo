import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  AiFillGithub,
  AiFillInstagram,
  AiOutlineTwitter,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatTime = (time) => {
    const hours = time.getHours();
    const minutes =
      time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    const seconds =
      time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
  };

  let date = new Date();
  let year = date.getFullYear();

  const iconStyle = { color: "#313949" };

  return (
    <Container fluid className="footer">
      <Row>
        <Col
          md={4}
          className="d-flex justify-content-center align-items-center"
        >
          <h3 className="clock">{formatTime(currentTime)}</h3>
        </Col>
        <Col
          md={4}
          className="d-flex justify-content-center align-items-center"
        >
          <h3>Copyright © {year} MyCRM</h3>
        </Col>
        <Col
          md={4}
          className="d-flex justify-content-center align-items-center"
        >
          <ul className="footer-icons">
            <li className="social-icons">
              <a target="_blank" rel="noopener noreferrer">
                <AiFillGithub style={iconStyle} />
              </a>
            </li>
            <li className="social-icons">
              <a target="_blank" rel="noopener noreferrer">
                <AiOutlineTwitter style={iconStyle} />
              </a>
            </li>
            <li className="social-icons">
              <a target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn style={iconStyle} />
              </a>
            </li>
            <li className="social-icons">
              <a target="_blank" rel="noopener noreferrer">
                <AiFillInstagram style={iconStyle} />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
