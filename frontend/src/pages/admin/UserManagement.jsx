import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Camera,
  X,
  ShieldCheck,
  Crown,
  CheckCircle2,
  UserPlus,
  Users,
  UserCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils.js';
import { useUsers } from '../../hooks/useUsers.js';
import { PageHeader } from '../../components/shared/PageHeader.jsx';

export default function UserManagement() {
  const {
    users,
    isEditModalOpen,
    handleRoleChange,
    isSuccessModalOpen,
    isDeleteModalOpen,
    isDeleteSuccessModalOpen,
    selectedUser,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleSave,
    closeEditModal,
    closeDeleteModal,
    closeDeleteSuccessModal,
    closeSuccessModal,
    searchTerm,
    setSearchTerm,
    deletedUserName,
    page,
    setPage,
    pagination,
    filter,
    setFilter,
  } = useUsers();


  const totalUsers = pagination?.total || 0;
  const totalVip = pagination?.totalVip || 0;

  const stats = [
    { label: 'Tổng thành viên', value: totalUsers, sub: '+4 thành viên mới', icon: Users, color: 'text-blue-400' },
    { label: 'Thành viên VIP', value: totalVip, sub: `${totalUsers > 0 ? Math.round((totalVip / totalUsers) * 100) : 0}% tổng số`, icon: Crown, color: 'text-yellow-400' },
  ];

  return (
    <section className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader
        title="DANH SÁCH THÀNH VIÊN"
        description="Quản lý và cấp quyền người dùng trong hệ thống Cinematic"
        badge="User Access Control"
      >
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <h3 className="text-3xl font-black text-on-surface font-headline">{stat.value}</h3>
            <p className="text-xs mt-2 text-on-surface-variant font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* User Table */}
      <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10">
        <div className="p-6 border-b border-surface-container-high flex items-center justify-between">
          <div className="flex gap-4">
            <button 
              onClick={() => setFilter('all')}
              className={cn(
                "text-sm font-bold transition-all pb-1 border-b-2",
                filter === 'all' ? "text-primary-container border-primary-container" : "text-on-surface-variant hover:text-on-surface border-transparent"
              )}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFilter('admin')}
              className={cn(
                "text-sm font-bold transition-all pb-1 border-b-2",
                filter === 'admin' ? "text-primary-container border-primary-container" : "text-on-surface-variant hover:text-on-surface border-transparent"
              )}
            >
              Quản trị viên
            </button>
            <button 
              onClick={() => setFilter('vip')}
              className={cn(
                "text-sm font-bold transition-all pb-1 border-b-2",
                filter === 'vip' ? "text-primary-container border-primary-container" : "text-on-surface-variant hover:text-on-surface border-transparent"
              )}
            >
              VIP Members
            </button>
          </div>

          <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/10">
            <Search className="w-4 h-4 text-on-surface-variant" />
            <input
              className="bg-transparent border-none text-xs focus:ring-0 outline-none w-48"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>


        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Người dùng</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Vai trò</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Gói thành viên</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-high/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden">
                        <img alt={user?.name || "User"} className="w-full h-full object-cover" src={user.avatar} referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-on-surface">{user?.name || "User"}</p>
                        <p className="text-xs text-on-surface-variant">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 text-sm font-medium">{user.role}</td> */}
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-surface-container-high border border-outline-variant/10 rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-primary-container/50 text-on-surface outline-none cursor-pointer"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-primary-container">{user.tier}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 rounded-lg bg-surface-container-highest text-on-surface-variant hover:text-primary-container transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
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
              {` `}trên {pagination.total} thành viên
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



      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDeleteModal}
              className="absolute inset-0 bg-[#0e0e0e]/90 backdrop-blur-md"
            ></motion.div>

            {/* Confirmation Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface-container-low rounded-[2rem] shadow-[0_20px_40px_rgba(229,9,20,0.12)] border border-outline-variant/10 overflow-hidden"
            >
              {/* Glowing accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-50"></div>

              <div className="p-10 flex flex-col items-center text-center">
                {/* Warning Icon */}
                <div className="w-20 h-20 rounded-full bg-primary-container/10 flex items-center justify-center mb-8 border border-primary-container/20 relative">
                  <AlertTriangle className="w-10 h-10 text-primary-container relative z-10" />
                  {/* Secondary pulse ring effect */}
                  <div className="absolute inset-0 rounded-full border border-primary-container/40 animate-ping opacity-20 scale-125"></div>
                </div>

                {/* Modal Title */}
                <h2 className="text-2xl font-black tracking-tight text-on-surface mb-4 font-headline uppercase">Xác nhận xóa tài khoản</h2>

                {/* Content */}
                <p className="text-on-surface-variant leading-relaxed mb-10 font-medium">
                  Bạn có chắc chắn muốn xóa tài khoản của người dùng <strong className="text-on-surface font-bold">{selectedUser?.name}</strong> không? <br />
                  <span className="text-primary-container/80 text-sm mt-2 block font-semibold">Hành động này không thể hoàn tác.</span>
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button
                    onClick={closeDeleteModal}
                    className="flex-1 px-8 py-4 rounded-xl border border-outline-variant/20 hover:bg-surface-container-highest text-on-surface font-bold text-sm transition-all active:scale-95"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 px-8 py-4 rounded-xl bg-primary-container hover:bg-primary-container/90 text-white font-black text-sm transition-all shadow-[0_10px_20px_rgba(229,9,20,0.3)] active:scale-95"
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </div>

              {/* Footer pattern */}
              <div className="h-2 w-full bg-[#1c1b1b] flex gap-1 px-4 overflow-hidden opacity-30">
                <div className="h-full w-4 bg-primary-container/20 skew-x-[-45deg]"></div>
                <div className="h-full w-4 bg-primary-container/20 skew-x-[-45deg]"></div>
                <div className="h-full w-4 bg-primary-container/20 skew-x-[-45deg]"></div>
                <div className="h-full w-4 bg-primary-container/20 skew-x-[-45deg]"></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Success Modal */}
      <AnimatePresence>
        {isDeleteSuccessModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-surface-dim/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-surface-container border border-outline-variant/20 rounded-xl p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Background Glow Decor */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-container/10 blur-[100px] rounded-full"></div>

              {/* Success Icon */}
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full scale-150"></div>
                <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-black font-headline text-on-surface mb-2 tracking-tight">
                Xóa tài khoản thành công!
              </h3>

              <p className="text-on-surface-variant text-sm font-body leading-relaxed mb-8 max-w-[280px]">
                Người dùng <span className="font-bold text-on-surface">{deletedUserName}</span>
                đã được xóa khỏi hệ thống.
              </p>

              {/* Actions */}
              <button
                onClick={closeDeleteSuccessModal}
                className="w-full py-4 bg-primary-container text-white font-extrabold font-headline uppercase tracking-widest text-sm rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(229,9,20,0.3)]"
              >
                Đóng
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}