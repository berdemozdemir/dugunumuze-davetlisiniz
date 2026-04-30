-- Add default copy (hero/story texts) for templates.
-- Safe to run multiple times due to ON CONFLICT DO UPDATE and jsonb merge.

INSERT INTO "event_templates" ("key", "name", "defaults_json")
VALUES (
  'wedding',
  'Düğün',
  $json${
    "heroTagline": "Evleniyoruz",
    "storyHeadline": "Bir “Evet” ile Başladı",
    "storySubline": "Şimdi sıra sonsuza dek “evet” demeye geldi"
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
    "heroTagline": "Bebeğimiz geliyor",
    "storyHeadline": "Minik mucizemize",
    "storySubline": "Hoş geldin demek için sizinle buluşuyoruz"
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
    "heroEyebrow": "Mezuniyetimize davetlisiniz",
    "heroTagline": "Mezun oluyoruz",
    "storyHeadline": "Bir dönemin sonu",
    "storySubline": "Bu anı birlikte kutlamak için sizi bekliyoruz"
  }$json$::jsonb
)
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "defaults_json" = "event_templates"."defaults_json" || EXCLUDED."defaults_json";

