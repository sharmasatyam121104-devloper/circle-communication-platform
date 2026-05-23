type LoaderProps = {
  color?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-3 h-3",
};

const Loader = ({
  color = "bg-blue-500",
  size = "md",
}: LoaderProps) => {
  return (
    <div className="flex items-center gap-1">
      <span className={`${sizeMap[size]} ${color} rounded-full animate-bounce`} />
      <span className={`${sizeMap[size]} ${color} rounded-full animate-bounce [animation-delay:0.2s]`} />
      <span className={`${sizeMap[size]} ${color} rounded-full animate-bounce [animation-delay:0.4s]`} />
    </div>
  );
};

export default Loader;