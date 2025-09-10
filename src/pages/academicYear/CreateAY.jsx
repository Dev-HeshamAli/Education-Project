import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "../admin/createAdmin/InputField";
import { actCreateAcademicYearSlice } from "../../store/academicYear/createAcademicYear/actCreateAcademicYearSlice";
import { fetchAcademicYears } from "../../store/shared/academicYears/actGetAcademicYears";
import { clearMessages } from "../../store/academicYear/createAcademicYear/createAcademicYearSlice";
import { actActiveAcademicYear } from "../../store/shared/academicYears/ActiveAcademicYear/actActiveAcademicYear";
import { clearMessageDeleteAcademicYear } from "../../store/academicYear/createAcademicYear/deleteAY/deleteAYSlice";
import Alert from "@mui/material/Alert";
import { CircleCheckBig, Star, StarIcon } from "lucide-react";
import { actDeleteAY } from "../../store/academicYear/createAcademicYear/deleteAY/actDeleteAY";

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
  const { error: deleteError, success: deleteSuccess } = useSelector(
    (state) => state.deleteAcademicYear
  );

  const academicYears = useSelector((state) => state.academicYearsId.list);
  const {
    active,
    error: errorActive,
    loading: loadingActive,
  } = useSelector((state) => state.activeYear);

  const token = useSelector((state) => state.auth.token);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(adminSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    dispatch(fetchAcademicYears());
  }, [dispatch]);

  useEffect(() => {
    if (
      error ||
      successMessage ||
      deleteError ||
      deleteSuccess ||
      active ||
      errorActive
    ) {
      const timeout = setTimeout(() => {
        dispatch(clearMessages());
        dispatch(clearMessageDeleteAcademicYear());
        dispatch(fetchAcademicYears());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [
    error,
    successMessage,
    dispatch,
    reset,
    deleteError,
    deleteSuccess,
    active,
    errorActive,
  ]);

  const onSubmit = (data) => {
    dispatch(actCreateAcademicYearSlice({ data, token }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Academic Year?"))
      dispatch(actDeleteAY({ id, token }));
  };
  const handleActive = (id) => {
    dispatch(actActiveAcademicYear({ id, token }));
  };

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-64px)] bg-gray-100 py-10">
      <div className="w-full max-w-4xl space-y-8">
        {/* FORM */}
        <div className="p-8 bg-white shadow-xl rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Academic Year
          </h2>

          {successMessage && (
            <Alert severity="success" className="mb-4 text-center">
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert severity="error" className="mb-4 text-center">
              {error}
            </Alert>
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

        {/* ERROR */}

        {/* TABLE */}
        <div className="bg-white shadow-xl rounded-xl p-6">
          {deleteError && (
            <Alert severity="error" className="mb-4 text-center">
              {deleteError}
            </Alert>
          )}

          {deleteSuccess && (
            <Alert severity="success" className="mb-4 text-center">
              {deleteSuccess}
            </Alert>
          )}
          {loadingActive && (
            <Alert severity="info" className="mb-4 text-center">
              Loading...
            </Alert>
          )}
          <h2 className="text-xl font-bold mb-4">Academic Years</h2>
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Current Year</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {academicYears && academicYears.length > 0 ? (
                academicYears.map((ay) => (
                  <tr key={ay.id}>
                    <td className="border px-4 py-2 text-center ">
                      {ay.isCurrent ? (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CircleCheckBig className="text-green-500 " />
                        </span>
                      ) : (
                        "-" // أو تسيبه فاضي لو مش عايز أي حاجة
                      )}
                    </td>

                    <td className="border px-4 py-2 text-center">{ay.date}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleActive(ay.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-4"
                      >
                        Active
                      </button>
                      <button
                        onClick={() => handleDelete(ay.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No Academic Years Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateAY;
