CREATE TABLE "rsvp_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"primary_full_name" text NOT NULL,
	"primary_phone" text NOT NULL,
	"companions_json" jsonb NOT NULL,
	"note" text,
	"party_size" integer NOT NULL,
	"final_event_title" text,
	"final_event_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rsvp_responses" ADD CONSTRAINT "rsvp_responses_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "rsvp_responses_event_primary_phone_uid" ON "rsvp_responses" USING btree ("event_id","primary_phone");