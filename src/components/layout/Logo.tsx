
import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8 w-auto" }) => {
  return (
    <div className={`${className} flex items-center justify-center overflow-hidden`}>
      <div className="w-full h-full flex items-center justify-center bg-umblue rounded-lg">
        <span className="font-heading font-bold text-white">UM</span>
      </div>
    </div>
  );
};

export default Logo;
