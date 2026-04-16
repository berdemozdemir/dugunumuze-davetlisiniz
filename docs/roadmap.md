# Davetiye özelleştirme — yol haritası

Bu dosya **tek doğruluk kaynağı**dır: yeni özellikler ve refaktörler buradaki sıraya ve durumlara göre ilerler. Bir adım bittiğinde ilgili satırı güncelle (checkbox + kısa not / PR linki).

## Şu anki sıra (önce → sonra)

| # | Adım | Durum | Notlar |
|---|------|--------|--------|
| 0 | Şema / veri ayrımı: story ve closing için ayrı metin alanları | ✅ Done | `storyHeadline` / `storySubline` / `closingNote`. Şablon migrasyonu: `0008_invitation_story_closing_fields.sql`. |
| 1 | **InvitationStory**: iki metin (şablondan) | ✅ Done | `resolveStoryHeadline` / `resolveStorySubline` → public `InvitationStory`. Şablon/override’dan **arka plan rengi** kapsam dışı (iptal). Story arka plan görseli şu an sabit dosya; istenirse sonra upload/URL ile genişletilir (`InvitationStory` içindeki TODO). |
| 2 | **InvitationHero**: özel hero arka plan görseli (yükleme → storage path, render URL) | ✅ Done | `heroImageUri` (`invitation-overrides` şeması), dashboard’da kırpma + yükleme (`InvitationOverridesForm`), public’te `InvitationHero` + `getPublicInvitationImageUrl` (`digital-invitation-images`, DB’de path). |
| 3 | **InvitationClosing** + paylaşılan **PhotoCarousel**: en fazla 10 fotoğraf | ✅ Done | `PhotoCarousel` `photos` prop’u; `closingPhotoUris` (şema + form + `InvitationClosing`); `elif-erdem` demo `ClosingSection` sabit liste. |
| 4 | **Countdown**: birden fazla etkinlik (örn. kına + düğün) | ⬜ TODO | `events[]` veya sabit 2 slot MVP; `InvitationCountdown` + public model. |

## Sonraki faz (bu dosyadaki 0–4 tamamlandıktan sonra)

- Misafir listesi / rezervasyon (RSVP veya kapasite)
- Public galeri

## Tamamlananlar

- **2026-04-14 — Adım 0:** `storyHeadline`, `storySubline`, `closingNote`; public `resolve*` yardımcıları; dashboard formu; şablon `defaults_json` sade şekil.
- **2026-04-16 — Adım 1 (güncel kapsam):** Story için şablondan iki metin public sayfada; şablon/gradient **arka plan rengi** roadmap’ten çıkarıldı (yapılmayacak).
- **2026-04-16 — Adım 2:** Özel hero görseli akışı kodda mevcut (`heroImageUri`, Supabase Storage path, `InvitationHero` / form entegrasyonu).
- **2026-04-16 — Adım 3:** Kapanış galerisi (`closingPhotoUris`, max 10), paylaşılan `PhotoCarousel`, `buildClosingCarouselPhotos` util.

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

Şu an yapmak istediğim: [BURAYA TEK CÜMLE: örn. "Adım 3 PhotoCarousel" veya "Adım 4 çoklu countdown"]
```

### Kısa varyant (minimal)

```text
docs/roadmap.md'ye uy; sıradaki TODO adımı: [adım numarası veya isim]. Sadece bunu uygula.
```

---

## Teknik hatırlatmalar (kısa)

- Public sayfa: `app/[slug]/page.tsx`
- Şablon tipleri: `modules/templates/types.ts`
- Override şeması: `modules/templates/schemas/invitation-overrides.ts` (ör. `heroImageUri`, story metinleri)
- Bileşenler: `modules/invitation/components/*`

Bu bölüm gerektiğinde genişletilir; ana sıra yukarıdaki tabloda kalır.
