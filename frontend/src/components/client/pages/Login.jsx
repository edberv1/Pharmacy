import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContexts";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const handleSubmit = (event) => {
    event.preventDefault();
  
    fetch("http://localhost:8081/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Ensure cookies are sent
    })
      .then((response) => {
        if (!response.ok) {
          setLoginStatus(false);
          setError("Login failed. Please try again.");
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", data.email);
  
        // Update user state
        setUser({ email: data.email, role: data.role });
  
        // Navigate based on role
        switch (data.role) {
          case 'superadmin':
            navigate("/superadmin");
            break;
          case 'admin':
            navigate("/admin");
            break;
          default:
            navigate("/"); // default route for other roles
        }
      })
      .catch((error) => {
        console.error("Login Error:", error);
      });
  };
  

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <img
            className="mx-auto h-10 w-auto"
            src="https://www.svgrepo.com/show/301692/login.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Login to your account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mt-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  placeholder="user@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            {loginStatus === false && (
              <div className="text-red-500 mt-2">Login failed. Please try again.</div>
            )}

            <div className="mt-6">
              <span className="block w-full rounded-md shadow-sm">
                <button
                  type="submit"
                  className="w-full mb-2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  Login
                </button>
                <span className="text-gray-400 ">Don't have an account?</span>
                <span className="text-blue-500 hover:underline cursor-pointer pl-1 hover:font-semibold">
                  <Link to="../signup">Sign Up. </Link>
                </span>{" "}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
