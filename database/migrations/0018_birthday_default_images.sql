-- Set birthday default hero/story images (idempotent via jsonb merge).
UPDATE "event_templates"
SET "defaults_json" = "defaults_json" || $json$
{
  "heroImagePublicSrc": "/images/birthday/cover-section-bg-image.webp",
  "storyImagePublicSrc": "/images/birthday/story-section-bg-image.jpg"
}
$json$::jsonb
WHERE "key" = 'birthday';

