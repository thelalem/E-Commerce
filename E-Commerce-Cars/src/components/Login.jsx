import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  // State variables to store email, password, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Access the login function from the AuthContext
  const { login } = useAuth();

  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  // Mock user data for authentication
  const mockUsers = [
    { id: 4, name: "John Doe", email: "john.doe@example.com", password: "password123", role: "buyer" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", password: "securepass456", role: "seller" },
    { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com", password: "mypassword789", role: "buyer" },
    { id: 1, name: "Auto Dealer", email: "seller@example.com", password: "password123", role: "seller" },
    { id: 5, name: "Thelalem Arg", email: "thelalemarg@gmail.com", password: "password123", role: "buyer" },
  ];

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    if (storedUsers.length === 0) {
      localStorage.setItem("users", JSON.stringify(mockUsers));
    }
  },[]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear any previous error messages

    // Find a user in the mock data that matches the entered email and password
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const user = storedUsers.find(u => u.email === email && u.password === password);
    if (user) {
      login(user); // Call the login function with the user data

      // Navigate to different routes based on the user's role
      if (user.role === "buyer") {
        navigate("/");
      } else if (user.role === "seller") {
        navigate("/seller/dashboard");
      }
    } else {
      // Set an error message if authentication fails
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Login</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email input field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          {/* Password input field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          {/* Display error message if authentication fails */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        {/* Link to the registration page */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;