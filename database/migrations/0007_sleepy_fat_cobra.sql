ALTER TABLE "weddings" RENAME TO "events";--> statement-breakpoint
ALTER TABLE "wedding_overrides" RENAME TO "event_overrides";--> statement-breakpoint
ALTER TABLE "wedding_templates" RENAME TO "event_templates";--> statement-breakpoint
ALTER TABLE "event_overrides" RENAME COLUMN "wedding_id" TO "event_id";--> statement-breakpoint
ALTER TABLE "event_templates" DROP CONSTRAINT "wedding_templates_key_unique";--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "weddings_slug_unique";--> statement-breakpoint
ALTER TABLE "event_overrides" DROP CONSTRAINT "wedding_overrides_wedding_id_weddings_id_fk";
--> statement-breakpoint
ALTER TABLE "event_overrides" DROP CONSTRAINT "wedding_overrides_template_id_wedding_templates_id_fk";
--> statement-breakpoint
ALTER TABLE "event_overrides" ADD CONSTRAINT "event_overrides_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_overrides" ADD CONSTRAINT "event_overrides_template_id_event_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."event_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_templates" ADD CONSTRAINT "event_templates_key_unique" UNIQUE("key");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_slug_unique" UNIQUE("slug");