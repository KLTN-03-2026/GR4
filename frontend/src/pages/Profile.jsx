import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import ProfileSidebar from '../components/user/ProfileSidebar';
import { useAuth } from '../hooks/useAuth';
import ProfileOverview from './profile/ProfileOverview';
import ProfileEdit from './profile/ProfileEdit';
import Favorites from './profile/Favorites';
import History from './profile/History';
import Notifications from './profile/Notifications';
import Billing from './profile/Billing';
import Settings from './profile/Settings';
import Security from './profile/Security';

const Profile = () => {
  const location = useLocation();
  const { user, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editData, setEditData] = useState({ ...user });

  useEffect(() => {
    setEditData({ ...user });
  }, [user]);

  useEffect(() => {
    if (!location.pathname.startsWith('/profile')) return;
    const path = location.pathname;
    if (path.includes('/favorites')) setActiveSection('favorites');
    else if (path.includes('/history')) setActiveSection('history');
    else if (path.includes('/notifications')) setActiveSection('notifications');
    else if (path.includes('/billing')) setActiveSection('billing');
    else if (path.includes('/devices')) setActiveSection('devices');
    else if (path.includes('/security')) setActiveSection('security');
    else if (path.includes('/settings')) setActiveSection('settings');
    else setActiveSection('profile');
  }, [location.pathname]);

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        if (isEditing) {
          return (
            <ProfileEdit 
              editData={editData} 
              setEditData={setEditData} 
              setIsEditing={setIsEditing} 
              updateProfile={updateProfile} 
              showPassword={showPassword} 
              setShowPassword={setShowPassword} 
            />
          );
        }
        return <ProfileOverview user={user} setIsEditing={setIsEditing} />;
      case 'favorites':
        return <Favorites />;
      case 'history':
        return <History />;
      case 'notifications':
        return <Notifications />;
      case 'billing':
        return <Billing />;
      case 'settings':
        return <Settings />;
      case 'security':
        return <Security showPassword={showPassword} setShowPassword={setShowPassword} />;
      default:
        return <ProfileOverview user={user} setIsEditing={setIsEditing} />;
    }
  };

  return (
    <div className="bg-surface min-h-screen flex">
      <ProfileSidebar onEditProfile={() => setIsEditing(true)} />
      
      <main className="lg:ml-80 flex-1 relative min-h-screen">
        {/* Background Decorative Blur */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -z-10"></div>
        
        <div className="max-w-6xl mx-auto px-10 pt-32 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection + (activeSection === 'profile' ? `-${isEditing}` : '')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-[70vh]"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Profile;
