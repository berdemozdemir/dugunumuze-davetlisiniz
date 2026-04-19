-- Storage RLS: `digital-invitation-images` + `public.events` sahiplik kontrolü
--
-- Path: `events/<event_id>/<dosya>` (başta / yok)
-- INSERT/DELETE: sadece `events.id` = path’teki uuid VE `events.owner_id` = `auth.uid()`
--
-- Supabase → SQL Editor’de çalıştırın.

-- Eski `weddings` tabanlı fonksiyon (varsa) kaldırılır; yeni isimle yeniden oluşturulur.
DROP FUNCTION IF EXISTS public.invitation_storage_wedding_path_allows(text);

-- `events` üzerinde RLS varsa EXISTS bazen görünmez; definer + row_security off ile okunur.
CREATE OR REPLACE FUNCTION public.invitation_storage_event_path_allows(p_object_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
STABLE
AS $$
DECLARE
  p text;
  eid uuid;
  uid uuid;
BEGIN
  p := trim(both '/' from coalesce(p_object_name, ''));
  uid := auth.uid();

  IF uid IS NULL THEN
    RETURN false;
  END IF;

  IF split_part(p, '/', 1) <> 'events' THEN
    RETURN false;
  END IF;

  BEGIN
    eid := split_part(p, '/', 2)::uuid;
  EXCEPTION
    WHEN invalid_text_representation THEN
      RETURN false;
  END;

  RETURN EXISTS (
    SELECT 1
    FROM public.events e
    WHERE e.id = eid
      AND e.owner_id = uid
  );
END;
$$;

REVOKE ALL ON FUNCTION public.invitation_storage_event_path_allows(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.invitation_storage_event_path_allows(text) TO PUBLIC;

DROP POLICY IF EXISTS "digital_invitation_images_select_public" ON storage.objects;
DROP POLICY IF EXISTS "digital_invitation_images_insert_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "digital_invitation_images_delete_authenticated" ON storage.objects;

CREATE POLICY "digital_invitation_images_select_public"
  ON storage.objects
  FOR SELECT
  TO PUBLIC
  USING (bucket_id = 'digital-invitation-images');

CREATE POLICY "digital_invitation_images_insert_authenticated"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'digital-invitation-images'
    AND split_part(trim(both '/' from name), '/', 1) = 'events'
    AND public.invitation_storage_event_path_allows(name)
  );

CREATE POLICY "digital_invitation_images_delete_authenticated"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'digital-invitation-images'
    AND split_part(trim(both '/' from name), '/', 1) = 'events'
    AND public.invitation_storage_event_path_allows(name)
  );

/*
 * --- Geri dönüş (sadece path + bucket, sahiplik yok) ---
 * Bu fonksiyonu kullanmayan INSERT/DELETE istersen önce policy’leri DROP edip
 * aşağıdakileri çalıştır; fonksiyonu silmek zorunda değilsin.
 *
DROP POLICY IF EXISTS "digital_invitation_images_insert_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "digital_invitation_images_delete_authenticated" ON storage.objects;

CREATE POLICY "digital_invitation_images_insert_authenticated"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'digital-invitation-images'
    AND split_part(trim(both '/' from name), '/', 1) = 'events'
  );

CREATE POLICY "digital_invitation_images_delete_authenticated"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'digital-invitation-images'
    AND split_part(trim(both '/' from name), '/', 1) = 'events'
  );
*/
