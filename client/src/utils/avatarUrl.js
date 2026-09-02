/**
 * Resolves avatar image path to a full backend URL.
 * Handles relative paths (/uploads/profile/...), blob preview URLs, and external URLs.
 */
export const getAvatarUrl = (avatar) => {
  if (!avatar) return null;

  // Blob URLs or external URLs
  if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('blob:') || avatar.startsWith('data:')) {
    return avatar;
  }

  // Derive backend base URL from VITE_API_URL or default to Render backend
  const apiUrl = import.meta.env.VITE_API_URL || 'https://qezmora-online-examination-system.onrender.com/api';
  const serverBase = apiUrl.replace(/\/api\/?$/, '');

  const cleanPath = avatar.startsWith('/') ? avatar : `/${avatar}`;
  return `${serverBase}${cleanPath}`;
};
