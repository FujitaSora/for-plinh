import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const notes=sqliteTable('notes',{id:text('id').primaryKey(),owner:text('owner').notNull(),title:text('title').notNull(),body:text('body').notNull(),category:text('category').notNull(),pinned:integer('pinned',{mode:'boolean'}).notNull().default(false),created:text('created').notNull()});
