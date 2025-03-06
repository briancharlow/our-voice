import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const navigate = useNavigate();
  const { token } = useParams();

  console.log('token',token);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    try {
     let response= await axios.post("http://localhost:80/users/reset-password", {
        token,
        newPassword: formData.newPassword,
      });

      console.log('response',response);
      setMessage("Password reset successful! Redirecting to login...");
      setMessageType("success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Password reset failed");
      setMessageType("error");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="p-8 border-2 rounded-lg w-96 border-[#008EAC]">
        <h1 className="text-center font-bold text-lg mb-4">
          Reset Your <span className="text-[#FD3636]">Password</span>
        </h1>
        {message && (
          <div className={`p-2 text-center text-white rounded ${messageType === "success" ? "bg-green-500" : "bg-red-500"}`}>{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            required
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#008EAC]"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#008EAC]"
          />
          <button
            type="submit"
            className="w-full bg-[#008EAC] text-white py-2 rounded-md hover:bg-opacity-80"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
