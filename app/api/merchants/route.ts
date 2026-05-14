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
    const { businessName, ownerName, email, phone, industry } = body
    const result = await sql`
      INSERT INTO merchants (business_name, owner_name, email, phone, industry)
      VALUES (${businessName}, ${ownerName}, ${email}, ${phone}, ${industry})
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create merchant' }, { status: 500 })
  }
}