import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const merchants = await sql`SELECT * FROM merchants ORDER BY created_at DESC`
    return NextResponse.json(merchants)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch merchants' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await sql`
      INSERT INTO merchants (
        business_name, dba, owner_name, phone, email,
        business_address, home_address, entity_type, industry,
        business_start_date, federal_tax_id, annual_revenue,
        ssn, date_of_birth, percent_ownership, stage
      ) VALUES (
        ${body.businessName}, ${body.dba}, ${body.ownerName}, ${body.phone}, ${body.email},
        ${body.businessAddress}, ${body.homeAddress}, ${body.entityType}, ${body.industry},
        ${body.businessStartDate}, ${body.federalTaxId}, ${body.annualRevenue},
        ${body.ssn}, ${body.dateOfBirth}, ${body.percentOwnership}, 'New Application'
      ) RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create merchant' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const result = await sql`
      UPDATE merchants SET stage = ${body.stage} WHERE id = ${body.id} RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update merchant' }, { status: 500 })
  }
}