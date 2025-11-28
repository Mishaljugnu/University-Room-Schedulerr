
import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <div
        className={`${sizeClasses[size]} border-4 border-umgold border-t-transparent rounded-full animate-spin animate-pulse-glow`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

export default LoadingSpinner;
