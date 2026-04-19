-- Hikâye bölümü arka plan görseli için şablon varsayılanı (mevcut kurulumlara eklenir).
UPDATE "event_templates"
SET "defaults_json" = "defaults_json" || '{"storyImageUri": ""}'::jsonb
WHERE "key" = 'classic';
