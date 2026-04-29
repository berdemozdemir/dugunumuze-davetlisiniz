-- Remove legacy `classic` template completely.
-- Any references are migrated to `wedding`.

-- Ensure `wedding` exists (minimal row; will be merged/overridden by later updates if any).
INSERT INTO "event_templates" ("key", "name", "defaults_json")
VALUES (
  'wedding',
  'Düğün',
  $json${ "sections": { "hero": true, "countdown": true, "story": true, "details": true, "closing": true, "musicPlayer": true } }$json$::jsonb
)
ON CONFLICT ("key") DO NOTHING;

WITH
  classic AS (
    SELECT "id" FROM "event_templates" WHERE "key" = 'classic' LIMIT 1
  ),
  wedding AS (
    SELECT "id" FROM "event_templates" WHERE "key" = 'wedding' LIMIT 1
  )
UPDATE "events"
SET "template_id" = (SELECT "id" FROM wedding)
WHERE "template_id" = (SELECT "id" FROM classic);

WITH
  classic AS (
    SELECT "id" FROM "event_templates" WHERE "key" = 'classic' LIMIT 1
  ),
  wedding AS (
    SELECT "id" FROM "event_templates" WHERE "key" = 'wedding' LIMIT 1
  )
UPDATE "event_overrides"
SET "template_id" = (SELECT "id" FROM wedding)
WHERE "template_id" = (SELECT "id" FROM classic);

DELETE FROM "event_templates" WHERE "key" = 'classic';

