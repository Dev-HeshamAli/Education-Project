import { Search, Users } from "lucide-react";

const TeacherSearch = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center space-x-2 mb-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-gray-700 font-semibold">Search for a Student</h3>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="اسم المدرس "
          // value={teacherSearch}
          // onChange={(e) => setTeacherSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-right"
        />
      </div>
    </div>
  );
};

export default TeacherSearch;
