import React from 'react';

interface TrackerIconProps {
  className?: string;
  size?: number;
}

/**
 * Designed Custom "Tracker" Icon:
 * Features concentric precision target rings with a directional financial tracking crosshair and compass node.
 */
export const TrackerIcon: React.FC<TrackerIconProps> = ({
  className = 'w-5 h-5',
  size = 20
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Tracker Icon"
    >
      {/* Outer tracking ring */}
      <circle cx="12" cy="12" r="9" className="opacity-90 stroke-current" />
      {/* Precision inner focus ring */}
      <circle cx="12" cy="12" r="4" className="stroke-current" />
      {/* Center tracking focal point */}
      <circle cx="12" cy="12" r="1.5" className="fill-current" />
      {/* Crosshair alignment tick marks */}
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
    </svg>
  );
};
