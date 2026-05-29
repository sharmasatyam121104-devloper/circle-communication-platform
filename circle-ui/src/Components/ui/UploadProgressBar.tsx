export default function UploadProgressBar({progress,}: {progress: number;}) {
  return (
    <div
      className="
        w-full
        max-w-md
        rounded-2xl
        bg-white/10
        backdrop-blur-md
        border
        border-white/10
        p-3
        shadow-xl
      "
    >
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-sm font-medium text-white">
          Uploading File
        </h1>

        <p className="text-xs text-zinc-300">
          {progress}%
        </p>
      </div>

      <div
        className="
          w-full
          h-3
          bg-zinc-700
          rounded-full
          overflow-hidden
          relative
        "
      >
        <div
          className="
            h-full
            rounded-full
            transition-all
            duration-300
            bg-linear-to-r
            from-indigo-500
            via-violet-500
            to-fuchsia-500
            relative
          "
          style={{
            width: `${progress}%`,
          }}
        >
          <div
            className="
              absolute
              inset-0
              animate-pulse
              bg-white/20
            "
          />
        </div>
      </div>

      <div className="mt-2 flex justify-between text-[11px] text-zinc-400">
        <span>Please wait...</span>

        <span>
          {progress === 100
            ? 'Completed'
            : 'Uploading'}
        </span>
      </div>
    </div>
  );
}
