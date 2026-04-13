-- classic şablon: kısa not alanı kaldırıldı; story + closing alanları garanti
UPDATE "wedding_templates"
SET "defaults_json" = ("defaults_json" - 'shortNote')
  || '{"storyHeadline":"","storySubline":"","closingNote":""}'::jsonb
WHERE "key" = 'classic';
