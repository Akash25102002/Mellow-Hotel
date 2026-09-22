import Image from "next/image";

interface HotelLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

export default function HotelLogo({
  size = "md",
  className = "",
  showText = false,
}: HotelLogoProps) {
  const dimensions = {
    sm: { width: 32, height: 32, iconClass: "w-8 h-8" },
    md: { width: 44, height: 44, iconClass: "w-11 h-11" },
    lg: { width: 64, height: 64, iconClass: "w-16 h-16" },
    xl: { width: 88, height: 88, iconClass: "w-22 h-22" },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${dimensions.iconClass} flex-shrink-0 rounded-xl overflow-hidden bg-amber-50/50 p-0.5 border border-amber-200/60 shadow-xs`}>
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
          <span className="font-bold text-lg text-slate-900 tracking-tight block leading-tight">
            FoundDesk
          </span>
          <span className="text-[11px] text-slate-500 font-medium block">
            Grand Azure Resort
          </span>
        </div>
      )}
    </div>
  );
}
