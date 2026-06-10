import type { ReactNode} from "react";

import {X} from "lucide-react";


type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  children?: ReactNode;
  title?: string;
  width?: string;
};


const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  width = "max-w-md",
}: ModalProps) => {


  if (!isOpen) {
    return null;
  }


  return (

    <div
      className="
        fixed
        inset-0
        z-50

        flex
        items-center
        justify-center

        bg-black/50

        px-4
      "
    >

      <div

        className={`

          w-full

          ${width}

          bg-zinc-900

          rounded-2xl

          p-5

          border
          border-zinc-800

          relative
        `}
      >

        <div
          className="
            flex
            items-center
            justify-between

            mb-4
          "
        >

          {

            title && (

              <h2
                className="
                  text-lg
                  font-semibold
                  text-white
                "
              >
                {title}
              </h2>
            )
          }


          <button
            onClick={onClose}
          >

            <X
              size={20}
              className="
                text-zinc-400
              "
            />

          </button>

        </div>


        {children}

      </div>

    </div>
  );
};

export default Modal;