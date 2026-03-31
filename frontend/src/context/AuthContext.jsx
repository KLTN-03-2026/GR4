import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, updateProfile as updateProfileAPI, changePassword as changePasswordAPI } from "../service/user_service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStoredToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const getStoredUser = () =>
    localStorage.getItem("user") || sessionStorage.getItem("user");

  useEffect(() => {
    const savedToken = getStoredToken();
    const savedUser = getStoredUser();

    if (savedToken) setToken(savedToken);

    try {
      if (savedUser && savedUser !== "undefined") {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Lỗi parse user:", err);
      setUser(null);
    }

    if (!savedToken) {
      setLoading(false);
    }

    const handleStorageChange = () => {
      const updatedToken = getStoredToken();
      const updatedUser = getStoredUser();

      setToken(updatedToken);

      try {
        setUser(
          updatedUser && updatedUser !== "undefined"
            ? JSON.parse(updatedUser)
            : null
        );
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const savedToken = getStoredToken();
      if (!savedToken) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const res = await getProfile();

        const roleName = res.data.role || res.data.role_name;
        const userData = {
          ...res.data,
          name: res.data.username,
          role_id: res.data.role_id,
          role:
            typeof roleName === 'string'
              ? roleName.toLowerCase() === 'admin'
                ? 'admin'
                : 'user'
              : res.data.role_id === 1
              ? 'admin'
              : 'user',
        };

        setUser(userData);

        if (localStorage.getItem("token")) {
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          sessionStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async (data) => {
    try {
      await updateProfileAPI(data);

      const res = await getProfile();

      const roleName = res.data.role || res.data.role_name;
      const userData = {
        ...res.data,
        name: res.data.username,
        role_id: res.data.role_id,
        role:
          typeof roleName === 'string'
            ? roleName.toLowerCase() === 'admin'
              ? 'admin'
              : 'user'
            : res.data.role_id === 1
            ? 'admin'
            : 'user',
      };

      setUser(userData);

      if (localStorage.getItem("token")) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (err) {
      throw err;
    }
  };

const changePassword = async (data) => {
  try {
    await changePasswordAPI(data);
  } catch (err) {
    throw err;
  }
};

  const login = (token, user, remember = false) => {
    setToken(token);
    setUser(user || null);

    if (remember) {
      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("token", token);
      if (user) sessionStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, updateProfile, changePassword  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);