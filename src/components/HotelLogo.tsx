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

  const titleClass =
    textColor === "ivory"
      ? "text-mellow-secondary"
      : "text-mellow-black";
  const subtitleClass =
    textColor === "ivory"
      ? "text-mellow-accent"
      : "text-mellow-gray";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative ${dimensions.iconClass} flex-shrink-0 rounded-xl overflow-hidden bg-mellow-secondary p-1 border border-mellow-border shadow-xs`}
      >
        <Image
          src="/logo.png"
          alt="Mellow Hotel & Resort"
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {showText && (
        <div>
          <span className={`font-serif text-xl tracking-wide block leading-tight font-medium ${titleClass}`}>
            Mellow <span className="font-sans text-xs font-normal text-mellow-primary">| FoundDesk</span>
          </span>
          <span className={`text-[10px] uppercase tracking-[0.2em] font-medium block mt-0.5 ${subtitleClass}`}>
            Hotel &amp; Resort Operations
          </span>
        </div>
      )}
    </div>
  );
}
