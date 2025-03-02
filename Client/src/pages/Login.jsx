import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/users/login", formData, { withCredentials: true });

      // Fetch user session details
      const sessionResponse = await axios.get("http://localhost:4000/users/session", { withCredentials: true });
      const user = sessionResponse.data.user;

      setMessage("Login successful! Redirecting...");
      setMessageType("success");

      // Redirect based on role
      setTimeout(() => {
        if (user?.Role === "Citizen") {
          navigate("/citizen-dashboard");
        } else {
          navigate("/dashboard"); // Default dashboard for other roles
        }
      }, 2000);
      
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
      setMessageType("error");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="p-8 border-2 rounded-lg w-96 border-[#008EAC]">
        <h1 className="text-center font-bold text-lg mb-4">
          Join Us today, <span className="text-[#55945C]">as we Build </span>
          <span className="text-[#FD3636]">Kenya</span>, For Kenyans
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
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#008EAC]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#008EAC]"
          />
          <button
            type="submit"
            className="w-full bg-[#008EAC] text-white py-2 rounded-md hover:bg-opacity-80"
          >
            Log in
          </button>
        </form>
        <p className="text-center mt-4 text-black">
          Don't have an account? 
          <span className="text-[#FD3636] cursor-pointer" onClick={() => navigate("/signup")}>
            SignUp
          </span>
        </p>
        <p className="text-center text-[#FD3636] cursor-pointer mt-2" onClick={() => navigate("/forgot-password")}>Forgot Password?</p>
      </div>
    </div>
  );
}
