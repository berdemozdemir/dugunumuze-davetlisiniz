ALTER TABLE "events" RENAME COLUMN "partner_1_name" TO "primary_name";--> statement-breakpoint
ALTER TABLE "events" RENAME COLUMN "partner_2_name" TO "secondary_name";--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "template_id" uuid;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "status" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "current_step" smallint DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_template_id_event_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."event_templates"("id") ON DELETE cascade ON UPDATE no action;