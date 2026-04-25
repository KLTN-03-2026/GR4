import { useEffect, useMemo, useState } from 'react';
import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentsByMovie,
} from '../service/comment_service';

const formatCreatedAt = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const normalizeComments = (rawComments) =>
  rawComments.map((comment) => ({
    id: comment.id,
    user: comment.username || comment.user || 'Người dùng',
    movie: comment.movie || comment.title || 'Phim',
    avatar:
      comment.avatar || comment.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.username || comment.user || 'User')}`,
    content: comment.content || comment.comment || '',
    rating: comment.rating || 0,
    createdAt: comment.createdAt || comment.create_at || '',
    time: formatCreatedAt(comment.createdAt || comment.create_at),
    userId: comment.userId || comment.user_id,
    movieId: comment.movieId || comment.movie_id,
  }));

export function useComments(movieId) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] =
    useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = movieId
        ? await getCommentsByMovie(movieId, { page, search: searchTerm })
        : await getAllComments({ page, search: searchTerm });

      // response format handle
      const received = response.data || {};
      const rawComments = Array.isArray(received)
        ? received
        : received.data || [];

      setComments(normalizeComments(rawComments));
      if (response.pagination || received.pagination) {
        setPagination(response.pagination || received.pagination);
      }
    } catch (err) {
      console.error("Fetch comments failed", err);
      setError("Không thể tải bình luận. Vui lòng thử lại.");
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT & SEARCH ================= */
  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchComments();
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(handler);
  }, [movieId, page, searchTerm]);

  const addComment = async () => {
    if (!movieId) return;
    if (!newComment.trim()) {
      setError("Nội dung bình luận không được để trống");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createComment({ movieId, content: newComment.trim() });
      setNewComment("");
      await fetchComments();
    } catch (err) {
      console.error("Add comment failed", err);
      setError("Gửi bình luận thất bại. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (comment) => {
    setSelectedComment(comment);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedComment) return;
    setLoading(true);

    try {
      await deleteComment(selectedComment.id);
      setComments((prev) => prev.filter((c) => c.id !== selectedComment.id));
      setIsDeleteModalOpen(false);
      setIsDeleteSuccessModalOpen(true);
    } catch (err) {
      console.error("Delete comment failed", err);
      setError("Xoá bình luận thất bại. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const closeDeleteSuccessModal = () => setIsDeleteSuccessModalOpen(false);

  return {
    comments,
    newComment,
    setNewComment,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    pagination,
    isDeleteModalOpen,
    isDeleteSuccessModalOpen,
    selectedComment,
    handleDeleteClick,
    handleConfirmDelete,
    closeDeleteModal,
    closeDeleteSuccessModal,
    addComment,
    fetchComments,
    loading,
    error,
  };
}
