import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Login  = ()=>{
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();

    const mockUsers = [
        { id: 1, name: "John Doe", email: "john.doe@example.com", password: "password123", role: "buyer" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com", password: "securepass456", role: "seller" },
        { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com", password: "mypassword789", role: "buyer" },
        { id: 4, name: "Auto Dealer", email:"seller@example.com", password: "password123", role: "seller" }
    ];

    const handleSubmit = (e) =>{
        e.preventDefault();
        setError("");

        const user = mockUsers.find(u => u.email === email && u.password === password);
        if(user){
            login(user);
            if(user.role === "buyer"){
                navigate("/");
            }else if(user.role === "seller"){
                navigate("/seller/dashboard");
            }
        }   
        else{
            setError("Invalid email or password");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">Login</h2>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      );
};
export default Login;