import { useSelector } from "react-redux";
import { AdminPanelSettings } from "@mui/icons-material";
import {
  ArrowBigRightDash,
  BookOpen,
  Library,
  School,
  TableCellsMerge,
  UserRoundPlus,
  BookCheck,
  Contact,
  BadgeDollarSign,
  Percent,
  FileUser,
  ChartNoAxesCombined,
  Calendar,
} from "lucide-react";

export const useSidebarList = () => {
  const { id } = useSelector((state) => state.auth);

  const listSidebar = [
    ...(id === 111
      ? [
          {
            name: "All Admins",
            icon: <AdminPanelSettings />,
            children: [{ name: "All Admins", link: "/dashboard/all-admins" }],
          },
        ]
      : []),

    {
      name: "Plan",
      icon: <ArrowBigRightDash style={{ color: "#1976d2" }} />,
      children: [{ name: "Manage Plan", link: "/dashboard/create-plan" }],
    },
    {
      name: "Stage",
      icon: <ChartNoAxesCombined style={{ color: "#1976d2" }} />,
      children: [{ name: "Manage Stage", link: "/dashboard/create-stage" }],
    },
    {
      name: "Academic year",
      icon: <Calendar style={{ color: "#1976d2" }} />,
      children: [
        {
          name: "Manage Academic Year",
          link: "/dashboard/create-academic-year",
        },
      ],
    },
    {
      name: "Study Level",
      icon: <Library style={{ color: "#1976d2" }} />,
      children: [
        { name: "Manage Study Level", link: "/dashboard/create-study-level" },
      ],
    },
    {
      name: "Plan Level",
      icon: <BookOpen style={{ color: "#1976d2" }} />,
      children: [{ name: "Plan Details", link: "/dashboard/plan-details" }],
    },
    {
      name: "Courses",
      icon: <BookCheck style={{ color: "#1976d2" }} />,
      children: [
        { name: "Courses Details", link: "/dashboard/courses-details" },
      ],
    },
    {
      name: "School Class",
      icon: <School style={{ color: "#1976d2" }} />,
      children: [
        { name: "Manage School Class", link: "/dashboard/manage-school-class" },
      ],
    },
    {
      name: "Schedule Class",
      icon: <TableCellsMerge style={{ color: "#1976d2" }} />,
      children: [
        { name: "Control Schedule", link: "/dashboard/control-schedule" },
      ],
    },
    {
      name: "Teacher",
      icon: <UserRoundPlus style={{ color: "#1976d2" }} />,
      children: [
        { name: "Create Teacher", link: "/dashboard/create-teacher" },
        { name: "Delete Teacher", link: "/dashboard/delete-teacher" },
      ],
    },
    {
      name: "Student",
      icon: <FileUser style={{ color: "#1976d2" }} />,
      children: [
        { name: "Applications", link: "/dashboard/all-applications" },
        { name: "Registration Requests", link: "/dashboard/registration-requests" },
        // { name: "Get Students From Excel", link: "/dashboard/get-students" },
        // { name: "Upload Student File", link: "/dashboard/upload-student" },
        { name: "Students Data", link: "/dashboard/all-students" },
      ],
    },
    {
      name: "Discount Code",
      icon: <Percent style={{ color: "#1976d2" }} />,
      children: [
        {
          name: "Create Discount Code",
          link: "/dashboard/create-discount-code",
        },
      ],
    },
    {
      name: "Job Discount",
      icon: <BadgeDollarSign style={{ color: "#1976d2" }} />,
      children: [
        { name: "Create Job Discount", link: "/dashboard/create-job-discount" },
      ],
    },
    {
      name: "Contact Us",
      icon: <Contact style={{ color: "#1976d2" }} />,
      children: [{ name: "Solve Problem", link: "/dashboard/solve-problem" }],
    },
    
    // {
    //   name: "Children Application",
    //   icon: <Contact style={{ color: "#1976d2" }} />,
    //   children: [],
    // },
  ];

  return listSidebar;
};