import { ResponsiveBar } from "@nivo/bar";

const MyBarChartForCountry = ({
  data,
  indexBy,
  keys,
  axisBottomLegend,
  axisLeftLegend,
}) => {
  const colors = [
    "#1d3557", // كحلي غامق
    "#457b9d", // أزرق غامق
    "#2a9d8f", // أخضر غامق
    "#264653", // أزرق مائل للأسود
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
      margin={{ top: 30, right: 20, bottom: 50, left: 50 }}
      padding={0.6}
      borderRadius={10}
      colors={(bar) => colors[bar.index % colors.length]}
      enableGridX={false}
      enableGridY={false}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: axisBottomLegend,
        legendPosition: "middle",
        legendOffset: 36,
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: axisLeftLegend,
        legendPosition: "middle",
        legendOffset: -40,
        tickValues: 0,
        format: (v) => Math.floor(v),
      }}
      label={(d) => Math.floor(d.value).toString()}
      labelSkipWidth={16}
      labelSkipHeight={16}
      labelTextColor="#fff"
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

export default MyBarChartForCountry;
