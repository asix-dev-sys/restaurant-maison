import React from "react";

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}) {
  const baseStyle =
    "px-6 py-3 rounded-xl font-medium transition duration-200 flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-amber-600 text-white hover:bg-amber-700 shadow-sm disabled:opacity-50",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "border-2 border-amber-600 text-amber-600 hover:bg-amber-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
