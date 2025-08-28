import { AdminPanelSettings, Class } from "@mui/icons-material";
import { ArrowBigRightDash, BookOpen } from "lucide-react";
import { Library } from "lucide-react";
import { School } from "lucide-react";
import { TableCellsMerge } from "lucide-react";
import { UserRoundPlus } from "lucide-react";
import { BookCheck } from "lucide-react";
import { Contact } from "lucide-react";
import { BadgeDollarSign } from "lucide-react";
import { Percent } from "lucide-react";
import { FileUser } from "lucide-react";
export const listSidebar = [
  // {
  //   name: "Admin",
  //   icon: <ArrowBigRightDash />,
  //   children: [
  //     { name: "Create Admin", link: "/dashboard/create-admin" },
  //     { name: "Update Admin", link: "/dashboard/update-admin" },
  //     { name: "Delete Admin", link: "/dashboard/delete-admin" },
  //   ],
  // },

  {
    name: "Plan",
    icon: <ArrowBigRightDash />,
    children: [{ name: "Manage Plan", link: "/dashboard/create-plan" }],
  },
  {
    name: "Stage",
    icon: <ArrowBigRightDash />,
    children: [{ name: "Manage Stage", link: "/dashboard/create-stage" }],
  },
  {
    name: "Study Level",
    icon: <ArrowBigRightDash />,
    children: [
      { name: "Manage Study Level", link: "/dashboard/create-study-level" },
    ],
  },
  {
    name: "Contact Us",
    icon: <ArrowBigRightDash />,
    children: [
      { name: "Solve Problem", link: "/dashboard/solve-problem" },
      // { name: "UnSolved Problem", link: "/dashboard/unsolved-problem" },
      // { name: "Solved Problem", link: "/dashboard/solved-problem" },
      // { name: "Delete Problem", link: "/dashboard/delete-problem" },
    ],
  },
  {
    name: "Discount Code",
    icon: <ArrowBigRightDash />,
    children: [
      { name: "Create Discount Code", link: "/dashboard/create-discount-code" },
    ],
  },
  {
    name: "Job Discount",
    icon: <ArrowBigRightDash />,
    children: [
      { name: "Create Job Discount", link: "/dashboard/create-job-discount" },
    ],
  },
  {
    name: "Plan Level",
    icon: <ArrowBigRightDash />,
    children: [
      { name: "Plan Details", link: "/dashboard/plan-details" },
      // {
      //   name: "All Study Levels In Plan",
      //   link: "/dashboard/all-study-levels-in-plan",
      // },
    ],
  },
  {
    name: "School Class",
    icon: <ArrowBigRightDash />,
    children: [
      { name: "Manage School Class", link: "/dashboard/manage-school-class" },
      // { name: "Create School Class", link: "/dashboard/create-school-class" },
      // { name: "Update School Class", link: "/dashboard/update-school-class" },
      // { name: "Delete School Class", link: "/dashboard/delete-school-class" },
      // {
      //   name: "Add Student To School Class",
      //   link: "/dashboard/add-student-to-school-class",
      // },
      // {
      //   name: "Remove Student From School Class",
      //   link: "/dashboard/remove-student-from-school-class",
      // },
    ],
  },
  {
    name: "Teacher",
    icon: <ArrowBigRightDash />,
    children: [
      { name: "Create Teacher", link: "/dashboard/create-teacher" },
      { name: "Delete Teacher", link: "/dashboard/delete-teacher" },
      // {
      //   name: "Add Teacher To Study Level",
      //   link: "/dashboard/add-teacher-to-study-level",
      // },
      // {
      //   name: "Add Teacher To Course",
      //   link: "/dashboard/add-teacher-to-course",
      // },
      // {
      //   name: "Add Teacher To Class",
      //   link: "/dashboard/add-teacher-to-class",
      // },
    ],
  },
  {
    name: "Academic year",
    icon: <ArrowBigRightDash />,
    children: [
      { name: "Manage Academic Year", link: "/dashboard/create-academic-year" },
    ],
    border: true,
  },
  {
    name: "Courses",
    icon: <ArrowBigRightDash />,
    children: [
      // {
      //   name: "All Courses In Study Level",
      //   link: "/dashboard/courses-in-study-level",
      // },
      {
        name: "Courses Details",
        link: "/dashboard/courses-details",
      },
      // { name: "Create Course", link: "/dashboard/create-course" },
      // { name: "Update Course", link: "/dashboard/update-course" },
      // { name: "Delete Course", link: "/dashboard/delete-course" },
      // { name: "Add Course to Plan", link: "/dashboard/add-course-to-plan" },
      // {
      //   name: "Delete Course From Plan",
      //   link: "/dashboard/delete-course-from-plan",
      // },
      // {
      //   name: "Add Course To Academic Year",
      //   link: "/dashboard/add-course-to-academic-year",
      // },
    ],
  },
  {
    name: "Schedule Class",
    icon: <ArrowBigRightDash />,
    children: [
      // { name: "Create Schedule", link: "/dashboard/create-schedule" },
      // { name: "Update & Delete Schedule", link: "/dashboard/update-schedule" },
      // {
      //   name: "Add Lec To Schedule",
      //   link: "/dashboard/add-lec-to-schedule",
      // },
      // {
      //   name: "Update & Delete Lec From Schedule",
      //   link: "/dashboard/update-lec-to-schedule",
      // },
      {
        name: "Control Schedule",
        link: "/dashboard/control-schedule",
      },
      // {
      //   name: "UPDATE",
      //   link: "/dashboard/UPDATE",
      // },
    ],
  },
  {
    name: "Student",
    icon: <ArrowBigRightDash />,
    children: [
      { name: "Get Students From Excel", link: "/dashboard/get-students" },
      { name: "Upload Student File", link: "/dashboard/upload-student" },
    ],
  },

  // {
  //   name: "Exams",
  //   icon: <ArrowBigRightDash />,
  //   children: [
  //     { name: "Add Exam", link: "/dashboard/add-exam" },
  //     { name: "Update Exam", link: "/dashboard/update-exam" },
  //     { name: "Delete Exam", link: "/dashboard/delete-exam" },
  //   ],
  // },
];
