import { pgTable, serial, text, timestamp, numeric, integer } from 'drizzle-orm/pg-core';

export const merchants = pgTable('merchants', {
  id: serial('id').primaryKey(),
  businessName: text('business_name').notNull(),
  ownerName: text('owner_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  industry: text('industry'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const deals = pgTable('deals', {
  id: serial('id').primaryKey(),
  merchantId: integer('merchant_id').references(() => merchants.id),
  fundingAmount: numeric('funding_amount'),
  factorRate: numeric('factor_rate'),
  paybackAmount: numeric('payback_amount'),
  stage: text('stage').default('lead'),
  funder: text('funder'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const activityLog = pgTable('activity_log', {
  id: serial('id').primaryKey(),
  dealId: integer('deal_id').references(() => deals.id),
  action: text('action').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});