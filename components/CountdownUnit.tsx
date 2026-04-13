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
      className={`countdown-digit font-display text-gold flex items-center justify-center rounded-xl font-bold ${
        large
          ? 'h-18 w-18 text-2xl sm:h-24 sm:w-24 sm:text-4xl md:h-28 md:w-28 md:text-5xl'
          : 'h-14 w-14 text-lg sm:h-16 sm:w-16 sm:text-xl md:h-20 md:w-20 md:text-3xl'
      }`}
    >
      {String(value).padStart(2, '0')}
    </div>
    <span
      className={`text-cream/60 mt-2 tracking-widest uppercase ${
        large
          ? 'text-[10px] sm:text-xs md:text-sm'
          : 'text-[9px] sm:text-[10px] md:text-xs'
      }`}
    >
      {label}
    </span>
  </div>
);

export default CountdownUnit;
