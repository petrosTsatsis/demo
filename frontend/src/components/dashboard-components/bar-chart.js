import {Chart} from "chart.js";
import React, {useEffect, useRef} from "react";

const BarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      renderBarChart();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  // create the bar chart
  const renderBarChart = () => {
    const chartData = {
      labels: data.map((item) => item.label),
      datasets: [
        {
          label: "Number of Purchases",
          data: data.map((item) => item.value),
          backgroundColor: "orange",
          borderColor: "orange",
          borderWidth: 1,
          color: "white",
        },
      ],
    };

    const chartOptions = {
      scales: {
        y: {
          ticks: {
            stepSize: 1,
            fontColor: "white",
            color: "white",
          },
        },
        x: {
          ticks: {
            fontColor: "white",
            color: "white",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const softwareId = data[index].id;
          window.location.href = `/Software/${softwareId}`;
        }
      },
    };

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById("barChart").getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });
  };

  return (
    // return the dashboard
    <canvas
      id="barChart"
      className="container-lg"
      style={{
        height: "600px",
        borderRadius: "10px",
        padding: 10,
      }}
    />
  );
};

export default BarChart;
