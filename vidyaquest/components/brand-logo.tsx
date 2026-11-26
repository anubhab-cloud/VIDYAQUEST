export function BrandLogo({ className = "size-9" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-[26%] bg-gradient-to-br from-[#2563eb] via-[#1d4ed8] to-[#172d4a] text-white shadow-[0_6px_16px_rgba(37,99,235,0.28)] ring-1 ring-white/25 ${className}`}
    >
      <svg viewBox="0 0 36 36" fill="none" className="size-full p-[14%]">
        <path
          d="M18 3.2 30.8 10.6v14.8L18 32.8 5.2 25.4V10.6L18 3.2Z"
          stroke="#dbeafe"
          strokeWidth="2.1"
          strokeLinejoin="round"
        />
        <path
          d="M11.4 13.5 18 24.4l6.6-10.9"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 11.2v5.4"
          stroke="#BFDBFE"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="27.2" cy="8.4" r="2.7" fill="#F4B942" />
      </svg>
    </span>
  )
}
