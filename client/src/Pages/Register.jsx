import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Register() {
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const firstnameRef = useRef(null);
  const lastnameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const username = usernameRef.current.value.trim();
    const firstname = firstnameRef.current.value.trim();
    const lastname = lastnameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    const confirmPassword = confirmPasswordRef.current.value.trim();

    // Simple validation
    if (!username || !firstname || !lastname || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await api.post("/users/register", {
        username,
        firstname,
        lastname,
        email,
        password,
      });

      if (res.status === 200 || res.status === 201) {
        setSuccessMsg("Registration successful! Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setErrorMsg(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f9fafb",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "300px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#2563eb" }}>
          Create Account
        </h2>

        <label>Username</label>
        <input ref={usernameRef} type="text" placeholder="username" className="input" />

        <label>First Name</label>
        <input ref={firstnameRef} type="text" placeholder="firstname" className="input" />

        <label>Last Name</label>
        <input ref={lastnameRef} type="text" placeholder="lastname" className="input" />

        <label>Email</label>
        <input ref={emailRef} type="email" placeholder="email" className="input" />

        <label>Password</label>
        <input ref={passwordRef} type="password" placeholder="password" className="input" />

        <label>Confirm Password</label>
        <input
          ref={confirmPasswordRef}
          type="password"
          placeholder="confirm password"
          className="input"
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            marginTop: "15px",
            cursor: "pointer",
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}
        {successMsg && <p style={{ color: "green", marginTop: "10px" }}>{successMsg}</p>}

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#2563eb" }}>
            Login
          </a>
        </p>
      </form>

      {/* Inline Input Styles */}
      <style>
        {`
        .input {
          width: 100%;
          padding: 8px;
          margin: 6px 0 12px 0;
          border: 1px solid #ddd;
          border-radius: 6px;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: #2563eb;
        }
      `}
      </style>
    </section>
  );
}

export default Register;
