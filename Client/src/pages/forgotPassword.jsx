import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/users/forgot-password", { email });
      setMessage("Password reset link sent! Check your email.");
      setMessageType("success");
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send reset email");
      setMessageType("error");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="p-8 border-2 rounded-lg w-96 border-[#008EAC]">
        <h1 className="text-center font-bold text-lg mb-4">
          Reset Your Password
        </h1>
        {message && (
          <div
            className={`p-2 text-center text-white rounded ${
              messageType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#008EAC]"
          />
          <button
            type="submit"
            className="w-full bg-[#008EAC] text-white py-2 rounded-md hover:bg-opacity-80"
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-center mt-4 text-black">
          Remembered your password?
          <span
            className="text-[#FD3636] cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
