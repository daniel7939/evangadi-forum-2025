import { useEffect, useState, createContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./Pages/Register";
import Login from "./pages/Login";
import api from "./api"; // your axios instance

export const AppState = createContext();

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  async function checkUser() {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const { data } = await api.get("/users/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user); // ✅ important: set user here
    } catch (error) {
      // console.error("Check user error:", error.response?.data || error);
      navigate("/login");
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AppState.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AppState.Provider>
  );
}

export default App;
