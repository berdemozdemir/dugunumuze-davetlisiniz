import { TimeLeft } from '@/lib/types';
import CountdownUnit from './CountdownUnit';

const CountdownRow = ({
  time,
  large = false,
}: {
  time: TimeLeft;
  large?: boolean;
}) => (
  <div
    className={`flex justify-center ${large ? 'gap-3 sm:gap-4 md:gap-6' : 'gap-2 sm:gap-3 md:gap-4'}`}
  >
    <CountdownUnit value={time.days} label="Gün" large={large} />
    <CountdownUnit value={time.hours} label="Saat" large={large} />
    <CountdownUnit value={time.minutes} label="Dakika" large={large} />
    <CountdownUnit value={time.seconds} label="Saniye" large={large} />
  </div>
);

export default CountdownRow;
