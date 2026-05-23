type AvatarProps = {
  src?: string;
  name?: string;
  size?: string;
  rounded?: string;
  className?: string;
};


const Avatar = ({
  src,
  name = "User",
  size = "w-10 h-10",
  rounded = "rounded-full",
  className = "",
}: AvatarProps) => {


  const initial =
    name
      .trim()
      .charAt(0)
      .toUpperCase();


  return (

    <div
      className={`
        ${size}
        ${rounded}
        overflow-hidden
        bg-zinc-800
        flex
        items-center
        justify-center
        text-white
        font-semibold
        ${className}
      `}
    >

      {

        src ? (

          <img

            src={src}

            alt={name}

            className="
              w-full
              h-full
              object-cover
            "
          />

        ) : (

          <span>

            {initial}

          </span>
        )
      }

    </div>
  );
};

export default Avatar;