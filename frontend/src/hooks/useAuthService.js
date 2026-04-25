import { useEffect, useState } from "react";
import axios from "axios";

const AUTH_API_URL = "http://localhost:3000/api/users";

export const useAuthService = () => {
  /* ================= STATE ================= */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* ================= TOKEN ================= */
  const getToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const setToken = (token, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem("token", token);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", token);
      localStorage.removeItem("token");
    }
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };

  /* ================= LOGIN ================= */
  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await axios.post(`${AUTH_API_URL}/login`, {
        email,
        password,
      });

      if (res.data.token) {
        setToken(res.data.token, rememberMe);
      }

      setSuccessMessage("Đăng nhập thành công");
      return res.data;
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Lỗi đăng nhập";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */
  const register = async (userData) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await axios.post(`${AUTH_API_URL}/register`, userData);

      setSuccessMessage("Đăng ký thành công");
      return res.data;
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Lỗi đăng ký";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (token) {
        // Only remove token locally, the backend doesn't have a logout endpoint
        // but we'll keep this structure for future use
      }

      removeToken();
      setSuccessMessage("Đăng xuất thành công");
      return true;
    } catch (err) {
      console.error("LOGOUT ERROR:", err);
      // Still remove token even if logout fails
      removeToken();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY TOKEN ================= */
  const verifyToken = async () => {
    const token = getToken();
    if (!token) return false;

    try {
      const res = await axios.get(`${AUTH_API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data ? true : false;
    } catch (err) {
      console.error("VERIFY TOKEN ERROR:", err);
      removeToken();
      return false;
    }
  };

  /* ================= REFRESH TOKEN ================= */
  const refreshToken = async () => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    setLoading(true);
    setError("");

    try {
      // The backend doesn't have a refresh endpoint, so we'll just validate the existing token
      const res = await axios.get(`${AUTH_API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      console.error("REFRESH TOKEN ERROR:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Lỗi làm mới token"
      );
      removeToken();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ================= RETURN ================= */
  return {
    loading,
    error,
    successMessage,

    getToken,
    setToken,
    removeToken,

    login,
    register,
    logout,
    verifyToken,
    refreshToken,
  };
};
