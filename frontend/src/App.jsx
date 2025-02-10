import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(false); // Toggle Login/Signup

  const handleSubmit = async () => {
    const endpoint = isLogin ? "login" : "signup";
    const requestBody = isLogin ? { username, password } : { username, email, password };

    const response = await fetch(`http://127.0.0.1:8080/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(requestBody),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage(data.message);
    } else {
      setMessage(`Error: ${data.detail}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      {/* Flowchart Section (Will add image later) */}
      <div className="w-full max-w-2xl bg-white p-8 shadow-md rounded-xl mb-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800">Welcome to Our App</h1>
        <p className="text-gray-600 text-center mt-2">
          Securely sign up or log in to access your account.
        </p>
      </div>

      {/* Auth Form */}
      <div className="w-full max-w-md bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          {isLogin ? "Login" : "Signup"}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setUsername(e.target.value)}
          />
          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg"
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold"
            onClick={handleSubmit}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <p className="text-center text-gray-700 mt-3">{message}</p>
        )}

        {/* Toggle Login/Signup */}
        <button
          className="w-full text-blue-500 hover:underline mt-4"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}

export default App;
