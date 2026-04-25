export const VIP_PLANS = {
  FREE: {
    name: 'Miễn phí',
    price: 0,
    maxDevices: 1,
    quality: '720p',
    ads: true
  },
  VIP_BASIC: {
    name: 'VIP Cơ bản',
    price: 99000,
    maxDevices: 2,
    quality: '1080p',
    ads: false
  },
  VIP_FAMILY: {
    name: 'VIP Gia đình',
    price: 199000,
    maxDevices: 4,
    quality: '4K',
    ads: false
  }
};

export const getVipInfo = (user) => {
  if (!user?.vip) return VIP_PLANS.FREE;

  return {
    ...VIP_PLANS[user.vip.plan],
    ...user.vip
  };
};

export const isVipActive = (user) => {
  if (!user) return false;
  
  // Support both backend fields and potentially nested ones
  const isVip = !!(user.is_vip || user.vip?.isActive);
  const expirationDate = user.vip_expired_at || user.vip?.expiresAt;
  
  if (!isVip) return false;
  if (!expirationDate) return true; // If is_vip is true but no expiration, assume permanent (e.g. lifetime or handled by backend)

  return new Date(expirationDate) > new Date();
};

export const canWatchMovie = (user, movie) => {
  if (!movie) return false;
  if (!movie.required_vip_level || movie.required_vip_level === 0) return true;
  
  const isAdmin = user && (user.role === 'admin' || user.role_id === 1);
  if (isAdmin) return true;
  
  return isVipActive(user);
};