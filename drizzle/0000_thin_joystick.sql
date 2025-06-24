CREATE TABLE IF NOT EXISTS "dopecontrol_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "dopecontrol_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dopecontrol_habit" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"isTemplate" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dopecontrol_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdById" varchar(255) NOT NULL,
	"habitId" integer NOT NULL,
	"description" text NOT NULL,
	"duration" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dopecontrol_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dopecontrol_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dopecontrol_verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "dopecontrol_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dopecontrol_account" ADD CONSTRAINT "dopecontrol_account_userId_dopecontrol_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."dopecontrol_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dopecontrol_habit" ADD CONSTRAINT "dopecontrol_habit_userId_dopecontrol_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."dopecontrol_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dopecontrol_post" ADD CONSTRAINT "dopecontrol_post_createdById_dopecontrol_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."dopecontrol_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dopecontrol_post" ADD CONSTRAINT "dopecontrol_post_habitId_dopecontrol_habit_id_fk" FOREIGN KEY ("habitId") REFERENCES "public"."dopecontrol_habit"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dopecontrol_session" ADD CONSTRAINT "dopecontrol_session_userId_dopecontrol_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."dopecontrol_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "dopecontrol_account" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "habit_name_idx" ON "dopecontrol_habit" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "habit_userId_idx" ON "dopecontrol_habit" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_createdById_createdAt_idx" ON "dopecontrol_post" ("createdById","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_habitId_idx" ON "dopecontrol_post" ("habitId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_createdAt_idx" ON "dopecontrol_post" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "dopecontrol_session" ("userId");