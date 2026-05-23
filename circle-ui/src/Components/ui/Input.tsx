import { Eye, EyeOff } from "lucide-react";
import { useState, type ChangeEvent, type ReactNode } from "react";

type InputProps = {
    label?: string;
    lablelTextColor?: string;
    labelTextSize?: string;
    labelFont?: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (
        e: ChangeEvent<HTMLInputElement>
    ) => void;
    disabled?: boolean;
    error?: string;
    icon?: ReactNode;
    className?: string;
    inputClassName?: string;
    width?: string;
    height?: string;
    rounded?: string;
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    required?: boolean;
}


const Input = ({
    label,
    lablelTextColor = "text-zinc-300",
    labelTextSize = "text-sm",
    labelFont = "font-medium",
    type = "text",
    placeholder = "placeholder",
    value,
    onChange,
    disabled = false,
    error,
    icon,
    className = "",
    inputClassName = "",
    width = "w-full",
    height = "h-12",
    rounded = "rounded-lg",
    bgColor = "bg-zinc-900",
    textColor = "text-white",
    borderColor = "border-zinc-700",
    required = false,

}: InputProps
) => {

    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === "password";

  return (
    <div className={`flex flex-col gap-2 ${width} ${className}`}>
        {
            label && (
                <label className={`${labelTextSize} ${labelFont}  ${lablelTextColor} `}>
                    {label}
                </label>
            )
        }
        <div className={`
            ${height}
            ${rounded}
            ${bgColor}
            ${textColor}
            ${borderColor}
            border px-3 flex items-center gap-2
        `}
        
        >
            {icon}
            <input
                type={
                    isPassword ? (
                        showPassword ? "text" : "password"
                    )
                    : type
                }
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`
                    w-full
                    h-full
                    bg-transparent
                    outline-none
                    ${textColor}
                    placeholder:text-zinc-500
                    disabled:cursor-not-allowed

                    ${inputClassName}
                `}
            />
            {

                isPassword && (

                    <button

                    type="button"

                    onClick={() => {

                        setShowPassword(
                        !showPassword
                        );
                    }}
                    >

                    {

                        showPassword

                        ? <EyeOff size={18} />

                        : <Eye size={18} />
                    }

                    </button>
                )
            }
         </div>
            {

                error && (

                <p
                    className="
                    text-sm
                    text-red-500
                    "
                >

                    {error}

                </p>
                )
            }
    </div>
  )
}

export default Input