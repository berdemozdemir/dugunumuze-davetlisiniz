import { err, ok, Result } from '@/lib/result';

/** `datetime-local` input değeri → ISO (yerel saat korunur). */
export function datetimeLocalValueToIso(
  value: string,
): Result<string, { reason: string; message: string }> {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return err({
      reason: 'invalid-datetime-local-value',
      message: 'Geçersiz tarih',
    });
  }

  return ok(d.toISOString());
}

// TODO: bunun gibi fonksiyonları lib'e taşıyabiliriz birkac yerde fazlaca kullanildi.
/** ISO → `datetime-local` (yerel). */
export function isoToDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
