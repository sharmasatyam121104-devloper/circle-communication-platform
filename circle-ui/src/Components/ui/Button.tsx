import type { ReactNode } from "react"

type ButtonProps = {
    children: ReactNode,
    type?: "button" | "submit" | "reset";
    onClick?: ()=>void;
    disabled?: boolean;
    loading?: boolean;
    width?: string;
    height?: string;
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    rounded?: string;
    className?: string;
}

const Button = ({
    children = "Button",
    type = "button",
    onClick,
    disabled = false,
    loading = false,
    width = "w-fit",
    height = "h-fit",
    bgColor = "bg-blue-500",
    textColor = "text-white",
    borderColor = "border-transparent",
    rounded = "rounded-lg",
    className = "",
}:ButtonProps) => {
  return (
    <button
        type={type}
        onClick={onClick}
        disabled= {
            disabled || loading
        }
        className={`

        ${width}
        ${height}

        ${bgColor}
        ${textColor}

        ${borderColor}

        ${rounded}

        border

        px-4
        py-2

        flex
        items-center
        justify-center

        transition-all
        duration-200

        ${
          disabled || loading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }

        ${className}
      `}
    >

      {
        loading
        ? "Loading..."
        : children
      }

    </button>
  )
}

export default Button