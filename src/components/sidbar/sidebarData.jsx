import { AdminPanelSettings, Class } from "@mui/icons-material";
import { BookOpen } from "lucide-react";
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
  {
    name: "Admin",
    icon: <AdminPanelSettings />,
    children: [
      { name: "Create Admin", link: "/dashboard/create-admin" },
      { name: "Update Admin", link: "/dashboard/update-admin" },
      { name: "Delete Admin", link: "/dashboard/delete-admin" },
    ],
  },
  {
    name: "Academic year",
    icon: <BookOpen />,
    children: [
      { name: "Create Academic Year", link: "/dashboard/create-academic-year" },
      { name: "Create Plan", link: "/dashboard/create-plan" },
      { name: "Create Stage", link: "/dashboard/create-stage" },
      { name: "Create Study Level", link: "/dashboard/create-study-level" },
      { name: "Create Plan Levels", link: "/dashboard/create-plan-level" },
      { name: "Update Plan Levels", link: "/dashboard/update-plan-level" },
    ],
  },
  {
    name: "Courses",
    icon: <Library />,
    children: [
      { name: "Create Course", link: "/dashboard/create-course" },
      { name: "Add Course to Plan", link: "/dashboard/add-course-to-plan" },
      {
        name: "Delete Course From Plan",
        link: "/dashboard/delete-course-from-plan",
      },
      {
        name: "Add Course To Academic Year",
        link: "/dashboard/add-course-to-academic-year",
      },
      { name: "Delete Course", link: "/dashboard/delete-course" },
      { name: "Update Course", link: "/dashboard/update-course" },
    ],
  },
  {
    name: "School Class",
    icon: <School />,
    children: [
      { name: "Create School Class", link: "/dashboard/create-school-class" },
      { name: "Update School Class", link: "/dashboard/update-school-class" },
      {
        name: "Delete School Class",
        link: "/dashboard/delete-school-class",
      },
      {
        name: "Add Student To School Class",
        link: "/dashboard/add-student-to-school-class",
      },
      {
        name: "Remove Student From School Class",
        link: "/dashboard/remove-student-from-school-class",
      },
    ],
  },
  {
    name: "Teacher",
    icon: <UserRoundPlus />,
    children: [
      { name: "Create Teacher", link: "/dashboard/create-teacher" },
      { name: "Delete Teacher", link: "/dashboard/delete-teacher" },
      {
        name: "Add Teacher To Study Level",
        link: "/dashboard/add-teacher-to-study-level",
      },
      {
        name: "Add Teacher To Course",
        link: "/dashboard/add-teacher-to-course",
      },
      {
        name: "Add Teacher To Class",
        link: "/dashboard/add-teacher-to-class",
      },
    ],
  },
  {
    name: "Schedule Class",
    icon: <TableCellsMerge />,
    children: [
      { name: "Create Schedule", link: "/dashboard/create-schedule" },
      { name: "Update Schedule", link: "/dashboard/update-schedule" },
      { name: "Delete Schedule", link: "/dashboard/delete-schedule" },
      {
        name: "Add Lec To Schedule",
        link: "/dashboard/add-lec-to-schedule",
      },
      {
        name: "Update Lec To Schedule",
        link: "/dashboard/update-lec-to-schedule",
      },
      {
        name: "Delete Lec From Schedule",
        link: "/dashboard/delete-lec-from-schedule",
      },
    ],
  },
  {
    name: "Student",
    icon: <FileUser />,
    children: [
      { name: "Get Students From Excel", link: "/dashboard/get-students" },
      { name: "Upload Student File", link: "/dashboard/upload-student" },
      { name: "All Applications", link: "/dashboard/all-applications" },
      {
        name: "Acceptance Application",
        link: "/dashboard/acceptance-application",
      },
      {
        name: "Rejection Application",
        link: "/dashboard/rejection-application",
      },
    ],
  },
  {
    name: "Discount Code",
    icon: <Percent />,
    children: [
      { name: "Create Discount Code", link: "/dashboard/create-discount-code" },
      { name: "Update Discount Code", link: "/dashboard/update-discount-code" },
      { name: "Delete Discount Code", link: "/dashboard/delete-discount-code" },
    ],
  },
  {
    name: "Job Discount",
    icon: <BadgeDollarSign />,
    children: [
      { name: "Create Job Discount", link: "/dashboard/create-job-discount" },
      { name: "Update Job Discount", link: "/dashboard/update-job-discount" },
      { name: "Delete Job Discount", link: "/dashboard/delete-job-discount" },
    ],
  },
  {
    name: "Exams",
    icon: <BookCheck />,
    children: [
      { name: "Add Exam", link: "/dashboard/add-exam" },
      { name: "Update Exam", link: "/dashboard/update-exam" },
      { name: "Delete Exam", link: "/dashboard/delete-exam" },
    ],
  },
  {
    name: "Contact Us",
    icon: <Contact />,
    children: [
      { name: "Solve Problem", link: "/dashboard/solve-problem" },
      { name: "UnSolved Problem", link: "/dashboard/unsolved-problem" },
      { name: "Solved Problem", link: "/dashboard/solved-problem" },
      { name: "Delete Problem", link: "/dashboard/delete-problem" },
    ],
  },
];
