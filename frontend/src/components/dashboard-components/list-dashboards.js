import React, {useEffect, useState} from "react";
import {MdSpaceDashboard} from "react-icons/md";
import PercentageCircles from "./percentage-circles";

import Chart from "chart.js/auto";
import {useNavigate} from "react-router-dom";
import SoftwareLicenseService from "../../services/software-license-service";
import SoftwareService from "../../services/software-service";
import SslCertificateService from "../../services/ssl-certificate-service";
import BarChart from "./bar-chart";

const ListDashboards = () => {
  const navigate = useNavigate();
  const [softwareData, setSoftwareData] = useState([]);

  useEffect(() => {
    fetchActiveLicenses();
    fetchActiveCertificates();
    fetchPurchaseData();
  }, []);

  // fetch the purchase count of each software

  const fetchPurchaseData = async () => {
    try {
      const softwareResponse = await SoftwareService.getAllSoftware();
      const allSoftware = softwareResponse.data;

      const softwareMap = {};

      for (const software of allSoftware) {
        const purchaseResponse = await SoftwareService.getPurchases(
          software.id
        );
        const purchases = purchaseResponse.data;

        const purchaseCount = purchases.length;

        softwareMap[software.id] = {
          name: software.name,
          count: purchaseCount,
        };
      }

      console.log("Software Map:", softwareMap);

      const softwareData = Object.keys(softwareMap).map((key) => ({
        id: key,
        label: softwareMap[key].name,
        value: softwareMap[key].count,
      }));

      console.log("Software Data:", softwareData);

      setSoftwareData(softwareData);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  // fetch the active licenses

  const fetchActiveLicenses = () => {
    SoftwareLicenseService.getLicenses()
      .then((response) => {
        const allLicenses = response.data;

        const activeLicenses = allLicenses.filter(
          (license) => license.status === "Active"
        );

        const expirationMonths = activeLicenses.map((license) => {
          const expirationDateParts = license.expirationDate.split("-");
          const expirationDate = new Date(
            expirationDateParts[2],
            expirationDateParts[1] - 1,
            expirationDateParts[0]
          );
          if (isNaN(expirationDate.getTime())) {
            console.error(
              `Invalid expiration date for license ${license.id}: ${license.expirationDate}`
            );
            return null;
          }

          return expirationDate.toLocaleString("default", { month: "long" });
        });

        const validExpirationMonths = expirationMonths.filter(
          (month) => month !== null
        );

        console.log("License Expiration Months:", validExpirationMonths);

        renderLicenseChart(activeLicenses);
      })
      .catch((error) => {
        console.error("Error fetching licenses:", error);
      });
  };

  // fetch the active certificates

  const fetchActiveCertificates = () => {
    SslCertificateService.getCertificates()
      .then((response) => {
        const allCertificates = response.data;

        const activeCertificates = allCertificates.filter(
          (cert) => cert.status === "Active"
        );

        const expirationMonths = activeCertificates.map((cert) => {
          const expirationDateParts = cert.expirationDate.split("-");
          const expirationDate = new Date(
            expirationDateParts[2],
            expirationDateParts[1] - 1,
            expirationDateParts[0]
          );
          if (isNaN(expirationDate.getTime())) {
            console.error(
              `Invalid expiration date for certificate ${cert.id}: ${cert.expirationDate}`
            );
            return null;
          }

          return expirationDate.toLocaleString("default", { month: "long" });
        });

        const validExpirationMonths = expirationMonths.filter(
          (month) => month !== null
        );

        console.log("Certificate Expiration Months:", validExpirationMonths);

        renderCertificateChart(activeCertificates);
      })
      .catch((error) => {
        console.error("Error fetching certificates:", error);
      });
  };

  // create the licenses chart
  const renderLicenseChart = (licenses) => {
    const ctx = document.getElementById("licenseChart").getContext("2d");
    const expirationMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dataPoints = licenses.map((license) => {
      const expirationDateParts = license.expirationDate.split("-");
      const expirationDate = new Date(
        expirationDateParts[2],
        expirationDateParts[1] - 1,
        expirationDateParts[0]
      );
      const monthIndex = expirationDate.getMonth();

      return { x: monthIndex + 1, y: license.id.toString() };
    });

    const groupedData = dataPoints.reduce((acc, dataPoint) => {
      const { x, y } = dataPoint;
      acc[x] = acc[x] || [];
      acc[x].push(y);
      return acc;
    }, {});

    const flattenedData = expirationMonths
      .map((month, index) => {
        const licensesInMonth = groupedData[index + 1] || [];
        console.log(`Month: ${month}, Licenses: ${licensesInMonth.join(", ")}`);
        return licensesInMonth.map((license) => ({ x: month, y: license }));
      })
      .flat();

    const uniqueLicenseIds = Array.from(
      new Set(flattenedData.map((dataPoint) => dataPoint.y))
    ).sort((a, b) => b - a);

    const licenseChart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "License Expiration",
            data: flattenedData,
            borderColor: "#007FFF",
            borderWidth: 5,
          },
        ],
      },
      options: {
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
          },
        },
        scales: {
          y: {
            type: "category",
            position: "left",
            offset: false,
            labels: uniqueLicenseIds,
            ticks: {
              fontColor: "white",
              color: "white",
            },
          },
          x: {
            type: "category",
            position: "bottom",
            offset: true,
            labels: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            ticks: {
              fontColor: "white",
              color: "white",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const dataPoint = flattenedData[context.dataIndex];
                const licenseId = dataPoint.y;
                const license = licenses.find(
                  (license) => license.id === parseInt(licenseId)
                );
                const expirationDate = license.expirationDate;
                return ` License: ${license.name}, Expires at: ${expirationDate}`;
              },
            },
          },
        },
        onClick: (event, chartElement) => {
          if (chartElement.length > 0) {
            const index = chartElement[0].index;
            const licenseId = flattenedData[index].y;
            navigate(`/SoftwareLicenses/${licenseId}`);
          }
        },
      },
    });
  };

  // create the certificates chart

  const renderCertificateChart = (certificates) => {
    const ctx = document.getElementById("certificateChart").getContext("2d");
    const expirationMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dataPoints = certificates.map((cert) => {
      const expirationDateParts = cert.expirationDate.split("-");
      const expirationDate = new Date(
        expirationDateParts[2],
        expirationDateParts[1] - 1,
        expirationDateParts[0]
      );
      const monthIndex = expirationDate.getMonth();

      return { x: monthIndex + 1, y: cert.id.toString() };
    });

    const groupedData = dataPoints.reduce((acc, dataPoint) => {
      const { x, y } = dataPoint;
      acc[x] = acc[x] || [];
      acc[x].push(y);
      return acc;
    }, {});

    const flattenedData = expirationMonths
      .map((month, index) => {
        const certificatesInMonth = groupedData[index + 1] || [];
        console.log(
          `Month: ${month}, Certificates: ${certificatesInMonth.join(", ")}`
        );
        return certificatesInMonth.map((cert) => ({ x: month, y: cert }));
      })
      .flat();

    const uniqueCertificateIds = Array.from(
      new Set(flattenedData.map((dataPoint) => dataPoint.y))
    ).sort((a, b) => b - a);

    const certificateChart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Certificate Expiration",
            data: flattenedData,
            borderColor: "#007FFF",
            borderWidth: 5,
          },
        ],
      },
      options: {
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
          },
        },
        scales: {
          y: {
            type: "category",
            position: "left",
            offset: false,
            labels: uniqueCertificateIds,
            ticks: {
              fontColor: "white",
              color: "white",
            },
          },
          x: {
            type: "category",
            position: "bottom",
            offset: true,
            labels: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            ticks: {
              fontColor: "white",
              color: "white",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const dataPoint = flattenedData[context.dataIndex];
                const certificateId = dataPoint.y;
                const certificate = certificates.find(
                  (cert) => cert.id === parseInt(certificateId)
                );
                const expirationDate = certificate.expirationDate;
                return ` Certificate: ${certificate.type}, Expires at: ${expirationDate}`;
              },
            },
          },
        },
        onClick: (event, chartElement) => {
          if (chartElement.length > 0) {
            const index = chartElement[0].index;
            const certificateId = flattenedData[index].y;
            navigate(`/SSLCertificates/${certificateId}`);
          }
        },
      },
    });
  };

  return (
    <div className="container-fluid">
      <h3
        className="container-lg"
        style={{
          marginTop: "50px",
          boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
          color: "black",
          textAlign: "center",
          backgroundColor: "#313949",
          color: "white",
          borderRadius: "50px",
          height: "40px",
        }}
      >
        <MdSpaceDashboard
          style={{ marginRight: "10px", marginBottom: "3px" }}
        />
        Dashboards
      </h3>

      {/* Percentage Circles */}
      <PercentageCircles />

      {/* Active Licenses Dashboard */}

      <div style={{ marginTop: "80px" }}>
        <h3
          className="container-lg"
          style={{
            marginBottom: "35px",
            boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
            color: "black",
            textAlign: "center",
            backgroundColor: "#313949",
            color: "white",
            borderRadius: "50px",
            height: "40px",
          }}
        >
          Active Software Licenses Dashboard
        </h3>
        <canvas
          className="container-lg"
          id="licenseChart"
          style={{
            height: "500px",
            padding: 0,
            borderRadius: "10px",
          }}
        ></canvas>
      </div>

      {/* Active Certificates Dashboard */}

      <div style={{ marginTop: "80px" }}>
        <h3
          className="container-lg"
          style={{
            marginBottom: "35px",
            boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
            color: "black",
            textAlign: "center",
            backgroundColor: "#313949",
            color: "white",
            borderRadius: "50px",
            height: "40px",
          }}
        >
          Active SSL Certificates Dashboard
        </h3>
        <canvas
          className="container-lg"
          id="certificateChart"
          style={{
            height: "500px",
            padding: 0,
            borderRadius: "10px",
          }}
        ></canvas>
      </div>

      {/* Software Purchases Bar Dashboard */}

      <div
        className="container-md"
        style={{
          padding: 0,
          marginTop: "80px",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <h3
          className="container-lg"
          style={{
            marginBottom: "35px",
            boxShadow: "1px 1px 5px 3px rgba(0, 0, 0, 0.5)",
            color: "black",
            textAlign: "center",
            backgroundColor: "#313949",
            color: "white",
            borderRadius: "50px",
            height: "40px",
          }}
        >
          Software Purchases Dashboard
        </h3>
        <BarChart data={softwareData} />
      </div>
    </div>
  );
};

export default ListDashboards;
