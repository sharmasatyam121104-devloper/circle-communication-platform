import { AlertTriangle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ErrorPageProps = {
  message?: string;
};

const ErrorPage = ({ message = "Something went wrong. Please try again later.",}: ErrorPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center rounded-2xl border bg-white p-8 shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-red-100">
            <AlertTriangle size={40} />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">
          Oops!
        </h1>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium border hover:shadow-md transition-all"
        >
          <Home size={18} />
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;