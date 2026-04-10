CREATE TABLE "weddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"partner_1_name" text NOT NULL,
	"partner_2_name" text NOT NULL,
	"date_time" timestamp with time zone NOT NULL,
	"city" text NOT NULL,
	"venue_name" text,
	"address_text" text NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "weddings_slug_unique" UNIQUE("slug")
);
