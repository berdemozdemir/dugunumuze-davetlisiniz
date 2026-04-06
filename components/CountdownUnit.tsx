const CountdownUnit = ({
  value,
  label,
  large = false,
}: {
  value: number;
  label: string;
  large?: boolean;
}) => (
  <div className="flex flex-col items-center">
    <div
      className={`countdown-digit flex items-center justify-center rounded-xl font-display font-bold text-gold ${
        large
          ? "w-18 h-18 text-2xl sm:w-24 sm:h-24 sm:text-4xl md:w-28 md:h-28 md:text-5xl"
          : "w-14 h-14 text-lg sm:w-16 sm:h-16 sm:text-xl md:w-20 md:h-20 md:text-3xl"
      }`}
    >
      {String(value).padStart(2, "0")}
    </div>
    <span
      className={`mt-2 uppercase tracking-widest text-cream/60 ${
        large
          ? "text-[10px] sm:text-xs md:text-sm"
          : "text-[9px] sm:text-[10px] md:text-xs"
      }`}
    >
      {label}
    </span>
  </div>
);

export default CountdownUnit;
