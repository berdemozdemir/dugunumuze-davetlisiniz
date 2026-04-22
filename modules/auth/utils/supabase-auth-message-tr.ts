/** Supabase Auth ve benzeri İngilizce hata metinlerini arayüzde Türkçe göstermek için. */
const SUPABASE_AUTH_MESSAGE_TR: Record<string, string> = {
  'invalid login credentials': 'E-posta veya şifre hatalı.',
  'invalid email or password': 'E-posta veya şifre hatalı.',
  'email not confirmed': 'E-posta adresiniz henüz doğrulanmadı.',
  'user already registered': 'Bu e-posta adresiyle zaten kayıt var.',
  'already registered': 'Bu e-posta adresiyle zaten kayıt var.',
  'password should be at least 6 characters': 'Şifre en az 6 karakter olmalıdır.',
  'signup requires a valid password': 'Geçerli bir şifre girin.',
  'unable to validate email address: invalid format':
    'E-posta adresi geçerli görünmüyor.',
  'email rate limit exceeded':
    'Çok fazla deneme yapıldı. Lütfen bir süre sonra tekrar deneyin.',
  'token has expired or is invalid': 'Oturum süresi doldu. Lütfen tekrar giriş yapın.',
  'invalid refresh token': 'Oturum geçersiz. Lütfen tekrar giriş yapın.',
  'new password should be different from the old password':
    'Yeni şifre eskisiyle aynı olamaz.',
};

export function toTurkishSupabaseAuthMessage(message: string): string {
  const trimmed = message.trim();
  const lower = trimmed.toLowerCase();

  const exact = SUPABASE_AUTH_MESSAGE_TR[lower];
  if (exact) return exact;

  if (lower.startsWith('for security purposes, you can only request this after')) {
    return 'Güvenlik nedeniyle lütfen kısa bir süre sonra tekrar deneyin.';
  }

  return trimmed;
}
