import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: "bg-emerald-600",
    error: "bg-red-600",
    info: "bg-amber-600",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce ${bgColors[type]}`}
    >
      <span>{message}</span>
    </div>
  );
}
