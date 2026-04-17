export function InvitationTemplateWarning({ visible }: { visible: boolean }) {
  if (!visible) {
    return null;
  }
  return (
    <p className="text-muted-foreground max-w-xl text-sm">
      Şablon ayarları geçici olarak kullanılamıyor; müzik kaydetmek şu an sorun
      çıkarabilir.
    </p>
  );
}
