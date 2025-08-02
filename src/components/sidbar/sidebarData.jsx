import { AdminPanelSettings } from "@mui/icons-material";
import { BookOpen } from "lucide-react";
import { Library } from "lucide-react";

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
];
