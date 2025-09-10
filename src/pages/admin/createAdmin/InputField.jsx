// InputField.jsx
const InputField = ({ label, name, register, error, type = "text" }) => (
  <div>
    <label className="block font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      {...register(name)}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-400"
          : "border-gray-300 focus:ring-purple-400"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

export default InputField;
