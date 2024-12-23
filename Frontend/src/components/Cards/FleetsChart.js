import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import useFetch from "../../hooks/useFetch";

ChartJS.register(ArcElement, Tooltip, Legend);

export function FleetsChart() {
  const { data } = useFetch("/fleet/getAllFleets");

  const activeFleets = data.filter((item) => item.status === "active");
  const passiveFleets = data.filter((item) => item.status === "passive");

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${
          "Fleet Status" +
          " - " +
          (activeFleets.length + passiveFleets.length)
        }`,
      },
    },
  };
  const data2 = {
    labels: ["Active", "Passive"],
    datasets: [
      {
        label: " ",
        data: [activeFleets.length, passiveFleets.length],
        backgroundColor: ["rgba(255, 206, 86, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 206, 86, 1)", "rgba((54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-2/4">
      <Doughnut options={options} data={data2} />
    </div>
  );
}
