import { db } from '@/integrations/drizzle/drizzle-client';

/** Drizzle `db` örneği ile uyumlu tip — server action ve yardımcılarda tekrar tanımlamayı önler. */
export type DbClient = typeof db;
