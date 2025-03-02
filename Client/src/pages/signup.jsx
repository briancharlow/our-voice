import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const locations = ["Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa", "Homa Bay", "Isiolo", 
    "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", 
    "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", 
    "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", 
    "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka Nithi", "Trans Nzoia", "Turkana", 
    "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"];

export default function Signup() {
  const [formData, setFormData] = useState({ email: "", password: "", location: "" });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/users/register", formData);
      setMessage("Signup successful! Redirecting...");
      setMessageType("success");
      setTimeout(() => {
        setMessage(null);
        navigate("/login");
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
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
          <select
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#008EAC]"
          >
            <option value="">Location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-[#008EAC] text-white py-2 rounded-md hover:bg-opacity-80"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-black">
          Already have an account? 
          <span 
            className="text-[#FD3636] cursor-pointer" 
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
