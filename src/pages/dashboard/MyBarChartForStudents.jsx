// src/components/MyBarChart.jsx
import { ResponsiveBar } from "@nivo/bar";

const MyBarChartForStudents = ({
  data,
  indexBy,
  keys,
  axisBottomLegend,
  axisLeftLegend,
}) => {
  const colors = [
    "#e63946",
    "#f77f00",
    "#fcbf49",
    "#90e0ef",
    "#0077b6",
    "#023e8a",
    "#6f2232",
    "#4cc9f0",
    "#7209b7",
    "#f72585",
  ];

  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy={indexBy}
      margin={{ top: 40, right: 40, bottom: 50, left: 50 }}
      padding={0.3}
      borderRadius={10}
      colors={(bar) => colors[bar.index % colors.length]}
      enableGridX={false}
      enableGridY={false}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      axisBottom={{
        legend: axisBottomLegend,
        legendPosition: "middle",
        legendOffset: 42,
      }}
      axisLeft={{
        legend: axisLeftLegend,
        legendPosition: "middle",
        legendOffset: -40,
        tickValues: 0,
        format: (v) => Math.floor(v), // 👈 يخليها أعداد صحيحة
      }}
      label={(d) => Math.floor(d.value).toString()}
      labelSkipWidth={12}
      labelTextColor="#fff"
      labelSkipHeight={12}
      legends={[]}
      theme={{
        axis: {
          ticks: {
            text: {
              fontSize: 14,
              fill: "#333",
            },
          },
          legend: {
            text: {
              fontSize: 14,
              fill: "#222",
              fontWeight: "bold",
            },
          },
        },
        labels: {
          text: {
            fontSize: 16,
            fontWeight: "bold",
          },
        },
      }}
    />
  );
};

export default MyBarChartForStudents;
