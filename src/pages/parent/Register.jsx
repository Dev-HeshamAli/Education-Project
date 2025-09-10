import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { loginUser } from "../../store/auth/PostUserData";
import { getJobDiscounts } from "../../store/parent/parentSlice";
import { getContries, getGovernrate } from "../../store/SharedData/SharedDataSlice";
import Navbar from "../Main/Navbar";
import { BASE_URL } from "../../api/BASE_URL";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // احمِ نفسك لو slice مش جاهز
  const { countries = [], governorates = [] } = useSelector((s) => s.shared || {});
  const jobDiscounts = useSelector((s) => s.parent?.jobDiscounts ?? []);

  // تحميل الداتا
  useEffect(() => {
    dispatch(getContries());
    dispatch(getGovernrate());
    dispatch(getJobDiscounts());
  }, [dispatch]);

  // أدوات التطبيع والمطابقة
  const normalize = (s) =>
    (s || "").toString().toLowerCase().replace(/\s+/g, " ").trim();

  const discountSet = useMemo(
    () =>
      new Set(
        (jobDiscounts || [])
          .map((d) => d?.job || d?.name || d?.title || d?.jobTitle || "")
          .map(normalize)
          .filter(Boolean)
      ),
    [jobDiscounts]
  );

  const discountOptions = useMemo(
    () =>
      (jobDiscounts || [])
        .map((d) => d?.job || d?.name || d?.title || d?.jobTitle)
        .filter(Boolean),
    [jobDiscounts]
  );

  // Regex
  const passReg = /^[A-Z][A-Za-z0-9]{5,}$/;
  const phoneReg = /^01[0125][0-9]{8}$/;

  // Validation
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First Name must be required")
      .min(3, "the First name must be at least 3 chars")
      .max(20, "the First name must be at most 20 chars "),
    secondName: Yup.string()
      .required("Last Name must be required")
      .min(3, "the second name must be at least 3 chars")
      .max(20, "the Second name must be at most 20 chars "),
    ssn: Yup.string()
      .required("ssn must be required")
      .min(14, "the name must be at least 3 chars"),
    country: Yup.string().required("country must be required"),
    email: Yup.string().required("email must be required").email("must be an email"),
    password: Yup.string().required("password must be required").matches(passReg, "must be capital"),
    AllPhones: Yup.array().of(
      Yup.string().required("phone is required").matches(phoneReg, "invalid phone format (Egypt)")
    ),
    jobs: Yup.array().of(
      Yup.object({
        job: Yup.string().required("Job title is required"),
        gender: Yup.string().required("Gender is required"),
        requiresProof: Yup.boolean().default(false),
        file: Yup.mixed().when("requiresProof", {
          is: true,
          then: (schema) =>
            schema
              .required("Proof file is required")
              .test("fileSize", "Max size 2MB", (f) => !f || f.size <= 2 * 1024 * 1024)
              .test("fileType", "Only PDF/JPG/PNG", (f) =>
                !f || ["application/pdf", "image/jpeg", "image/png"].includes(f.type)
              ),
          otherwise: (schema) => schema.nullable(),
        }),
      })
    ),
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      firstName: "",
      secondName: "",
      thirdName: "",
      ssn: "",
      country: "",
      governorate: "",
      email: "",
      password: "",
      AllPhones: [""],
      jobs: [{ job: "", gender: "", requiresProof: false, file: null }],
    },
    onSubmit: (x) => sendDataToSignUp(x),
    validationSchema,
  });

  // تحديث صف الوظيفة + تحديد requiresProof
  const updateJobRow = (index, patch) => {
    const copy = [...formik.values.jobs];
    const merged = { ...copy[index], ...patch };

    if ("job" in patch) {
      const title = normalize(patch.job);
      merged.requiresProof = discountSet.has(title);
      if (!merged.requiresProof) merged.file = null;
    }

    copy[index] = merged;
    formik.setFieldValue("jobs", copy);
  };

  // Submit
  async function sendDataToSignUp(values) {
    const loadingToast = toast.loading("Creating account...");
    try {
      // 1) إنشاء الـ Parent
      const res = await axios.post(
        `${BASE_URL}/api/Parent/create-parent`,
        values
      );
      const parentId = 7; // عدّلي لو الـ API اسم المفتاح مختلف
      console.log("id" , res?.data)
      toast.success("Successfully Created!");

      // 2) رفع ملفات الإثبات
      const proofs = values.jobs.filter((j) => j.requiresProof && j.file && j.job);
      if (proofs.length && parentId) {
        const toastUp = toast.loading("Uploading proof files...");
        try {
          for (const p of proofs) {
            const form = new FormData();
            form.append("id", parentId);
            form.append("ProofEmploymentFile", p.file);

            await axios.post(
               `${BASE_URL}/api/Parent/upload-proof-employment`,
              form,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
          }
          toast.success("Proof files uploaded");
        } catch (e) {
          toast.error(e?.response?.data?.message || "Proof upload failed");
        } finally {
          toast.dismiss(toastUp);
        }
      }

      // navigate("/"); // فعّليها لو حابة ترجّعيه لصفحة تانية بعد النجاح
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      toast.dismiss(loadingToast);
    }
  }

  return (
    <>
    <Navbar />
      <div className="flex flex-col justify-center sm:py-12 mt-10">
        <div className="shadow-2xl p-10 xs:p-0 mx-auto max-w-2xl">
          <h1 className="font-bold text-center text-2xl mb-5">Sign Up</h1>
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <form onSubmit={formik.handleSubmit}>
              <div className="px-5 py-7">
                {/* First Name */}
                <label className="font-semibold text-sm text-gray-600 pb-1 block">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full"
                />
                {formik.errors.firstName && formik.touched.firstName && (
                  <p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.firstName}</p>
                )}

                {/* Second Name */}
                <label className="font-semibold text-sm text-gray-600 pb-1 block">Second Name</label>
                <input
                  type="text"
                  name="secondName"
                  value={formik.values.secondName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full"
                />
                {formik.errors.secondName && formik.touched.secondName && (
                  <p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.secondName}</p>
                )}

                {/* SSN */}
                <label className="font-semibold text-sm text-gray-600 pb-1 block">SSN</label>
                <input
                  type="text"
                  name="ssn"
                  value={formik.values.ssn}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full"
                />
                {formik.errors.ssn && formik.touched.ssn && (
                  <p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.ssn}</p>
                )}

                {/* Governorate */}
                <label className="font-semibold text-sm text-gray-600 pb-1 block">Governrate</label>
                <input
                  type="text"
                  name="governorate"
                  value={formik.values.governorate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full"
                />
                {formik.errors.governorate && formik.touched.governorate && (
                  <p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.governorate}</p>
                )}

                {/* Governorate */}
                <label className="font-semibold text-sm text-gray-600 pb-1 block">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full"
                />
                {formik.errors.country && formik.touched.country && (
                  <p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.country}</p>
                )}


                {/* Email */}
                <label className="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
                <input
                  type="text"
                  value={formik.values.email}
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full"
                />
                {formik.errors.email && formik.touched.email && (
                  <p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.email}</p>
                )}

                {/* Password */}
                <label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
                <input
                  type="password"
                  value={formik.values.password}
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full"
                />
                {formik.errors.password && formik.touched.password && (
                  <p className="bg-red-300 p-3 rounded-2xl my-2">{formik.errors.password}</p>
                )}

                {/* Phones */}
                <label className="font-semibold text-sm text-gray-600 pb-1 block">Phones:</label>
                {formik.values.AllPhones.map((phone, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      name={`AllPhones[${index}]`}
                      value={phone}
                      onChange={(e) => {
                        const newPhones = [...formik.values.AllPhones];
                        newPhones[index] = e.target.value;
                        formik.setFieldValue("AllPhones", newPhones);
                      }}
                      className="border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full"
                      placeholder="Enter phone"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newPhones = formik.values.AllPhones.filter((_, i) => i !== index);
                        formik.setFieldValue("AllPhones", newPhones);
                      }}
                      className="bg-red-500 text-white rounded-lg px-2 py-1 h-fit self-start"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("AllPhones", [...formik.values.AllPhones, ""])}
                  className="bg-green-500 text-white px-4 py-1 rounded mb-4"
                >
                  + Add Phone
                </button>

                {/* Jobs */}
                <label className="font-semibold text-sm text-gray-600 pb-1 block">Job</label>
                {!jobDiscounts?.length && (
                  <p className="text-xs text-gray-500 mb-2">Loading job list…</p>
                )}

                {formik.values.jobs.map((jobObj, index) => (
                  <div key={index} className="border p-3 mb-3 rounded-lg">
                    <label className="block text-sm text-gray-600">Job Title:</label>
                    <input
                      list="job-list"
                      value={jobObj.job}
                      onChange={(e) => updateJobRow(index, { job: e.target.value })}
                      className="border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full"
                      placeholder="Start typing and choose…"
                    />
                    <datalist id="job-list">
                      {discountOptions.map((label, i) => (
                        <option key={i} value={label} />
                      ))}
                    </datalist>

                    {jobObj.requiresProof && (
                      <span className="inline-block text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded mb-2">
                        Eligible for discount — proof required
                      </span>
                    )}

                    <label className="block text-sm text-gray-600">Gender:</label>
                    <select
                      value={jobObj.gender}
                      onChange={(e) => updateJobRow(index, { gender: e.target.value })}
                      className="border p-2 w-full mb-2 rounded-lg"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>

                    {jobObj.requiresProof && (
                      <>
                        <label className="block text-sm text-gray-600 mb-1">
                          Upload proof (PDF/JPG/PNG)
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            updateJobRow(index, { file });
                          }}
                          className="border rounded-lg px-3 py-2 w-full"
                        />
                        {jobObj.file && (
                          <p className="text-xs text-gray-500 mt-1">Selected: {jobObj.file.name}</p>
                        )}
                        {formik.errors?.jobs?.[index]?.file && (
                          <p className="bg-red-300 p-2 rounded mt-2 text-xs">
                            {formik.errors.jobs[index].file}
                          </p>
                        )}
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const newJobs = formik.values.jobs.filter((_, i) => i !== index);
                        formik.setFieldValue("jobs", newJobs);
                      }}
                      className="bg-red-500 text-white px-4 mt-3 rounded-lg"
                    >
                      Remove Job
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    formik.setFieldValue("jobs", [
                      ...formik.values.jobs,
                      { job: "", gender: "", requiresProof: false, file: null },
                    ])
                  }
                  className="bg-green-500 text-white px-4 py-1 rounded mb-4"
                >
                  + Add Job
                </button>

                <button
                  type="submit"
                  className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                >
                  <span className="inline-block mr-2">Sign Up</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4 inline-block"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </form>

            <div className="py-5">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-center sm:text-left whitespace-nowrap">
                  <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4 inline-block align-text-top"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="inline-block ml-1">Forgot Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      </div>
    </>
  );
}

export default Register;