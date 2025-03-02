import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="text-lg text-gray-700 mt-2">Page Not Found</p>
      <Link
        to="/"
        className="mt-4 px-6 py-2 bg-[#008EAC] text-white rounded-md hover:bg-opacity-80"
      >
        Go Home
      </Link>
    </div>
  );
}
