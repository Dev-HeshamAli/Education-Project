import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actDashboardInfo } from "../../store/shared/dashboard/actDashboardInfo";
import MyPieChart from "./MyPieChart";
import MyBarChartForStudents from "./MyBarChartForStudents";
import MyBarChartForCountry from "./MyBarChartForCountry";
import MyBarChartForTeacher from "./MyBarChartForTeacher";
import {
  formatLevelsDataForBar,
  formatCountriesDataForBar,
  formatPlansData,
  formatTeachersDataForBar,
} from "./data";

const Dashboard = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const dashboard = useSelector((state) => state.dashboardInfo.list);

  console.log(dashboard);

  useEffect(() => {
    dispatch(actDashboardInfo(token));
  }, [dispatch, token]);

  if (!dashboard) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          <h2>Students by Plans</h2>
          <div style={{ height: "300px" }}>
            <MyPieChart
              data={formatPlansData(dashboard.totalStudentsInPlans)}
            />
          </div>
        </div>

        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          <h2>Students by Countries</h2>
          <div style={{ height: "300px" }}>
            <MyBarChartForCountry
              data={formatCountriesDataForBar(
                dashboard.totalStudentsInCountries
              )}
              indexBy="country"
              keys={["students"]}
              axisBottomLegend="Countries"
              axisLeftLegend="Students"
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          <h2>Total Teachers</h2>
          <div style={{ height: "300px" }}>
            <MyBarChartForTeacher
              data={formatTeachersDataForBar(dashboard.totalTeachers)}
              indexBy="category"
              keys={["count"]}
              axisLeftLegend="Count"
            />
          </div>
        </div>
        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          <h2>Students by Levels</h2>
          <div style={{ height: "300px" }}>
            <MyBarChartForStudents
              data={formatLevelsDataForBar(dashboard.totalStudentInLevels)}
              indexBy="level"
              keys={["students"]}
              axisBottomLegend="Levels"
              axisLeftLegend="Students"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
