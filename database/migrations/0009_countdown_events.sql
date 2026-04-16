UPDATE "wedding_templates"
SET
  "defaults_json" = "defaults_json" || '{"countdownEvents": []}'::jsonb
WHERE
  NOT ("defaults_json" ? 'countdownEvents');
