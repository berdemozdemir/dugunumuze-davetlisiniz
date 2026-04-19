-- Storage RLS: `digital-invitation-audio` + `public.events` sahiplik kontrolü
--
-- Path: `events/<event_id>/<dosya>` (örn. `music-*.mp3`) — görsellerle aynı segment yapısı.
-- INSERT/DELETE: sadece `events.id` = path’teki uuid VE `events.owner_id` = `auth.uid()`
--
-- Önkoşul: `integrations/supabase/policies/digital-invitation-images.sql` içindeki
-- `public.invitation_storage_event_path_allows(text)` fonksiyonu mevcut olmalı.
--
-- Supabase → SQL Editor’de çalıştırın.

DROP POLICY IF EXISTS "digital_invitation_audio_select_public" ON storage.objects;
DROP POLICY IF EXISTS "digital_invitation_audio_insert_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "digital_invitation_audio_delete_authenticated" ON storage.objects;

-- Davetiye sayfasında (anon) müzik oynatma: public bucket + public SELECT
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
    AND split_part(trim(both '/' from name), '/', 1) = 'events'
    AND public.invitation_storage_event_path_allows(name)
  );

CREATE POLICY "digital_invitation_audio_delete_authenticated"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'digital-invitation-audio'
    AND split_part(trim(both '/' from name), '/', 1) = 'events'
    AND public.invitation_storage_event_path_allows(name)
  );
