import React from "react";

interface KPIBoxProps {
  title: string;
  value: string | number;
}

export default function KPIBox({ title, value }: KPIBoxProps) {
  return (
    <div
      className="
      p-4 rounded-2xl shadow 
      bg-white dark:bg-gray-900 
      border border-gray-200 dark:border-gray-700
    "
    >
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {title}
      </h3>

      <p className="text-2xl font-bold text-black dark:text-white mt-1">
        {value}
      </p>
    </div>
  );
}
