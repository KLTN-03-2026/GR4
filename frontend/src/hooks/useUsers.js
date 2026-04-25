import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/users";

export const useUsers = () => {
  /* ================= STATE ================= */
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");


  // delete flow
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] = useState(false);
  const [deletedUserName, setDeletedUserName] = useState("");
  /* ================= TOKEN ================= */
  const getToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized");

      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: 10,
          search: searchTerm,
          filter: filter,
        }

      });

      const usersData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      // map BE → UI
      const mapped = usersData.map((u) => {
        const isActive = !!u.is_vip && (!u.vip_expired_at || new Date(u.vip_expired_at) > new Date());
        return {
          id: u.id,
          name: u.username,
          email: u.email,
          role: u.role_name === "Admin" ? "Admin" : "User",
          tier: isActive ? "VIP" : "Regular",
          vip_expired_at: u.vip_expired_at,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            u.username
          )}&background=random`,
        };
      });


      setUsers(mapped);
      setPagination(res.data?.pagination || null);
    } catch (err) {
      console.error("FETCH USERS ERROR:", err);
      setError(err.response?.data?.message || err.message || "Lỗi tải danh sách user");
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT & SEARCH ================= */
  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filter]);


  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers();
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(handler);
  }, [page, searchTerm, filter]);


  /* ================= CHANGE ROLE ================= */
  const handleRoleChange = async (userId, newRole) => {
    const prevUsers = [...users];

    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized");

      const roleMap = {
        Admin: 1,
        User: 2,
      };

      // 🔥 Optimistic update (UI trước)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );

      await axios.put(
        `${API_URL}/update/${userId}`,
        { role_id: roleMap[newRole] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } catch (err) {
      console.error("UPDATE ROLE ERROR:", err);

      // rollback nếu lỗi
      setUsers(prevUsers);

      alert(
        err.response?.data?.message ||
        "Cập nhật role thất bại"
      );
    }
  };

  /* ================= DELETE ================= */
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    // ❌ CHẶN xóa Admin
    if (selectedUser.role === "Admin") {
      alert("Không thể xóa tài khoản Admin");
      return;
    }

    const prevUsers = [...users];

    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized");

      // lưu tên để show UI
      setDeletedUserName(selectedUser.name);

      // optimistic UI
      setUsers((prev) =>
        prev.filter((u) => u.id !== selectedUser.id)
      );

      await axios.delete(`${API_URL}/${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // đóng modal confirm
      setIsDeleteModalOpen(false);
      setSelectedUser(null);

      // ✅ mở modal success
      setIsDeleteSuccessModalOpen(true);

    } catch (err) {
      console.error("DELETE ERROR:", err);

      // rollback
      setUsers(prevUsers);

      alert(
        err.response?.data?.message ||
        "Xóa user thất bại"
      );
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };
  const closeDeleteSuccessModal = () => {
    setIsDeleteSuccessModalOpen(false);
    setDeletedUserName("");
  };

  /* ================= RETURN ================= */
  return {
    users,
    loading,
    error,
    page,
    setPage,
    pagination,

    searchTerm,
    setSearchTerm,

    fetchUsers,
    handleRoleChange,

    handleDeleteClick,
    handleConfirmDelete,
    closeDeleteModal,

    // modal
    selectedUser,
    isDeleteModalOpen,

    // ✅ thêm
    isDeleteSuccessModalOpen,
    closeDeleteSuccessModal,
    deletedUserName,

    filter,
    setFilter,
  };
};