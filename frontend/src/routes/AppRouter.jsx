import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

// Layouts
import AdminLayout from '../components/admin/AdminLayout';
import UserLayout from '../components/user/UserLayout';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import MovieManagement from '../pages/admin/MovieManagement';
import UserManagement from '../pages/admin/UserManagement';
import CommentManagement from '../pages/admin/CommentManagement';
import Statistics from '../pages/admin/Statistics';
import AdminSettings from '../pages/admin/Settings';
import AdminNotifications from '../pages/admin/AdminNotifications';

// User Pages
import Home from '../pages/Home';
import MovieDetail from '../pages/MovieDetail';
import Watch from '../pages/Watch';
import Filter from '../pages/Filter';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VIPSelection from '../pages/VIPSelection';
import Checkout from '../pages/Checkout';
import Profile from '../pages/Profile';
import Search from '../pages/Search';
import Success from '../pages/Success';
import TestAPI from '../pages/TestAPI';

export default function AppRouter() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return (
      <AdminLayout>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/movies" element={<MovieManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/comments" element={<CommentManagement />} />
            <Route path="/admin/stats" element={<Statistics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
          </Route>
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    );
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <UserLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="/vip" element={<VIPSelection />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile/*" element={<Profile />} />
        </Route>
        <Route path="/search" element={<Search />} />
        <Route path="/success" element={<Success />} />
        <Route path="/test-api" element={<TestAPI />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserLayout>
  );
}
