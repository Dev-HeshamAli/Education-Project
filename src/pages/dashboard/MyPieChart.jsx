// src/components/charts/MyPieChart.jsx
import { ResponsivePie } from "@nivo/pie";

const MyPieChart = ({ data }) => (
  <ResponsivePie
    data={data}
    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
    innerRadius={0.5}
    padAngle={0.6}
    cornerRadius={2}
    activeOuterRadiusOffset={8}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: "color" }}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor="#fff"
    colors={{ scheme: "nivo" }}
    theme={{
      labels: {
        text: {
          fontSize: 16,
          fontWeight: "bold",
        },
      },
    }}
    legends={[
      {
        anchor: "bottom",
        direction: "row",
        translateY: 56,
        itemWidth: 100,
        itemHeight: 18,
        symbolShape: "circle",
      },
    ]}
  />
);

export default MyPieChart;
