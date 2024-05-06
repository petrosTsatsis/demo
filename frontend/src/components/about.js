import React from "react";
import "../App.css";
import Footer from "./footer";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-image">
        <img src="/about-us-v2.png" alt="About" />
      </div>
      <div className="text-container-about">
        <h1>About us</h1>
        <p>
          myCrm is the ultimate tool to organize customers, software, view the
          history of purchases for each customer, keep contact points and book
          appointments with customers. Save SSL certificates, software licenses,
          and view dashboards based on their status. myCrm can give a new taste
          in the organization section.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
