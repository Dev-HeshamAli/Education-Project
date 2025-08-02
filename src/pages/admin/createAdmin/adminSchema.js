// adminSchema.js
import * as yup from "yup";

const adminSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  secondName: yup.string().required("Second name is required"),
  thirdName: yup.string().required("Third name is required"),
  phone: yup
    .string()
    .matches(/^01[0-9]{9}$/, "Invalid phone number")
    .required("Phone is required"),
  job: yup.string().required("Job is required"),
  ssn: yup
    .string()
    .matches(/^[0-9]{14}$/, "SSN must be exactly 14 digits")
    .required("SSN is required"),
  birthDate: yup.string().required("Birth date is required"),
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),
  password: yup
    .string()
    .min(
      8,
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    )
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

export default adminSchema;
