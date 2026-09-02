import React, { useState } from 'react';
import { getAvatarUrl } from '../../utils/avatarUrl';

/**
 * Universal UserAvatar component with graceful image loading error handling
 * and initial fallback.
 */
const UserAvatar = ({ 
  src, 
  name = 'User', 
  className = 'w-10 h-10', 
  textClassName = 'text-sm font-extrabold',
  alt = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const imageUrl = getAvatarUrl(src);

  // Get initials from name (e.g., "Rahul Verma" -> "RV")
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  if (imageUrl && !imageError) {
    return (
      <img
        src={imageUrl}
        alt={alt || name}
        onError={() => setImageError(true)}
        className={`${className} object-cover rounded-full select-none`}
      />
    );
  }

  return (
    <div className={`${className} rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center select-none shrink-0 ${textClassName}`}>
      {getInitials(name)}
    </div>
  );
};

export default UserAvatar;
