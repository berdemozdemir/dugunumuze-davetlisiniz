-- Add default closing carousel photos for templates (public images).
-- Safe to run multiple times due to ON CONFLICT DO UPDATE and jsonb merge.

INSERT INTO "event_templates" ("key", "name", "defaults_json")
VALUES (
  'wedding',
  'Düğün',
  $json${
    "closingPhotoUris": [
      "/images/wedding/carousel-1.jpg",
      "/images/wedding/carousel-2.jpeg",
      "/images/wedding/carousel-3.webp"
    ]
  }$json$::jsonb
)
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "defaults_json" = "event_templates"."defaults_json" || EXCLUDED."defaults_json";

INSERT INTO "event_templates" ("key", "name", "defaults_json")
VALUES (
  'kina',
  'Kına',
  $json${
    "closingPhotoUris": [
      "/images/henna-night/carousel-1.jpeg",
      "/images/henna-night/carousel-2.webp",
      "/images/henna-night/carousel-3.jpeg"
    ]
  }$json$::jsonb
)
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "defaults_json" = "event_templates"."defaults_json" || EXCLUDED."defaults_json";

INSERT INTO "event_templates" ("key", "name", "defaults_json")
VALUES (
  'birthday',
  'Doğum günü',
  $json${
    "closingPhotoUris": [
      "/images/birthday/carousel-1.jpg",
      "/images/birthday/carousel-2.jpg",
      "/images/birthday/carousel-3.jpg"
    ]
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
    "closingPhotoUris": [
      "/images/baby-shower/carousel-1.jpg",
      "/images/baby-shower/carousel-2.jpg",
      "/images/baby-shower/carousel-3.jpg"
    ]
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
    "closingPhotoUris": [
      "/images/graduation/carousel-1.jpg",
      "/images/graduation/carousel-2.jpg",
      "/images/graduation/carousel-3.jpg"
    ]
  }$json$::jsonb
)
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "defaults_json" = "event_templates"."defaults_json" || EXCLUDED."defaults_json";

