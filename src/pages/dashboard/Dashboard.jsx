import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actDashboardInfo } from "../../store/shared/dashboard/actDashboardInfo";
import MyPieChart from "./MyPieChart";
import MyBarChartForStudents from "./MyBarChartForStudents";
import MyBarChartForCountry from "./MyBarChartForCountry";
import { Search, User, Users } from "lucide-react";

import {
  formatLevelsDataForBar,
  formatCountriesDataForBar,
  formatPlansData,
} from "./data";
import StudentSearch from "./StudentSearch";
import TeacherSearch from "./TeacherSearch";

const Dashboard = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const dashboard = useSelector((state) => state.dashboardInfo.list);

  const totalTeachers = dashboard.totalTeachers;
  useEffect(() => {
    dispatch(actDashboardInfo(token));
  }, [dispatch, token]);

  if (!dashboard) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          flexDirection: "row-reverse",
        }}
      >
        {/* Teachers Box */}
        <div className="border border-gray-300 rounded-xl p-6 shadow-lg text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-gray-700 font-semibold text-lg">
              Total Teachers
            </h2>
          </div>

          {/* Number Display */}
          <div className="text-4xl font-bold text-gray-800 tracking-tight">
            {totalTeachers}
          </div>
        </div>
        {/* search Box */}
        <div className="border border-gray-300 rounded-xl p-6 shadow-lg text-center flex-1">
          <div className="grid grid-cols-2 gap-6">
            {/* Student Search */}
            <StudentSearch />
            {/* Teacher Search */}
            <TeacherSearch />
          </div>
        </div>
      </div>
      {/* Students by Plans */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Students by Plans */}
        <div
          style={{
            flex: 3,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
            width: "100%",
          }}
          className="border border-gray-300 rounded-xl p-6 shadow-lg text-center"
        >
          <h2>Students by Plans</h2>
          <div style={{ height: "300px" }}>
            <MyPieChart
              data={formatPlansData(dashboard.totalStudentsInPlans)}
            />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
          }}
          className=" border border-gray-300 rounded-xl p-6 shadow-lg text-center"
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
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
          }}
          className=" border border-gray-300 rounded-xl p-6 shadow-lg text-center"
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
    </div>
  );
};

export default Dashboard;
