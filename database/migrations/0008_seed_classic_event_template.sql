-- `bindDefaultTemplateToEvent` ve `DEFAULT_EVENT_TEMPLATE_KEY` için zorunlu satır.
-- `modules/templates/constants/default-invitation.ts` ile uyumlu varsayılan JSON.
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
    "countdownEvents": []
  }$json$::jsonb
)
ON CONFLICT ("key") DO NOTHING;
