import { relations } from 'drizzle-orm'
import { user } from './auth-schema'
import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core'
// 反馈表
export const feedbacks = pgTable('feedbacks', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  resolved: boolean('resolved').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  userId: text('user_id').notNull(),
})

// 反馈关系定义,一个用户可以有多条反馈
export const feedbacksRelations = relations(feedbacks, ({ one }) => ({
  user: one(user, {
    fields: [feedbacks.userId],
    references: [user.id],
  }),
}))

export const userFeedbacksRelations = relations(user, ({ many }) => ({
  feedbacks: many(feedbacks),
}))
