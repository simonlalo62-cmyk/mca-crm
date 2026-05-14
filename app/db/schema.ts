import { pgTable, serial, text, timestamp, numeric, integer } from 'drizzle-orm/pg-core';

export const merchants = pgTable('merchants', {
  id: serial('id').primaryKey(),
  businessName: text('business_name').notNull(),
  dba: text('dba'),
  ownerName: text('owner_name'),
  phone: text('phone'),
  email: text('email'),
  businessAddress: text('business_address'),
  homeAddress: text('home_address'),
  entityType: text('entity_type'),
  industry: text('industry'),
  businessStartDate: text('business_start_date'),
  federalTaxId: text('federal_tax_id'),
  annualRevenue: text('annual_revenue'),
  ssn: text('ssn'),
  dateOfBirth: text('date_of_birth'),
  percentOwnership: text('percent_ownership'),
  owner2Name: text('owner2_name'),
  owner2Phone: text('owner2_phone'),
  owner2Email: text('owner2_email'),
  owner2Ssn: text('owner2_ssn'),
  owner2Dob: text('owner2_dob'),
  owner2Ownership: text('owner2_ownership'),
  stage: text('stage').default('New Application'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const deals = pgTable('deals', {
  id: serial('id').primaryKey(),
  merchantId: integer('merchant_id').references(() => merchants.id),
  fundingAmount: numeric('funding_amount'),
  factorRate: numeric('factor_rate'),
  paybackAmount: numeric('payback_amount'),
  stage: text('stage').default('Lead'),
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