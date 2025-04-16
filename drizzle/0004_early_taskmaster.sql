CREATE TABLE "feedbacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"resolved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL
);
