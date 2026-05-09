type Props = {
  size?: number;
  showWordmark?: boolean;
  className?: string;
};

export default function Logo({
  size = 28,
  showWordmark = true,
  className = "",
}: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="DeepBuild.ai logo"
      >
        {/* Left chevron — white */}
        <path
          d="M26 14 L10 32 L26 50"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right chevron — blue */}
        <path
          d="M38 14 L54 32 L38 50"
          stroke="#2f6bff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showWordmark && (
        <span className="text-base font-semibold tracking-tight text-white">
          DeepBuild<span className="text-[var(--db-blue)]">.ai</span>
        </span>
      )}
    </div>
  );
}
