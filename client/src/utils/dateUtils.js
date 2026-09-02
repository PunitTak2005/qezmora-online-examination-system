/**
 * Formats attempt timestamps into human-readable relative or calendar dates.
 * Reference Date: September 2, 2026 (or live current date).
 */
export const formatAttemptDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';

  const now = new Date();
  
  // Calculate midnight-based day difference
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffTime = startOfNow.getTime() - startOfTarget.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // 1. Today
  if (diffDays === 0) {
    return `Today • ${timeStr}`;
  }

  // 2. Yesterday
  if (diffDays === 1) {
    return `Yesterday • ${timeStr}`;
  }

  // 3. Within 7 days
  if (diffDays > 1 && diffDays <= 7) {
    return `${diffDays} days ago`;
  }

  // 4. Older -> Full formatted date
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();

  if (year === now.getFullYear()) {
    return `${day} ${month} ${year}`;
  }

  return `${day} ${month} ${year}`;
};

/**
 * Formats seconds into "X min taken" or "Xh Ym taken"
 */
export const formatTimeTaken = (seconds) => {
  if (!seconds || seconds <= 0) return 'N/A';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m taken`;
  }
  if (mins < 1) return `${secs} sec taken`;
  return `${mins} min taken`;
};
