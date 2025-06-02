import React, { InputHTMLAttributes } from "react";

export const Input = ({
  className,
  type,
  placeholder,
  value,
  ...props
}: {
  className: string;
  props: InputHTMLAttributes<HTMLInputElement>;
  type: string;
  value: string;
  placeholder?: string;
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${className}`}
      {...props}
    />
  );
};
