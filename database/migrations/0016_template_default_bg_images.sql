-- Add default public background images for selected templates.
-- Safe to run multiple times due to ON CONFLICT DO UPDATE and jsonb merge.

INSERT INTO "event_templates" ("key", "name", "defaults_json")
VALUES (
  'wedding',
  'Düğün',
  $json${
    "heroImagePublicSrc": "/images/wedding/cover-section-bg-image.png",
    "storyImagePublicSrc": "/images/wedding/story-section-bg-image.jpeg"
  }$json$::jsonb
)
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "defaults_json" = "event_templates"."defaults_json" || EXCLUDED."defaults_json";

INSERT INTO "event_templates" ("key", "name", "defaults_json")
VALUES (
  'babyshower',
  'Baby shower',
  $json${
    "heroImagePublicSrc": "/images/baby-shower/cover-section-bg-image.jpeg",
    "storyImagePublicSrc": "/images/baby-shower/story-section-bg-image.jpg"
  }$json$::jsonb
)
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "defaults_json" = "event_templates"."defaults_json" || EXCLUDED."defaults_json";

INSERT INTO "event_templates" ("key", "name", "defaults_json")
VALUES (
  'graduation',
  'Mezuniyet',
  $json${
    "sections": {
      "hero": true,
      "countdown": true,
      "story": true,
      "details": true,
      "closing": true,
      "musicPlayer": true
    },
    "heroEyebrow": "Mezuniyetimize davetlisiniz",
    "heroImagePublicSrc": "/images/graduation/cover-section-bg-image.jpg",
    "storyImagePublicSrc": "/images/graduation/story-section-bg-image.avif",
    "createForm": {
      "primaryNameLabel": "Mezun adı",
      "primaryNamePlaceholder": "Elif",
      "secondaryNameLabel": "İkinci isim",
      "secondaryNamePlaceholder": "",
      "secondaryNameOptionalLabelSuffix": "(opsiyonel)",
      "dateTimeLabel": "Tarih / saat",
      "cityLabel": "Şehir",
      "cityPlaceholder": "İstanbul",
      "venueNameLabel": "Mekân adı (opsiyonel)",
      "venueNamePlaceholder": "Okul / Salon",
      "addressTextLabel": "Adres",
      "addressTextPlaceholder": "Açık adres"
    }
  }$json$::jsonb
)
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "defaults_json" = "event_templates"."defaults_json" || EXCLUDED."defaults_json";

