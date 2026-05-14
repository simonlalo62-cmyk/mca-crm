import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    let fields: Record<string, string> = {}

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const json = await request.json()
      fields = json
    } else {
      const formData = await request.formData()
      formData.forEach((value, key) => {
        fields[key] = value.toString()
      })
    }

    console.log('Jotform submission received:', JSON.stringify(fields))

    const businessName = fields['q3_legalBusiness'] || fields['legalBusiness'] || fields['q3_legal_business'] || ''
    const dba = fields['q4_dba'] || fields['dba'] || ''
    const phone = fields['q14_phoneNumber14'] || fields['phoneNumber'] || fields['phone'] || ''
    const email = fields['q15_email15'] || fields['email'] || ''
    const entityType = fields['q8_typeOf'] || fields['typeOf'] || ''
    const industry = fields['q9_products'] || fields['products'] || ''
    const businessStartDate = fields['q10_businessStart'] || fields['businessStart'] || ''
    const federalTaxId = fields['q11_federalTax'] || fields['federalTax'] || ''
    const annualRevenue = fields['q12_annualRevenue'] || fields['annualRevenue'] || ''
    const ssn = fields['q17_owner1Social'] || fields['owner1Social'] || ''
    const dateOfBirth = fields['q16_owner1Date'] || fields['owner1Date'] || ''
    const percentOwnership = fields['q18_percent'] || fields['percent'] || ''

    const ownerFirst = fields['q13_owner1Full[first]'] || fields['owner1FullFirst'] || ''
    const ownerLast = fields['q13_owner1Full[last]'] || fields['owner1FullLast'] || ''
    const ownerName = `${ownerFirst} ${ownerLast}`.trim() || fields['q13_owner1Full'] || ''

    const businessStreet = fields['q5_businessAddress[addr_line1]'] || ''
    const businessCity = fields['q5_businessAddress[city]'] || ''
    const businessState = fields['q5_businessAddress[state]'] || ''
    const businessZip = fields['q5_businessAddress[zip]'] || ''
    const businessAddress = [businessStreet, businessCity, businessState, businessZip].filter(Boolean).join(', ')

    const homeStreet = fields['q7_homeAddress[addr_line1]'] || ''
    const homeCity = fields['q7_homeAddress[city]'] || ''
    const homeState = fields['q7_homeAddress[state]'] || ''
    const homeZip = fields['q7_homeAddress[zip]'] || ''
    const homeAddress = [homeStreet, homeCity, homeState, homeZip].filter(Boolean).join(', ')

    await sql`
      INSERT INTO merchants (
        business_name, dba, business_address, home_address,
        entity_type, industry, business_start_date, federal_tax_id,
        annual_revenue, owner_name, phone, email,
        date_of_birth, ssn, percent_ownership, stage
      ) VALUES (
        ${businessName || 'Unknown'}, ${dba}, ${businessAddress}, ${homeAddress},
        ${entityType}, ${industry}, ${businessStartDate}, ${federalTaxId},
        ${annualRevenue}, ${ownerName}, ${phone}, ${email},
        ${dateOfBirth}, ${ssn}, ${percentOwnership}, 'New Application'
      )
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Jotform webhook error:', error)
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }
}