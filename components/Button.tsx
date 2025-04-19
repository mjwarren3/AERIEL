import React from "react";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "outline"
    | "success"
    | "destructive"; // Added "success" and "destructive"
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = "",
  variant = "default",
  type = "button",
  disabled = false,
}) => {
  const baseStyles =
    "rounded-lg py-2 px-4 transition duration-300 cursor-pointer font-semibold";
  const variants = {
    default:
      "border-black hover:bg-black hover:text-white dark:border-white border-2",
    primary:
      "bg-gradient-to-r from-pink-500 to-yellow-500 border-transparent border-0 text-white hover:from-pink-600 hover:to-yellow-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    outline: "border-gray-500 text-gray-500 hover:bg-gray-100",
    success: "bg-green-500 text-white hover:bg-green-600", // Success styles
    destructive: "bg-red-500 text-white hover:bg-red-600", // Destructive styles
  };
  const disabledStyles = "cursor-not-allowed opacity-50";

  return (
    <button
      onClick={disabled ? undefined : onClick}
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${
        disabled ? disabledStyles : variants[variant]
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
