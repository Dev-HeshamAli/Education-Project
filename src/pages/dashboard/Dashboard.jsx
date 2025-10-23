import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actDashboardInfo } from "../../store/shared/dashboard/actDashboardInfo";
import MyPieChart from "./MyPieChart";
import MyBarChartForStudents from "./MyBarChartForStudents";
import MyBarChartForCountry from "./MyBarChartForCountry";
import { Users } from "lucide-react";

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
    <div className="p-4 space-y-6">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Search Box - takes 3/4 */}
        <div className="border border-gray-300 rounded-xl p-6 shadow-lg md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StudentSearch />
            <TeacherSearch />
          </div>
        </div>

        {/* Teachers Box - takes 1/4 */}
        <div className="border border-gray-300 rounded-xl p-6 shadow-lg text-center md:col-span-1">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-gray-700 font-semibold text-lg">
              Total Teachers
            </h2>
          </div>
          <div className="text-4xl font-bold text-gray-800 tracking-tight">
            {totalTeachers}
          </div>
        </div>
      </div>

      {/* Students by Plans */}
      <div className="border border-gray-300 rounded-xl p-6 shadow-lg text-center">
        <h2 className="mb-4 font-semibold">Students by Plans</h2>
        <div className="h-72">
          <MyPieChart data={formatPlansData(dashboard.totalStudentsInPlans)} />
        </div>
      </div>

      {/* Students by Levels */}
      <div className="border border-gray-300 rounded-xl p-6 shadow-lg text-center">
        <h2 className="mb-4 font-semibold">Students by Levels</h2>
        <div className="h-72">
          <MyBarChartForStudents
            data={formatLevelsDataForBar(dashboard.totalStudentInLevels)}
            indexBy="level"
            keys={["students"]}
            axisBottomLegend="Levels"
            axisLeftLegend="Students"
          />
        </div>
      </div>

      {/* Students by Countries */}
      <div className="border border-gray-300 rounded-xl p-6 shadow-lg text-center">
        <h2 className="mb-4 font-semibold">Students by Countries</h2>
        <div className="h-72">
          <MyBarChartForCountry
            data={formatCountriesDataForBar(dashboard.totalStudentsInCountries)}
            indexBy="country"
            keys={["students"]}
            axisBottomLegend="Countries"
            axisLeftLegend="Students"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;