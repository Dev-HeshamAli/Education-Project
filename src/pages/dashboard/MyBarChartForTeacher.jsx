// src/components/MyBarChart.jsx
import { ResponsiveBar } from "@nivo/bar";

const MyBarChartForTeacher = ({
  data,
  indexBy,
  keys,
  axisBottomLegend,
  axisLeftLegend,
}) => {
  const colors = [
    "#2a9d8f", // أخضر غامق
    "#457b9d", // أزرق غامق
    "#264653", // أزرق مائل للأسود
    "#1d3557", // كحلي غامق
    "#6d597a", // بنفسجي رمادي غامق
    "#4a4e69", // رمادي بنفسجي غامق
    "#22223b", // أسود مزرق
    "#5a189a", // بنفسجي غامق
    "#9d0208", // أحمر غامق
    "#e63946", // أحمر داكن
  ];

  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy={indexBy}
      margin={{ top: 40, right: 40, bottom: 45, left: 50 }}
      padding={0.8}
      borderRadius={6}
      colors={(bar) => colors[bar.index % colors.length]}
      enableGridX={false}
      enableGridY={false}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      innerPadding={0}
      groupMode="grouped"
      axisBottom={{
        legend: axisBottomLegend,
        legendPosition: "middle",
        legendOffset: 40,
        tickSize: 0,
        tickPadding: 10,
      }}
      axisLeft={{
        legend: axisLeftLegend,
        legendPosition: "middle",
        legendOffset: -40,
        tickSize: 0,
        tickPadding: 5,
        tickValues: 0,
        format: (v) => Math.floor(v),
      }}
      label={(d) => Math.floor(d.value).toString()}
      labelSkipWidth={12}
      labelSkipHeight={12}
      legends={[]}
      labelTextColor="#fff"
      layout="vertical"
      theme={{
        axis: {
          ticks: {
            text: {
              fontSize: 16, // 👈 كبرت النصوص بتاعة محور X
              fill: "#333",
              fontWeight: "bold",
            },
          },
          legend: {
            text: {
              fontSize: 16,
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

export default MyBarChartForTeacher;
