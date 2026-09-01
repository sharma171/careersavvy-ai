import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";

const VacancyLineChart = () => {
  const [graphData, setGraphData] = useState({ jobsApplied: [], jobsAvailable: [] });
  const userEmail = useSelector((state) => state.auth.auth.email);
  const dashapi = 'https://us-east1-foursssolutions.cloudfunctions.net/user_recent_activities';

  

  useEffect(() => {
    if (userEmail) {
      // fetchGraph();
    }
  }, [userEmail]);

  const chartData = {
    defaultFontFamily: "Poppins",
    labels: graphData.labels || [], // Using labels from the combined dates
    datasets: [
      {
        label: "Jobs Applied",
        data: graphData.jobsApplied || [], // Using data from jobs_applied
        borderColor: "#3b4cb8",
        tension: 0.4,
        borderWidth: "5",
      },
      {
        label: "Jobs Available",
        data: graphData.jobsAvailable || [], // Using data from jobs_available
        borderColor: "rgba(27, 208, 132, 1)",
        borderWidth: "5",
        backgroundColor: "transparent",
        tension: 0.4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: false,
    },
    tooltips: {
      intersect: false,
    },
    hover: {
      intersect: true,
    },
    scales: {
      y: {
        max: 150, // Adjust the max value based on your data
        min: 0,
        ticks: {
          beginAtZero: true,
          stepSize: 20,
          padding: 10,
        },
      },
      x: {
        ticks: {
          padding: 5,
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  return (
    <>
      <Line data={chartData} options={options} height={100} />
    </>
  );
};

export default VacancyLineChart;
