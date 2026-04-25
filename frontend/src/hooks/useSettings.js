import { useState } from 'react';
import { 
  Bell, 
  Shield, 
  User, 
  Database, 
  Globe
} from 'lucide-react';

export function useSettings() {
  const [activeTab, setActiveTab] = useState('Tài khoản của tôi');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [accentColor, setAccentColor] = useState('#e50914');

  const tabs = [
    { icon: User, label: 'Tài khoản của tôi' },
    { icon: Bell, label: 'Thông báo & Email' },
    { icon: Shield, label: 'Bảo mật & Quyền riêng tư' },
    { icon: Database, label: 'Dữ liệu & Lưu trữ' },
    { icon: Globe, label: 'Ngôn ngữ & Vùng' },
  ];

  const handleTabChange = (label) => {
    setActiveTab(label);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAccentColorChange = (color) => {
    setAccentColor(color);
  };

  const handleSave = () => {
    console.log('Settings saved');
  };

  return {
    activeTab,
    tabs,
    isDarkMode,
    accentColor,
    handleTabChange,
    toggleDarkMode,
    handleAccentColorChange,
    handleSave,
  };
}
