INSERT INTO "wedding_templates" ("key", "name", "defaults_json")
VALUES (
  'classic',
  'Klasik davetiye',
  '{
    "sections": {
      "hero": true,
      "countdown": true,
      "story": true,
      "details": true,
      "closing": true,
      "musicPlayer": true
    },
    "quote": "",
    "shortNote": ""
  }'::jsonb
)
ON CONFLICT ("key") DO NOTHING;

