import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(false); // Toggle between Login and Signup

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
    <div>
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      {!isLogin && <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />}
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>{isLogin ? "Login" : "Sign Up"}</button>
      <p>{message}</p>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
      </button>
    </div>
  );
}

export default App;
