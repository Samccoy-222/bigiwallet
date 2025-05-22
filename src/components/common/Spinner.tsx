// components/ui/Spinner.tsx
import React from "react";

const Spinner: React.FC<{ size?: number }> = ({ size = 24 }) => {
  return (
    <div
      className="animate-spin rounded-full border-2 border-neutral-400 border-t-transparent"
      style={{ width: size, height: size }}
    />
  );
};

export default Spinner;
