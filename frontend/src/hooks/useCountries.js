import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/countrie";

export const useCountries = () => {
  /* ================= STATE ================= */
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  /* ================= TOKEN ================= */
  const getToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  /* ================= FETCH ALL COUNTRIES ================= */
  const fetchCountries = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(API_URL, { headers });
      setCountries(res.data || []);
    } catch (err) {
      console.error("FETCH COUNTRIES ERROR:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Lỗi tải danh sách quốc gia"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH COUNTRY BY ID ================= */
  const fetchCountryById = async (countryId) => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API_URL}/${countryId}`, { headers });
      setSelectedCountry(res.data);
      return res.data;
    } catch (err) {
      console.error("FETCH COUNTRY BY ID ERROR:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Lỗi tải thông tin quốc gia"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    fetchCountries();
  }, []);

  /* ================= RETURN ================= */
  return {
    countries,
    selectedCountry,
    loading,
    error,

    fetchCountries,
    fetchCountryById,
    setSelectedCountry,
  };
};
