import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const text = await request.text()
    const params = new URLSearchParams(text)
    const fields: Record<string, string> = {}
    params.forEach((value, key) => {
      fields[key] = value
    })

    console.log('Jotform fields:', JSON.stringify(fields))

    const businessName = fields['q3_legalBusiness'] || fields['Legal Business Name'] || 'Unknown'
    const dba = fields['q4_dba'] || fields['DBA'] || ''
    const businessAddress = fields['q6_businessAddress'] || fields['Business Address'] || ''
    const homeAddress = fields['q8_homeAddress'] || fields['Home Address'] || ''
    const entityType = fields['q9_typeOf'] || fields['Type Of Entity'] || ''
    const industry = fields['q28_products'] || fields['Products, Services Sold'] || ''
    const businessStartDate = fields['q10_businessStart'] || fields['Business Start Date'] || ''
    const federalTaxId = fields['q20_federalTax'] || fields['Federal Tax ID (9 Digits)'] || ''
    const annualRevenue = fields['q29_annualRevenue'] || fields['Annual Revenue'] || ''
    const ownerName = fields['q13_owner1Full'] || fields['Owner 1 Full Name'] || ''
    const phone = fields['q14_phoneNumber14'] || fields['Phone Number'] || ''
    const email = fields['q15_email15'] || fields['Email'] || ''
    const dateOfBirth = fields['q11_owner1Date'] || fields['Owner 1 Date Of Birth'] || ''
    const ssn = fields['q21_owner1Social'] || fields['Owner 1 Social Security Number'] || ''
    const percentOwnership = fields['q22_percent'] || fields['Percent Ownership (%)'] || ''
    const owner2Name = fields['q23_owner2Full'] || fields['Owner 2 Full Name (If Necessary)'] || ''
    const owner2Phone = fields['q24_phoneNumber24'] || fields['Phone Number.1'] || ''
    const owner2Email = fields['q25_email25'] || fields['Email.1'] || ''
    const owner2Dob = fields['q26_owner2Date'] || fields['Owner 2 Date Of Birth'] || ''
    const owner2Ssn = fields['q27_owner2Social'] || fields['Owner 2 Social Security Number'] || ''
    const owner2Ownership = fields['q30_owner2Percent'] || fields['Owner 2 Percent Ownership (%)'] || ''

    await sql`
      INSERT INTO merchants (
        business_name, dba, business_address, home_address,
        entity_type, industry, business_start_date, federal_tax_id,
        annual_revenue, owner_name, phone, email,
        date_of_birth, ssn, percent_ownership,
        owner2_name, owner2_phone, owner2_email,
        owner2_dob, owner2_ssn, owner2_ownership,
        stage
      ) VALUES (
        ${businessName}, ${dba}, ${businessAddress}, ${homeAddress},
        ${entityType}, ${industry}, ${businessStartDate}, ${federalTaxId},
        ${annualRevenue}, ${ownerName}, ${phone}, ${email},
        ${dateOfBirth}, ${ssn}, ${percentOwnership},
        ${owner2Name}, ${owner2Phone}, ${owner2Email},
        ${owner2Dob}, ${owner2Ssn}, ${owner2Ownership},
        'New Application'
      )
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