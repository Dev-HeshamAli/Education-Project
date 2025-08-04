// import InputField from "../admin/createAdmin/InputField";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useForm } from "react-hook-form";
// import * as yup from "yup";

// const adminSchema = yup.object().shape({
//   startDate: yup.string().required("Start Date is required"),
//   endDate: yup
//     .string()
//     .required("End Date is required")
//     .test("is-greater", "End date must be after start date", function (value) {
//       const { startDate } = this.parent;
//       return new Date(value) > new Date(startDate);
//     }),
// });

// const CreateAY = () => {
// const {
//   register,
//   handleSubmit,
//   formState: { errors },
//   // reset,
// } = useForm({
//   resolver: yupResolver(adminSchema),
//   mode: "onBlur",
// });

//   const onSubmit = (data) => {
//     console.log(data);
//     // dispatch(createAdmin({ adminData: data, token }));
//     // reset();
//   };

//   return (
//     <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-100">
//       <div className="w-full max-w-4xl p-8 bg-white shadow-xl rounded-xl">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           Create Academic Year
//         </h2>

//         {/* {successMessage && (
//           <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
//             {successMessage}
//           </div>
//         )}
//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
//             {error}
//           </div>
//         )} */}

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div className="grid grid-cols-2 gap-4">
//             <InputField
//               label="Start Date"
//               name="startDate"
//               type="date"
//               register={register}
//               error={errors.startDate}
//             />
//             <InputField
//               label="End Date"
//               name="endDate"
//               type="date"
//               register={register}
//               error={errors.endDate}
//             />
//           </div>
//           <button
//             type="submit"
//             // disabled={loading === "pending"}
//             className={`w-full py-2 px-4 rounded-md transition duration-300 font-semibold `}
//           >
//             Submit
//             {/* {loading === "pending" ? "Loading..." : "Submit"} */}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateAY;

// // ${
// //               loading === "pending"
// //                 ? "bg-gray-400 cursor-not-allowed"
// //                 : "bg-[#8c57ff] hover:bg-[#6f3ce0] text-white"
// //             }`

import { useDispatch, useSelector } from "react-redux";
import { actCreateAcademicYearSlice } from "../../store/academicYear/createAcademicYear/actCreateAcademicYearSlice";
import { clearMessages } from "../../store/academicYear/createAcademicYear/createAcademicYearSlice";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "../admin/createAdmin/InputField";
import * as yup from "yup";

const adminSchema = yup.object().shape({
  startDate: yup.string().required("Start Date is required"),
  endDate: yup
    .string()
    .required("End Date is required")
    .test("is-greater", "End date must be after start date", function (value) {
      const { startDate } = this.parent;
      return new Date(value) > new Date(startDate);
    }),
});

const CreateAY = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(
    (state) => state.academicYear
  );
  const token = useSelector((state) => state.auth.token); // حسب تخزينك للتوكن

  const onSubmit = (data) => {
    dispatch(actCreateAcademicYearSlice({ data, token }));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
  } = useForm({
    resolver: yupResolver(adminSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (error || successMessage) {
      const timeout = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error, successMessage, dispatch]);

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Academic Year
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Start Date"
              name="startDate"
              type="date"
              register={register}
              error={errors.startDate}
            />
            <InputField
              label="End Date"
              name="endDate"
              type="date"
              register={register}
              error={errors.endDate}
            />
          </div>
          <button
            type="submit"
            disabled={loading === "pending"}
            className={`w-full py-2 px-4 rounded-md font-semibold text-white ${
              loading === "pending"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1976d2] hover:bg-[#6f3ce0]"
            }`}
          >
            {loading === "pending" ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAY;
