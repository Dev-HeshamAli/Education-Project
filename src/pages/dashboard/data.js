// 📊 الطلاب حسب المستويات -> Bar Chart
export const formatLevelsDataForBar = (levels = []) => {
  return levels.map((item) => ({
    level: item.levelName,
    students: item.totalStudents,
  }));
};

// 📊 الطلاب حسب الدول -> Bar Chart
export const formatCountriesDataForBar = (countries = []) => {
  return countries.map((item) => ({
    country: item.country,
    students: item.studentCount,
  }));
};

// 📊 الطلاب حسب الخطط -> Pie Chart
export const formatPlansData = (plans = []) => {
  return plans.map((item) => ({
    id: item.planName,
    label: item.planName,
    value: item.totalStudents,
  }));
};

// // 📊 المدرسين -> Bar Chart (كـ single bar)
// export const formatTeachersDataForBar = (totalTeachers = 0) => {
//   return [
//     {
//       category: "Teachers",
//       count: totalTeachers,
//     },
//   ];
// };
