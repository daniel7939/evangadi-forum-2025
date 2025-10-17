import React, { useContext } from "react";
import { AppState } from "../App";

function Home() {
  const { user } = useContext(AppState);

  if (!user)
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
        Loading user information...
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        background: "#f0f4f8",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        margin: "40px auto",
        width: "400px",
      }}
    >
      <h1 style={{ color: "#2563eb", marginBottom: "10px" }}>Welcome!</h1>
      <h2 style={{ color: "#1e293b" }}>Hello, {user.username || user }</h2>
      <p style={{ color: "#475569", marginTop: "10px" }}>
        You are now successfully logged in.
      </p>
      {/* <button
  onClick={() => {
    localStorage.removeItem("token");
    setUser(null); // from AppState
  }}
  style={{
    marginTop: "20px",
    padding: "8px 16px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  Logout
</button> */}

    </div>
  );
}

export default Home;
