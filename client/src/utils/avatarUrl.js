/**
 * Resolves avatar image path to a full backend URL.
 * Handles relative paths (/uploads/profile/...), blob preview URLs, and external URLs.
 */
export const getAvatarUrl = (avatar) => {
  if (!avatar) return null;

  // Blob URLs or external URLs
  if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('blob:')) {
    return avatar;
  }

  // Derive backend base URL from VITE_API_URL or default to localhost:9004
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9004/api';
  const serverBase = apiUrl.replace(/\/api\/?$/, '');

  const cleanPath = avatar.startsWith('/') ? avatar : `/${avatar}`;
  return `${serverBase}${cleanPath}`;
};
