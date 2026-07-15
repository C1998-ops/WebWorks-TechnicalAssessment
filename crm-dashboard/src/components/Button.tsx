import React from "react";
type ButtonVariant = "primary" | "secondary" | "outline" | "text" | "tertiary" | 'danger';
interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: "extra-small" | "small" | "medium" | "large";
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  style?: React.CSSProperties;
  color?: string;
  overrideColor?: boolean; // New prop to control color override behavior
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  type = "button",
  disabled = false,
  onClick,
  className = "",
  icon,
  iconPosition = "left",
  style,
  color = "",
  overrideColor = false,
}) => {
  const baseStyles =
    "rounded-lg font-medium focus:outline-none transition-all flex items-center justify-center";

  // Color mapping for dynamic text colors
  const colorMap: Record<string, string> = {
    textGrey: "text-neutral-textGrey",
    textNavy: "text-primary-navy",
    textPurple: "text-secondary-purple",
    textOrange: "text-primary-orange",
    textWhite: "text-white",
    textGold: "text-secondary-gold",
    textGreen: "text-green-600",
  };

  // Get dynamic color class if color prop is provided and overrideColor is true
  const getDynamicColorClass = () => {
    if (!overrideColor || !color) return "";
    return colorMap[color] || `text-${color}`;
  };

  const VARIANTS: Record<ButtonVariant, string> = {
    primary:
      "bg-secondary-gold text-white hover:bg-secondary-gold/90 active:bg-secondary-gold/80",
    secondary:
      "bg-primary-navy text-white hover:bg-primary-navy/90 active:bg-primary-navy/80",
    tertiary:
      "bg-secondary-purple text-white hover:bg-secondary-purple/90 active:bg-secondary-purple/80",
    outline:
      "border-2 border-secondary-gold text-secondary-gold bg-transparent hover:bg-transparent active:bg-transparent",
    text: "text-primary-orange hover:text-primary-orange/90 active:text-primary-orange/80 underline bg-transparent hover:bg-transparent",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
  };

  const sizes = {
    "extra-small": "px-2 py-1 text-xs sm:px-3 sm:py-1.5 gap-1 sm:gap-2",
    small: "px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm gap-1 sm:gap-2",
    medium: "px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base gap-1.5 sm:gap-2",
    large: "px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg gap-2 sm:gap-3",
  };

  // Get the base variant styles
  const variantStyles = VARIANTS[variant];

  // Get dynamic color class if override is enabled
  const dynamicColorClass = getDynamicColorClass();

  // If overrideColor is true and we have a dynamic color, replace the text color in variant styles
  const finalVariantStyles =
    overrideColor && dynamicColorClass
      ? variantStyles.replace(/text-[^\s]+/g, dynamicColorClass)
      : variantStyles;

  const classes = [
    baseStyles,
    finalVariantStyles,
    sizes[size],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className,
  ].join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      {icon && iconPosition === "left" && (
        <span className="flex items-center">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="flex items-center">{icon}</span>
      )}
    </button>
  );
};

export default Button;
