import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  Star,
  Clock,
  Calendar,
  X,
  Upload,
  ChevronDown,
  Globe,
  Tag,
  Gem,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils.js';
import { useMovies } from '../../hooks/useMovies.js';
import { PageHeader } from '../../components/shared/PageHeader.jsx';
import { MultiSelectGenre } from '../../components/shared/MultiSelectGenre.jsx';
import { toDateInput } from '../../utils/date.js';
import { useState } from 'react';

export default function MovieManagement() {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const {
    movies,
    genres,
    countries,
    isLoading,
    error,
    isAddModalOpen,
    isEditModalOpen,
    isSuccessModalOpen,
    isDeleteConfirmOpen,
    selectedMovie,
    movieToDelete,
    successType,
    formData,
    handleFormChange,
    handleFileChange,
    handleAddMovie,
    handleEditClick,
    handleUpdateMovie,
    handleDeleteMovie,
    confirmDeleteMovie,
    closeDeleteConfirm,
    closeAddModal,
    openAddModal,
    closeEditModal,
    closeSuccessModal,
    avatarPreview,
    backgroundPreview,
    searchTerm,
    setSearchTerm,
    filterGenre,
    setFilterGenre,
    filterCountry,
    setFilterCountry,
    sortBy,
    setSortBy,
    page,
    setPage,
    pagination,
  } = useMovies();

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Thư viện phim"
        description="Quản lý danh sách phim, lịch chiếu và nội dung đa phương tiện."
        badge="Content Library"
      >
        <button 
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className={cn(
            "px-6 py-3 rounded-xl border text-sm font-bold transition-all flex items-center gap-2",
            isFilterVisible 
              ? "bg-primary-container/10 border-primary-container text-primary-container" 
              : "bg-surface-container border-outline-variant/20 text-on-surface hover:bg-surface-container-high"
          )}
        >
          <Filter className="w-4 h-4" />
          {isFilterVisible ? 'Đóng bộ lọc' : 'Bộ lọc'}
        </button>
        <button
          onClick={openAddModal}
          className="px-6 py-3 bg-primary-container text-white rounded-xl text-sm font-black shadow-xl shadow-primary-container/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          Thêm phim mới
        </button>
      </PageHeader>

      <div className="bg-surface-container-low rounded-[2rem] overflow-hidden border border-outline-variant/10 shadow-2xl">
        <AnimatePresence>
          {isFilterVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-surface-container-high/20 border-b border-outline-variant/10"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Tìm kiếm</label>
                  <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-xl border border-outline-variant/10 focus-within:ring-2 focus-within:ring-primary-container/30 transition-all">
                    <Search className="w-4 h-4 text-on-surface-variant" />
                    <input
                      className="bg-transparent border-none text-sm focus:ring-0 outline-none w-full placeholder:text-on-surface-variant/40"
                      placeholder="Tên phim, đạo diễn..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Thể loại</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <select
                      className="w-full bg-surface-container border border-outline-variant/10 rounded-xl pl-12 pr-10 py-2.5 text-sm font-bold text-on-surface appearance-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                      value={filterGenre}
                      onChange={(e) => setFilterGenre(e.target.value)}
                    >
                      <option value="">Tất cả thể loại</option>
                      {genres.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Quốc gia</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-grow">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <select
                        className="w-full bg-surface-container border border-outline-variant/10 rounded-xl pl-12 pr-10 py-2.5 text-sm font-bold text-on-surface appearance-none focus:ring-2 focus:ring-primary-container/30 transition-all"
                        value={filterCountry}
                        onChange={(e) => setFilterCountry(e.target.value)}
                      >
                        <option value="">Tất cả quốc gia</option>
                        {countries.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    </div>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterGenre('');
                        setFilterCountry('');
                      }}
                      className="p-2.5 bg-surface-container rounded-xl border border-outline-variant/10 text-on-surface-variant hover:text-primary-container hover:border-primary-container/30 transition-all"
                      title="Xóa bộ lọc"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6 border-b border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest italic">
              Hiện có <span className="text-on-surface font-black not-italic">{pagination?.total || 0}</span> tác phẩm
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Sắp xếp:</span>
            <select
              className="bg-transparent border-none text-xs font-bold text-on-surface focus:ring-0 cursor-pointer uppercase tracking-widest"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Mới nhất</option>
              <option>Lượt xem cao</option>
              <option>Đánh giá cao</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/30">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Phim & Thông tin</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Thể loại</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Ngày phát hành</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant text-center">VIP</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {isLoading && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-on-surface-variant">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}
              {error && !isLoading && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-primary-container">
                    Lỗi: {error}
                  </td>
                </tr>
              )}
              {!isLoading && !error && movies.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-on-surface-variant">
                    Không có dữ liệu phim
                  </td>
                </tr>
              )}
              {!isLoading && !error && movies.length > 0 && movies.map((movie) => (
                <tr key={movie.id} className="hover:bg-surface-container-high/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-20 rounded-xl overflow-hidden bg-surface-container-highest shadow-lg shrink-0">
                        <img 
                          alt={movie.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          src={movie.avatar_url || 'https://via.placeholder.com/50x75'} 
                          referrerPolicy="no-referrer"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/50x75'}
                        />
                      </div>
                      <div>
                        <p className="font-black text-sm text-on-surface group-hover:text-primary-container transition-colors">{movie.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-on-surface-variant">
                            {movie.country}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-on-surface-variant">{movie.genres || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                      <Calendar className="w-3 h-3" />
                      {movie.release_date ? new Date(movie.release_date).toLocaleDateString('vi-VN') : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {movie.required_vip_level > 0 ? (
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]" title={`Yêu cầu VIP Level: ${movie.required_vip_level}`}>
                          <Gem className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="text-on-surface-variant/20">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(movie)}
                        className="p-2.5 rounded-xl bg-surface-container-highest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMovie(movie.id)}
                        className="p-2.5 rounded-xl bg-surface-container-highest text-on-surface-variant hover:text-primary-container hover:bg-primary-container/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 rounded-xl bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.total > 0 && (
          <div className="p-6 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-4 bg-surface-container-high/10">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Hiển thị {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)} 
              {` `}trên {pagination.total} phim
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-xl bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button 
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    p === page 
                      ? 'bg-primary-container text-white shadow-lg shadow-primary-container/20 font-black' 
                      : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button 
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.totalPages}
                className="p-2 rounded-xl bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Movie Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dim/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface-container w-full max-w-4xl rounded-[2.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.6)] overflow-hidden border border-outline-variant/20 flex flex-col max-h-[90vh]"
            >
              <div className="px-10 pt-10 pb-6 flex justify-between items-center bg-surface-container-high/30">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black font-headline tracking-tight text-on-surface uppercase italic">Thêm phim mới</h2>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em]">Cấu hình thông tin và nội dung đa phương tiện</p>
                </div>
                <button
                  onClick={closeAddModal}
                  className="p-3 hover:bg-surface-container-high rounded-2xl transition-all text-on-surface-variant hover:text-on-surface"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Poster Phim (2:3)</label>
                      <label htmlFor="add-avatar-upload" className="aspect-[2/3] bg-surface-container-high rounded-3xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-4 hover:border-primary-container/50 transition-all cursor-pointer group relative overflow-hidden">
                        <input
                          id="add-avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileChange('avatar', file);
                          }}
                        />
                        {avatarPreview || formData.avatar_url ? (
                          <img
                            src={avatarPreview || formData.avatar_url}
                            alt="Poster preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/300x450')}
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-on-surface-variant" />
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tải lên Poster</span>
                          </div>
                        )}
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Ảnh bìa (16:9)</label>
                      <label htmlFor="add-background-upload" className="aspect-video bg-surface-container-high rounded-3xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-4 hover:border-primary-container/50 transition-all cursor-pointer group relative overflow-hidden">
                        <input
                          id="add-background-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileChange('background', file);
                          }}
                        />
                        {backgroundPreview || formData.background_url ? (
                          <img
                            src={backgroundPreview || formData.background_url}
                            alt="Backdrop preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/1280x720')}
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-on-surface-variant" />
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tải lên Backdrop</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Tiêu đề phim</label>
                        <input 
                          className="w-full bg-surface-container-high border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary-container transition-all" 
                          placeholder="Nhập tên phim..."
                          value={formData.title}
                          onChange={(e) => handleFormChange('title', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Ngày phát hành</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                          <input 
                            type="date" 
                            className="w-full bg-surface-container-high border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary-container transition-all"
                            value={toDateInput(formData.release_date)}
                            onChange={(e) => handleFormChange('release_date', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Quốc gia</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                          <select 
                            className="w-full bg-surface-container-high border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary-container transition-all appearance-none"
                            value={formData.country_id}
                            onChange={(e) => handleFormChange('country_id', Number(e.target.value))}
                          >
                            <option value="">Chọn quốc gia</option>
                            {countries.map(country => (
                              <option key={country.id} value={country.id}>{country.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <MultiSelectGenre 
                          genres={genres}
                          selectedIds={formData.genre_ids}
                          onChange={(newIds) => handleFormChange('genre_ids', newIds)}
                          label="Thể loại"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Mô tả nội dung</label>
                      <textarea 
                        rows={4} 
                        className="w-full bg-surface-container-high border-none rounded-3xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary-container transition-all resize-none" 
                        placeholder="Nhập tóm tắt nội dung phim..."
                        value={formData.description}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Link Phim (Streaming)</label>
                        <input 
                          className="w-full bg-surface-container-high border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary-container transition-all" 
                          placeholder="https://..."
                          value={formData.movie_url}
                          onChange={(e) => handleFormChange('movie_url', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Link Trailer (YouTube)</label>
                        <input 
                          className="w-full bg-surface-container-high border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary-container transition-all" 
                          placeholder="https://youtube.com/..."
                          value={formData.trailer_url}
                          onChange={(e) => handleFormChange('trailer_url', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-surface-container-high/20 rounded-3xl border border-outline-variant/10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-container/10 rounded-2xl">
                          <Star className="w-6 h-6 text-primary-container" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-on-surface uppercase tracking-tight">Yêu cầu VIP Access</p>
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Chỉ dành cho thành viên trả phí</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          className="sr-only peer" 
                          type="checkbox"
                          checked={formData.required_vip_level > 0}
                          onChange={(e) => handleFormChange('required_vip_level', e.target.checked ? 1 : 0)}
                        />
                        <div className="w-14 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container shadow-inner"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-surface-container-high/30 border-t border-outline-variant/10 flex flex-col md:flex-row gap-4">
                <button
                  onClick={handleAddMovie}
                  className="flex-1 bg-primary-container text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary-container/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Xác nhận lưu phim
                </button>
                <button
                  onClick={closeAddModal}
                  className="px-10 py-5 bg-transparent text-on-surface-variant hover:text-on-surface font-bold text-sm uppercase tracking-widest transition-colors"
                >
                  Hủy bỏ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Movie Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dim/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface-container w-full max-w-4xl rounded-[2.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.6)] overflow-hidden border border-outline-variant/20 flex flex-col max-h-[90vh]"
            >
              <div className="px-10 pt-10 pb-6 flex justify-between items-center bg-surface-container-high/30">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black font-headline tracking-tight text-on-surface uppercase italic">Cập nhật thông tin phim</h2>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em]">Thay đổi thông tin cho phim: {selectedMovie?.title}</p>
                </div>
                <button
                  onClick={closeEditModal}
                  className="p-3 hover:bg-surface-container-high rounded-2xl transition-all text-on-surface-variant hover:text-on-surface"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Poster Phim (2:3)</label>
                      <label htmlFor="edit-avatar-upload" className="aspect-[2/3] bg-surface-container-high rounded-3xl border-2 border-primary-container/30 overflow-hidden group relative cursor-pointer">
                        <input
                          id="edit-avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileChange('avatar', file);
                          }}
                        />
                        <img 
                          alt="Poster" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          src={avatarPreview || formData.avatar_url || selectedMovie?.avatar_url || 'https://via.placeholder.com/300x450'} 
                          referrerPolicy="no-referrer"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/300x450'}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-10 h-10 text-white" />
                        </div>
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Ảnh bìa (16:9)</label>
                      <label htmlFor="edit-background-upload" className="aspect-video bg-surface-container-high rounded-3xl border-2 border-outline-variant/30 overflow-hidden group relative cursor-pointer">
                        <input
                          id="edit-background-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileChange('background', file);
                          }}
                        />
                        <img 
                          alt="Backdrop" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          src={backgroundPreview || formData.background_url || selectedMovie?.background_url || 'https://via.placeholder.com/1280x720'} 
                          referrerPolicy="no-referrer"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/1280x720'}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-10 h-10 text-white" />
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Tiêu đề phim</label>
                        <input 
                          className="w-full bg-surface-container-high border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary-container transition-all" 
                          value={formData.title}
                          onChange={(e) => handleFormChange('title', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Ngày phát hành</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                          <input 
                            type="date" 
                            className="w-full bg-surface-container-high border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary-container transition-all" 
                            value={toDateInput(formData.release_date)}
                            onChange={(e) => handleFormChange('release_date', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Quốc gia</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                          <select 
                            className="w-full bg-surface-container-high border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary-container transition-all appearance-none"
                            value={formData.country_id}
                            onChange={(e) => handleFormChange('country_id', Number(e.target.value))}
                          >
                            <option value="">Chọn quốc gia</option>
                            {countries.map(country => (
                              <option key={country.id} value={country.id}>{country.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <MultiSelectGenre 
                          genres={genres}
                          selectedIds={formData.genre_ids}
                          onChange={(newIds) => handleFormChange('genre_ids', newIds)}
                          label="Thể loại"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Mô tả nội dung</label>
                      <textarea 
                        rows={4} 
                        className="w-full bg-surface-container-high border-none rounded-3xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary-container transition-all resize-none"
                        value={formData.description}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Link Phim (Streaming)</label>
                        <input 
                          className="w-full bg-surface-container-high border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary-container transition-all" 
                          placeholder="https://..."
                          value={formData.movie_url}
                          onChange={(e) => handleFormChange('movie_url', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Link Trailer (YouTube)</label>
                        <input 
                          className="w-full bg-surface-container-high border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary-container transition-all" 
                          placeholder="https://youtube.com/..."
                          value={formData.trailer_url}
                          onChange={(e) => handleFormChange('trailer_url', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-surface-container-high/20 rounded-3xl border border-outline-variant/10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-container/10 rounded-2xl">
                          <Star className="w-6 h-6 text-primary-container" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-on-surface uppercase tracking-tight">Yêu cầu VIP Access</p>
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Chỉ dành cho thành viên trả phí</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          className="sr-only peer" 
                          type="checkbox"
                          checked={formData.required_vip_level > 0}
                          onChange={(e) => handleFormChange('required_vip_level', e.target.checked ? 1 : 0)}
                        />
                        <div className="w-14 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container shadow-inner"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-surface-container-high/30 border-t border-outline-variant/10 flex flex-col md:flex-row gap-4">
                <button
                  onClick={handleUpdateMovie}
                  className="flex-1 bg-primary-container text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary-container/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Cập nhật thay đổi
                </button>
                <button
                  onClick={closeEditModal}
                  className="px-10 py-5 bg-transparent text-on-surface-variant hover:text-on-surface font-bold text-sm uppercase tracking-widest transition-colors"
                >
                  Hủy bỏ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-surface-dim/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-surface-container p-10 rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.6)] border border-outline-variant/10 text-center relative overflow-hidden"
            >
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-container/10 blur-[100px] rounded-full"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary-container/10 blur-[100px] rounded-full"></div>

              <div className="relative z-10">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 mx-auto relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse"></div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <Star className="w-12 h-12 text-green-400 fill-green-400/20" />
                  </motion.div>
                </div>

                <h2 className="font-headline text-3xl font-black tracking-tight text-on-surface mb-3 uppercase italic">
                  {successType === 'add' ? 'Thêm phim thành công!' :
                    successType === 'update' ? 'Cập nhật phim thành công!' :
                      'Xóa phim thành công!'}
                </h2>
                <p className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em] leading-relaxed mb-10 max-w-[280px] mx-auto">
                  {successType === 'delete'
                    ? 'Phim đã được gỡ bỏ công và dữ liệu đã được cập nhật trên hệ thống.'
                    : 'Dữ liệu phim đã được đồng bộ hóa thành công trên toàn bộ hệ thống CINEMA+.'}
                </p>

                <button
                  onClick={closeSuccessModal}
                  className="w-full py-5 bg-primary-container text-white font-black rounded-2xl hover:bg-primary-container/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary-container/30 flex items-center justify-center gap-3 group"
                >
                  <span className="uppercase tracking-widest text-sm">Đóng</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-surface-dim/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-surface-container p-10 rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.6)] border border-outline-variant/10 text-center relative overflow-hidden"
            >
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-container/10 blur-[100px] rounded-full"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary-container/10 blur-[100px] rounded-full"></div>

              <div className="relative z-10">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 mx-auto relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse"></div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <Trash2 className="w-12 h-12 text-red-400" />
                  </motion.div>
                </div>

                <h2 className="font-headline text-2xl font-black tracking-tight text-on-surface mb-3 uppercase italic">
                  Bạn có chắc chắn?
                </h2>
                <p className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em] leading-relaxed mb-10 max-w-[280px] mx-auto">
                  Bạn sắp xoá phim <span className="font-black text-on-surface">"{movieToDelete?.title}"</span>. Hành động này không thể hoàn tác.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={confirmDeleteMovie}
                    className="w-full py-4 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-red-500/30 uppercase tracking-widest text-sm"
                  >
                    Xoá phim
                  </button>
                  <button
                    onClick={closeDeleteConfirm}
                    className="w-full py-4 bg-surface-container-high text-on-surface font-black rounded-2xl hover:bg-surface-container-highest hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
