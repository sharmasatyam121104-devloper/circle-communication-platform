import { useState, type ReactNode } from "react";

type TooltipProps = {
  children: ReactNode;
  content: ReactNode;
};

const Tooltip = ({ children, content }: TooltipProps) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative w-fit"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
            <div
            className="
                absolute
                top-10
                left-40
                -translate-x-1/2
                bg-zinc-900
                text-white
                px-4
                py-3
                rounded-xl
                shadow-lg
                min-w-52
               z-9999
            "
            >
            {content}

            <div
                className="
                absolute
                left-1/2
                -translate-x-1/2
                bottom-full
                border-8
                border-transparent
                border-b-zinc-900
                "
            />
</div>
      )}
    </div>
  );
};

export default Tooltip;