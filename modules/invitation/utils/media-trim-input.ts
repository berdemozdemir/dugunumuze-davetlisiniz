/** `type="number"` ham değerini trim sınırına göre opsiyonel saniyeye çevirir. */
export function parseOptionalTrimSecondsFromInput(
  raw: string,
  trimMaxSec: number | undefined,
): number | undefined {
  if (raw === '') {
    return undefined;
  }
  let n = Number.parseFloat(raw);
  if (Number.isNaN(n)) {
    return undefined;
  }
  n = Math.max(0, n);
  if (trimMaxSec !== undefined) {
    n = Math.min(n, trimMaxSec);
  }
  return n;
}

export function resolveTrimUpperBoundForSubmit(
  trimMaxSec: number | undefined,
): number {
  if (typeof trimMaxSec === 'number' && trimMaxSec > 0) {
    return trimMaxSec;
  }
  return Number.POSITIVE_INFINITY;
}
