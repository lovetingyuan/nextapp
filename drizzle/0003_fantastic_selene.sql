ALTER TABLE "playlist_songs" DROP CONSTRAINT "playlist_songs_song_id_songs_id_fk";
--> statement-breakpoint
ALTER TABLE "playlist_songs" ADD CONSTRAINT "playlist_songs_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;