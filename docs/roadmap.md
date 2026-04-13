# Davetiye özelleştirme — yol haritası

Bu dosya **tek doğruluk kaynağı**dır: yeni özellikler ve refaktörler buradaki sıraya ve durumlara göre ilerler. Bir adım bittiğinde ilgili satırı güncelle (checkbox + kısa not / PR linki).

## Şu anki sıra (önce → sonra)

| # | Adım | Durum | Notlar |
|---|------|--------|--------|
| 0 | Şema / veri ayrımı: `shortNote` çakışmasını kaldır; story ve closing için ayrı alanlar | ⬜ TODO | Örn. `storyHeadline`, `storySubline`, `closingNote`; `quote` zaten var. `app/[slug]/page.tsx` merge mantığını buna göre güncelle. |
| 1 | **InvitationStory**: iki metin + arka plan rengi (şablondan) | ⬜ TODO | Görsel arka plan şimdilik opsiyonel; solid/gradient renk öncelik. |
| 2 | **InvitationHero**: özel hero arka plan görseli (URL veya yükleme sonrası public URL) | ⬜ TODO | İlk sürümde URL alanı yeterli olabilir; storage kararı dokümante et. |
| 3 | **InvitationClosing** + paylaşılan **PhotoCarousel**: en fazla 10 fotoğraf | ⬜ TODO | `PhotoCarousel`’i prop’lu hale getir; template’te liste alanı + validasyon. |
| 4 | **Countdown**: birden fazla etkinlik (örn. kına + düğün) | ⬜ TODO | `events[]` veya sabit 2 slot MVP; `InvitationCountdown` + public model. |

## Sonraki faz (bu dosyadaki 0–4 tamamlandıktan sonra)

- Misafir listesi / rezervasyon (RSVP veya kapasite)
- Public galeri

## Tamamlananlar

_(Bittiğinde buraya tarih + tek satır özet ekle.)_

---

## Oturum başında AI / asistan için prompt şablonu

Aşağıdaki bloğu yeni bir sohbette **olduğu gibi veya küçük düzenlemelerle** yapıştır:

```text
Bu repoda davetiye işlerinde docs/roadmap.md dosyasındaki sıraya uy.

Kurallar:
- Önce roadmap.md'yi oku; "Durum" sütununa göre sıradaki ilk TODO adımına odaklan.
- Kapsam dışına çıkma; başka dosyalarda drive-by refactor yapma.
- Bitirdiğin adım için roadmap.md içindeki checkbox/tablosu güncelle (TODO → done notu) — kullanıcı isterse birlikte güncelleriz.
- Belirsizlikte roadmap'teki notlara ve mevcut kod desenlerine (modules/templates, modules/invitation) uy.

Şu an yapmak istediğim: [BURAYA TEK CÜMLE: örn. "Adım 0 şema ayrımı" veya "Adım 1 story rengi"]
```

### Kısa varyant (minimal)

```text
docs/roadmap.md'ye uy; sıradaki TODO adımı: [adım numarası veya isim]. Sadece bunu uygula.
```

---

## Teknik hatırlatmalar (kısa)

- Public sayfa: `app/[slug]/page.tsx`
- Şablon tipleri: `modules/templates/types.ts`
- Override şeması: `modules/templates/schemas/invitation-overrides.ts`
- Bileşenler: `modules/invitation/components/*`

Bu bölüm gerektiğinde genişletilir; ana sıra yukarıdaki tabloda kalır.
