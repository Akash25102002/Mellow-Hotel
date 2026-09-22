import Image from "next/image";

interface HotelLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  textColor?: "dark" | "ivory";
}

export default function HotelLogo({
  size = "md",
  className = "",
  showText = false,
  textColor = "dark",
}: HotelLogoProps) {
  const dimensions = {
    sm: { width: 32, height: 32, iconClass: "w-8 h-8" },
    md: { width: 44, height: 44, iconClass: "w-11 h-11" },
    lg: { width: 64, height: 64, iconClass: "w-16 h-16" },
    xl: { width: 88, height: 88, iconClass: "w-22 h-22" },
  }[size];

  const titleClass = textColor === "ivory" ? "text-[#FFFDF8]" : "text-slate-900";
  const subtitleClass = textColor === "ivory" ? "text-[#E6D8C2]" : "text-slate-500";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${dimensions.iconClass} flex-shrink-0 rounded-xl overflow-hidden bg-[#FAF6EE] p-0.5 border border-[#E5D7BF] shadow-xs`}>
        <Image
          src="/logo.png"
          alt="Hotel Logo"
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {showText && (
        <div>
          <span className={`font-bold text-lg tracking-tight block leading-tight ${titleClass}`}>
            FoundDesk
          </span>
          <span className={`text-[11px] font-medium block ${subtitleClass}`}>
            Grand Azure Resort
          </span>
        </div>
      )}
    </div>
  );
}
