import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  // boolean,
  primaryKey,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { user } from './auth-schema'

// 用户关系定义
export const usersRelations = relations(user, ({ one, many }) => ({
  userSettings: one(userSettings),
  songs: many(songs),
  playlists: many(playlists),
}))

// 用户设置表
export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
    .unique(),
  theme: varchar('theme', { length: 20 }).default('light'),
  language: varchar('language', { length: 10 }).default('zh-CN'),
  // notifications: boolean('notifications').default(true),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 用户设置关系定义
export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(user, {
    fields: [userSettings.userId],
    references: [user.id],
  }),
}))

// 歌曲表
export const songs = pgTable('songs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  artist: varchar('artist', { length: 100 }).notNull(),
  album: varchar('album', { length: 100 }),
  duration: integer('duration').notNull(), // 秒数
  fileUrl: varchar('file_url', { length: 255 }).notNull(),
  cover: varchar('cover', { length: 255 }),
  rating: integer('rating').default(0), // 0表示没有设置评分，最低1分最高10分
  lyricist: varchar('lyricist', { length: 100 }),
  composer: varchar('composer', { length: 100 }),
  publishDate: varchar('publish_date', { length: 20 }),
  description: text('description'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 歌曲关系定义
export const songsRelations = relations(songs, ({ one, many }) => ({
  user: one(user, {
    fields: [songs.userId],
    references: [user.id],
  }),
  playlistSongs: many(playlistSongs),
}))

// 歌单表
export const playlists = pgTable('playlists', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description'),
  // coverUrl: varchar('cover_url', { length: 255 }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  position: integer('position').notNull().default(0), // 歌单顺序
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 歌单关系定义
export const playlistsRelations = relations(playlists, ({ one, many }) => ({
  user: one(user, {
    fields: [playlists.userId],
    references: [user.id],
  }),
  playlistSongs: many(playlistSongs),
}))

// 歌单-歌曲关联表
export const playlistSongs = pgTable(
  'playlist_songs',
  {
    // id: serial('id').primaryKey(),
    playlistId: integer('playlist_id')
      .notNull()
      .references(() => playlists.id, { onDelete: 'cascade' }),
    songId: integer('song_id')
      .notNull()
      .references(() => songs.id),
    position: integer('position').notNull().default(0), // 歌曲在歌单中的顺序
    addedAt: timestamp('added_at').defaultNow().notNull(),
  },
  table => [primaryKey({ columns: [table.playlistId, table.songId] })]
)

// 歌单-歌曲关系定义
export const playlistSongsRelations = relations(playlistSongs, ({ one }) => ({
  playlist: one(playlists, {
    fields: [playlistSongs.playlistId],
    references: [playlists.id],
  }),
  song: one(songs, {
    fields: [playlistSongs.songId],
    references: [songs.id],
  }),
}))
