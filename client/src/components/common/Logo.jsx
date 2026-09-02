import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { LOGOS } from '../../constants/logoPaths';

export default function Logo({
  variant = 'auto',
  className = 'h-12 w-auto',
  alt = 'Qezmora',
}) {
  const themeContext = useTheme();
  const isDark = themeContext?.darkMode ?? (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  if (variant === 'auto') {
    return (
      <div className="flex justify-center items-center">
        <img
          src={LOGOS.primary}
          alt={alt}
          className={`${className} hidden dark:hidden sm:block object-contain`}
          loading="eager"
          decoding="async"
        />
        <img
          src={LOGOS.inverted}
          alt={alt}
          className={`${className} hidden dark:sm:block object-contain`}
          loading="eager"
          decoding="async"
        />
        <img
          src={isDark ? LOGOS.dark : LOGOS.light}
          alt={alt}
          className="h-10 w-10 sm:hidden object-contain"
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  const src = LOGOS[variant] || (isDark ? LOGOS.inverted : LOGOS.primary);

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} object-contain`}
      loading="eager"
      decoding="async"
    />
  );
}
