import React, { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    // **Frontend Validation**
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }
    if (!isLogin && !email.trim()) {
      setError("Email cannot be empty.");
      return;
    }
    if (!password.trim()) {
      setError("Password cannot be empty.");
      return;
    }

    setIsLoading(true);

    const endpoint = isLogin ? "login" : "signup";
    const requestBody = isLogin ? { username, password } : { username, email, password };

    try {
      const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(`Error: ${data.detail || "Something went wrong!"}`);
      }
    } catch (err) {
      setError("Could not connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-gray-100">
      {/* Left: Flowchart Section */}
      <div className="w-1/2 h-screen flex items-center justify-center bg-white shadow-lg">
        <img src="/flowchart.gif" alt="Flowchart Animation" className="w-full h-full object-cover rounded-lg shadow-md" />
      </div>

      {/* Right: Auth Form Section */}
      <div className="w-1/2 flex flex-col justify-center items-center px-12">
        <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
          <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
            {isLogin ? "Login" : "Signup"}
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 border rounded-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {!isLogin && (
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className={`w-full p-3 rounded-lg font-semibold ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-center text-red-600 mt-3">{error}</p>}

          {/* Success Message */}
          {message && <p className="text-center text-green-600 mt-3">{message}</p>}

          {/* Toggle Login/Signup */}
          <button
            className="w-full text-blue-500 hover:underline mt-4"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(""); // Clear errors when switching forms
              setMessage(""); // Clear messages when switching forms
            }}
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
