-- Create-flow label/placeholder defaults + additional event type templates.

-- 1) Classic template: add createForm defaults (idempotent via jsonb merge).
UPDATE "event_templates"
SET "defaults_json" = "defaults_json" || $json$
{
  "createForm": {
    "primaryNameLabel": "Birinci isim",
    "primaryNamePlaceholder": "Elif",
    "secondaryNameLabel": "İkinci isim",
    "secondaryNamePlaceholder": "Erdem",
    "secondaryNameOptionalLabelSuffix": "(opsiyonel)",
    "dateTimeLabel": "Tarih / saat",
    "cityLabel": "Şehir",
    "cityPlaceholder": "İstanbul",
    "venueNameLabel": "Mekân adı (opsiyonel)",
    "venueNamePlaceholder": "Bahçe / Salon / Ev",
    "addressTextLabel": "Adres",
    "addressTextPlaceholder": "Açık adres"
  }
}
$json$::jsonb
WHERE "key" = 'classic';

-- 2) Wedding
INSERT INTO "event_templates" ("key", "name", "defaults_json")
VALUES (
  'wedding',
  'Düğün',
  $json${
    "sections": {
      "hero": true,
      "countdown": true,
      "story": true,
      "details": true,
      "closing": true,
      "musicPlayer": true
    },
    "heroEyebrow": "Sizi düğünümüze bekliyoruz",
    "heroTagline": "",
    "quote": "",
    "storyHeadline": "",
    "storySubline": "",
    "storyImageUri": "",
    "closingNote": "",
    "closingPhotoUris": [],
    "countdownEvents": [],
    "createForm": {
      "primaryNameLabel": "Birinci isim",
      "primaryNamePlaceholder": "Elif",
      "secondaryNameLabel": "İkinci isim",
      "secondaryNamePlaceholder": "Erdem",
      "secondaryNameOptionalLabelSuffix": "(opsiyonel)",
      "dateTimeLabel": "Düğün tarihi / saati",
      "cityLabel": "Şehir",
      "cityPlaceholder": "İstanbul",
      "venueNameLabel": "Mekân adı (opsiyonel)",
      "venueNamePlaceholder": "Düğün salonu / Otel",
      "addressTextLabel": "Adres",
      "addressTextPlaceholder": "Açık adres"
    }
  }$json$::jsonb
)
ON CONFLICT ("key") DO NOTHING;

-- 3) Kına
INSERT INTO "event_templates" ("key", "name", "defaults_json")
VALUES (
  'kina',
  'Kına',
  $json${
    "sections": {
      "hero": true,
      "countdown": true,
      "story": true,
      "details": true,
      "closing": true,
      "musicPlayer": true
    },
    "heroEyebrow": "Kına gecemize davetlisiniz",
    "heroTagline": "",
    "quote": "",
    "storyHeadline": "",
    "storySubline": "",
    "storyImageUri": "",
    "closingNote": "",
    "closingPhotoUris": [],
    "countdownEvents": [],
    "createForm": {
      "primaryNameLabel": "Gelin adı",
      "primaryNamePlaceholder": "Elif",
      "secondaryNameLabel": "İkinci isim",
      "secondaryNamePlaceholder": "",
      "secondaryNameOptionalLabelSuffix": "(opsiyonel)",
      "dateTimeLabel": "Kına tarihi / saati",
      "cityLabel": "Şehir",
      "cityPlaceholder": "İstanbul",
      "venueNameLabel": "Mekân adı (opsiyonel)",
      "venueNamePlaceholder": "Kına mekânı",
      "addressTextLabel": "Adres",
      "addressTextPlaceholder": "Açık adres"
    }
  }$json$::jsonb
)
ON CONFLICT ("key") DO NOTHING;

-- 4) Birthday
INSERT INTO "event_templates" ("key", "name", "defaults_json")
VALUES (
  'birthday',
  'Doğum günü',
  $json${
    "sections": {
      "hero": true,
      "countdown": true,
      "story": true,
      "details": true,
      "closing": true,
      "musicPlayer": true
    },
    "heroEyebrow": "Doğum günü partime bekliyorum",
    "heroTagline": "",
    "quote": "",
    "storyHeadline": "",
    "storySubline": "",
    "storyImageUri": "",
    "closingNote": "",
    "closingPhotoUris": [],
    "countdownEvents": [],
    "createForm": {
      "primaryNameLabel": "Kimin doğum günü?",
      "primaryNamePlaceholder": "Elif",
      "secondaryNameLabel": "İkinci isim",
      "secondaryNamePlaceholder": "",
      "secondaryNameOptionalLabelSuffix": "(opsiyonel)",
      "dateTimeLabel": "Tarih / saat",
      "cityLabel": "Şehir",
      "cityPlaceholder": "İstanbul",
      "venueNameLabel": "Mekân adı (opsiyonel)",
      "venueNamePlaceholder": "Kafe / Ev",
      "addressTextLabel": "Adres",
      "addressTextPlaceholder": "Açık adres"
    }
  }$json$::jsonb
)
ON CONFLICT ("key") DO NOTHING;

