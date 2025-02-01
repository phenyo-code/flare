// SizeButton.tsx
"use client";

import { useState } from "react";

interface SizeButtonProps {
  size: string; // Size name like 'Small', 'Medium', 'Large'
  isSelected: boolean; // Check if the size is selected
  onClick: (size: string) => void; // Function to handle size selection
}

const SizeButton = ({ size, isSelected, onClick }: SizeButtonProps) => {
  return (
    <button
      onClick={() => onClick(size)}
      className={`px-4 py-2 border-2 rounded-full ${
        isSelected ? "bg-blue-500 text-white" : "bg-white text-black"
      }`}
    >
      {size}
    </button>
  );
};

export default SizeButton;
