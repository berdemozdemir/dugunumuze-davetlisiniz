-- Storage RLS: `digital-invitation-audio` (public read, sahiplik ile INSERT/DELETE)
--
-- Path: `weddings/<wedding_id>/music-<ts>.<ext>` — görsel bucket ile aynı kural.
-- `invitation_storage_wedding_path_allows` fonksiyonu `digital-invitation-images.sql`
-- içinde tanımlı olmalı; yoksa önce o dosyayı çalıştırın.
--
-- Supabase → SQL Editor’de çalıştırın.

DROP POLICY IF EXISTS "digital_invitation_audio_select_public" ON storage.objects;
DROP POLICY IF EXISTS "digital_invitation_audio_insert_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "digital_invitation_audio_delete_authenticated" ON storage.objects;

CREATE POLICY "digital_invitation_audio_select_public"
  ON storage.objects
  FOR SELECT
  TO PUBLIC
  USING (bucket_id = 'digital-invitation-audio');

CREATE POLICY "digital_invitation_audio_insert_authenticated"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'digital-invitation-audio'
    AND split_part(trim(both '/' from name), '/', 1) = 'weddings'
    AND public.invitation_storage_wedding_path_allows(name)
  );

CREATE POLICY "digital_invitation_audio_delete_authenticated"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'digital-invitation-audio'
    AND split_part(trim(both '/' from name), '/', 1) = 'weddings'
    AND public.invitation_storage_wedding_path_allows(name)
  );
