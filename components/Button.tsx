import React from "react";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "primary" | "secondary";
  type?: "button" | "submit" | "reset"; // Add type prop
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = "",
  variant = "default",
  type = "button", // Default to "button"
}) => {
  const baseStyles =
    "border-2 rounded-lg py-2 px-4 transition duration-300 cursor-pointer font-semibold";
  const variants = {
    default: "border-black hover:bg-black hover:text-white dark:border-white",
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
  };

  return (
    <button
      onClick={onClick}
      type={type} // Pass the type prop to the button
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
