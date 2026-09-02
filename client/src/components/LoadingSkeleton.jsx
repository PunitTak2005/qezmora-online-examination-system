import React from 'react';

/**
 * Responsive loading skeleton component.
 * Usage: <LoadingSkeleton type="card" count={6} />
 * Types: "card" | "table" | "list" | "stat" | "profile"
 */
const Shimmer = ({ className }) => (
  <div className={`animate-shimmer rounded-lg ${className}`} />
);

const CardSkeleton = () => (
  <div className="card p-6 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <Shimmer className="h-4 w-20" />
        <Shimmer className="h-5 w-3/4" />
      </div>
      <Shimmer className="h-10 w-10 rounded-xl" />
    </div>
    <Shimmer className="h-3 w-24" />
    <Shimmer className="h-3 w-full" />
    <Shimmer className="h-3 w-5/6" />
    <div className="grid grid-cols-2 gap-3">
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-full" />
    </div>
    <Shimmer className="h-10 w-full rounded-xl" />
  </div>
);

const StatSkeleton = () => (
  <div className="card p-6 flex items-start gap-4">
    <Shimmer className="h-12 w-12 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Shimmer className="h-3 w-24" />
      <Shimmer className="h-7 w-16" />
    </div>
  </div>
);

const TableRowSkeleton = () => (
  <tr>
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Shimmer className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

const ListItemSkeleton = () => (
  <div className="flex items-center gap-4 p-4 card">
    <Shimmer className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Shimmer className="h-4 w-1/3" />
      <Shimmer className="h-3 w-1/2" />
    </div>
    <Shimmer className="h-6 w-16 rounded-full" />
  </div>
);

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="card p-6 flex items-center gap-6">
      <Shimmer className="h-24 w-24 rounded-full" />
      <div className="space-y-3">
        <Shimmer className="h-6 w-40" />
        <Shimmer className="h-4 w-32" />
        <Shimmer className="h-4 w-24" />
      </div>
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card p-4 space-y-2">
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  if (type === 'stat') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => <StatSkeleton key={i} />)}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="card overflow-hidden">
        <table className="w-full">
          <tbody>
            {Array.from({ length: count }).map((_, i) => <TableRowSkeleton key={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => <ListItemSkeleton key={i} />)}
      </div>
    );
  }

  if (type === 'profile') {
    return <ProfileSkeleton />;
  }

  // Default: card grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
};

export default LoadingSkeleton;
