import { formatAudioDurationMmSs } from '../util';

export type TrackDurationHintProps = {
  show: boolean;
  trimMaxSec: number | undefined;
};

export function TrackDurationHint({
  show,
  trimMaxSec,
}: TrackDurationHintProps) {
  if (!show) {
    return null;
  }

  if (typeof trimMaxSec === 'number' && trimMaxSec > 0) {
    const mmSs = formatAudioDurationMmSs(trimMaxSec);
    const secondsLabel = trimMaxSec.toFixed(1);
    return (
      <p className="text-muted-foreground text-xs">
        Dosya süresi yaklaşık{' '}
        <span className="text-foreground font-medium">{mmSs}</span> (
        {secondsLabel} sn). Başlangıç ve bitiş bu sürenin dışına çıkamaz.
      </p>
    );
  }

  return (
    <p className="text-muted-foreground text-xs">Dosya süresi okunuyor…</p>
  );
}
