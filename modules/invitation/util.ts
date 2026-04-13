export function formatInvitationDateTimeLabel(iso: string) {
  const d = new Date(iso);

  const date = d.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const time = d.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${date} · ${time}`;
}

export function formatInvitationYearFooter(iso: string) {
  const d = new Date(iso);

  return d.toLocaleDateString('tr-TR', {
    month: 'long',
    year: 'numeric',
  });
}
