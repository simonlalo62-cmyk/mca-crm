import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const text = await request.text()
    console.log('Raw Jotform data:', text)

    const params = new URLSearchParams(text)
    const fields: Record<string, string> = {}
    params.forEach((value, key) => {
      fields[key] = value
    })

    console.log('Parsed fields:', JSON.stringify(fields))

    const businessName = Object.entries(fields).find(([k]) => k.toLowerCase().includes('legal') || k.toLowerCase().includes('business'))?.[1] || 'Unknown'

    await sql`
      INSERT INTO merchants (business_name, stage)
      VALUES (${businessName}, 'New Application')
    `

    return NextResponse.json({ success: true }, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('Jotform error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'jotform webhook active' }, {
    headers: { 'Cache-Control': 'no-store' }
  })
}