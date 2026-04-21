// TODO: her telefon numarasının kontrol edilmesi gerekiyor.

/**
 * Türkiye odaklı basit normalizasyon; karşılaştırma ve tekil anahtar için.
 * Başarılıysa `+90` ile başlayan E.164 benzeri dize döner.
 */
export function normalizeTrPhone(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  let digits = raw.replace(/[\s().-]/g, '');
  if (digits.startsWith('+')) {
    digits = digits.slice(1);
  } else if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (digits.startsWith('90') && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.length === 10 && digits.startsWith('5')) {
    return `+90${digits}`;
  }

  if (digits.length === 11 && digits.startsWith('5')) {
    return `+90${digits}`;
  }

  if (digits.length === 12 && digits.startsWith('905')) {
    return `+${digits}`;
  }

  if (digits.length === 13 && digits.startsWith('9005')) {
    return `+90${digits.slice(4)}`;
  }

  return null;
}
