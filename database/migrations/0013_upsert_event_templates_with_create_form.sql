-- Re-seed / upsert event templates.
-- Rationale: Seed-like migrations (e.g. classic template insert) are marked as applied and won't rerun.
-- If rows were deleted manually, we need a new migration to re-create them deterministically.

-- classic
INSERT INTO "event_templates" ("key", "name", "defaults_json")
VALUES (
  'classic',
  'Klasik davetiye',
  $json${
    "sections": {
      "hero": true,
      "countdown": true,
      "story": true,
      "details": true,
      "closing": true,
      "musicPlayer": true
    },
    "heroImageUri": "",
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
      "dateTimeLabel": "Tarih / saat",
      "cityLabel": "Şehir",
      "cityPlaceholder": "İstanbul",
      "venueNameLabel": "Mekân adı (opsiyonel)",
      "venueNamePlaceholder": "Bahçe / Salon / Ev",
      "addressTextLabel": "Adres",
      "addressTextPlaceholder": "Açık adres"
    }
  }$json$::jsonb
)
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "defaults_json" = "event_templates"."defaults_json" || EXCLUDED."defaults_json";

-- wedding
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
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "defaults_json" = "event_templates"."defaults_json" || EXCLUDED."defaults_json";

-- kina
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
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "defaults_json" = "event_templates"."defaults_json" || EXCLUDED."defaults_json";

-- birthday
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
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "defaults_json" = "event_templates"."defaults_json" || EXCLUDED."defaults_json";

