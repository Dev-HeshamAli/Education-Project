import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../api/BASE_URL";
import StudentInfo from "../../components/student/StudentInfo";

export default function StudentProfile() {
  const token = useSelector((s) => s.auth.token);
  const { id } = useSelector((s) => s.auth);
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/Student/student-profile/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudent(data);
        setCourses(data?.courses || []);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [id, token]);

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 py-10">
        {/* ✅ Send student as prop */}
        <StudentInfo student={student} />
      </div>
    </div>
  );
}
