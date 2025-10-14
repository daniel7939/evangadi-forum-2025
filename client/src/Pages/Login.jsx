import React, { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AppState } from "../App";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AppState); // ✅ get setUser from context

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const emailValue = emailRef.current.value.trim();
    const passwordValue = passwordRef.current.value.trim();

    if (!emailValue || !passwordValue) {
      alert("⚠️ Please fill in all fields");
      return;
    }

    try {
      const response = await api.post("/users/login", {
        email: emailValue,
        password: passwordValue,
      });

      // Save token in localStorage
      localStorage.setItem("token", response.data.token);

      // ✅ Set user context so Home can show username
      setUser({ username: response.data.username, email: emailValue });

      alert("✅ Login successful!");
      navigate("/"); // Go to home page after login
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.msg) {
        alert(`❌ ${error.response.data.msg}`);
      } else {
        alert("❌ Something went wrong. Please try again.");
      }
    }
  }

  return (
    <section style={{ textAlign: "center", marginTop: "50px" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "inline-block",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          background: "#f9f9f9",
        }}
      >
        <h2>Login</h2>

        <div style={{ marginBottom: "10px" }}>
          <span>Email: </span>
          <input
            ref={emailRef}
            type="email"
            placeholder="Enter email"
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <span>Password: </span>
          <input
            ref={passwordRef}
            type="password"
            placeholder="Enter password"
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            background: "blue",
            color: "white",
            padding: "8px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>
        Don’t have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
    </section>
  );
}

export default Login;
