import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const deals = await sql`
      SELECT deals.*, merchants.business_name 
      FROM deals 
      LEFT JOIN merchants ON deals.merchant_id = merchants.id 
      ORDER BY deals.created_at DESC`
    return NextResponse.json(deals)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { merchantId, fundingAmount, factorRate, funder, stage, notes } = body
    const paybackAmount = Number(fundingAmount) * Number(factorRate)
    const result = await sql`
      INSERT INTO deals (merchant_id, funding_amount, factor_rate, payback_amount, funder, stage, notes)
      VALUES (${merchantId}, ${fundingAmount}, ${factorRate}, ${paybackAmount}, ${funder}, ${stage}, ${notes})
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, stage } = body
    const result = await sql`
      UPDATE deals SET stage = ${stage} WHERE id = ${id} RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 })
  }
}