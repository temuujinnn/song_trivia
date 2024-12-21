// components/GivePointButton.tsx

"use client";

import React from "react";
import {FaStar} from "react-icons/fa";

interface GivePointButtonProps {
  onGivePoint: () => void;
  disabled: boolean;
  pointPercentage: number; // 100, 70, 50
}

const GivePointButton: React.FC<GivePointButtonProps> = ({
  onGivePoint,
  disabled,
  pointPercentage,
}) => {
  return (
    <button
      onClick={onGivePoint}
      disabled={disabled}
      className={`flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label="Give Point"
    >
      <FaStar className="mr-2" />
      Give Point ({pointPercentage}%)
    </button>
  );
};

export default GivePointButton;
