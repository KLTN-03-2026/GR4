import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/genre";

export const useGenres = () => {
  /* ================= STATE ================= */
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);

  /* ================= TOKEN ================= */
  const getToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  /* ================= FETCH ALL GENRES ================= */
  const fetchGenres = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(API_URL, { headers });
      setGenres(res.data || []);
    } catch (err) {
      console.error("FETCH GENRES ERROR:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Lỗi tải danh sách thể loại"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH GENRE BY ID ================= */
  const fetchGenreById = async (genreId) => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API_URL}/${genreId}`, { headers });
      setSelectedGenre(res.data);
      return res.data;
    } catch (err) {
      console.error("FETCH GENRE BY ID ERROR:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Lỗi tải thông tin thể loại"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    fetchGenres();
  }, []);

  /* ================= RETURN ================= */
  return {
    genres,
    selectedGenre,
    loading,
    error,

    fetchGenres,
    fetchGenreById,
    setSelectedGenre,
  };
};
