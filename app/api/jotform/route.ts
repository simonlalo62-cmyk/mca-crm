import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const businessName = formData.get('q3_legalBusiness')?.toString() || ''
    const dba = formData.get('q4_dba')?.toString() || ''
    const businessStreet = formData.get('q5_businessAddress[addr_line1]')?.toString() || ''
    const businessCity = formData.get('q5_businessAddress[city]')?.toString() || ''
    const businessState = formData.get('q5_businessAddress[state]')?.toString() || ''
    const businessZip = formData.get('q5_businessAddress[zip]')?.toString() || ''
    const businessAddress = `${businessStreet}, ${businessCity}, ${businessState} ${businessZip}`.trim()
    const homeStreet = formData.get('q7_homeAddress[addr_line1]')?.toString() || ''
    const homeCity = formData.get('q7_homeAddress[city]')?.toString() || ''
    const homeState = formData.get('q7_homeAddress[state]')?.toString() || ''
    const homeZip = formData.get('q7_homeAddress[zip]')?.toString() || ''
    const homeAddress = `${homeStreet}, ${homeCity}, ${homeState} ${homeZip}`.trim()
    const entityType = formData.get('q8_typeOf')?.toString() || ''
    const industry = formData.get('q9_products')?.toString() || ''
    const businessStartDate = formData.get('q10_businessStart')?.toString() || ''
    const federalTaxId = formData.get('q11_federalTax')?.toString() || ''
    const annualRevenue = formData.get('q12_annualRevenue')?.toString() || ''
    const ownerFirst = formData.get('q13_owner1Full[first]')?.toString() || ''
    const ownerLast = formData.get('q13_owner1Full[last]')?.toString() || ''
    const ownerName = `${ownerFirst} ${ownerLast}`.trim()
    const phone = formData.get('q14_phoneNumber14')?.toString() || ''
    const email = formData.get('q15_email15')?.toString() || ''
    const dateOfBirth = formData.get('q16_owner1Date')?.toString() || ''
    const ssn = formData.get('q17_owner1Social')?.toString() || ''
    const percentOwnership = formData.get('q18_percent')?.toString() || ''
    const owner2First = formData.get('q19_owner2Full[first]')?.toString() || ''
    const owner2Last = formData.get('q19_owner2Full[last]')?.toString() || ''
    const owner2Name = `${owner2First} ${owner2Last}`.trim()
    const owner2Phone = formData.get('q20_phoneNumber20')?.toString() || ''
    const owner2Email = formData.get('q21_email21')?.toString() || ''
    const owner2Dob = formData.get('q22_owner2Date')?.toString() || ''
    const owner2Ssn = formData.get('q23_owner2Social')?.toString() || ''
    const owner2Ownership = formData.get('q24_owner2Percent')?.toString() || ''

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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Jotform webhook error:', error)
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }
}