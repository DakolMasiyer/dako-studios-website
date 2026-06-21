import { NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  contactInfo: z.string().min(5),
  service: z.enum(["labs", "brand", "motion", "film", "academy"]),
  message: z.string().min(10),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validation = contactSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: validation.error.format() },
        { status: 400 }
      )
    }

    const { name, contactInfo, service, message } = validation.data
    const timestamp = new Date().toISOString()
    const leadId = `lead_${Date.now()}`

    // 1. Local file save removed for security/hygiene (M2)
    // We now rely solely on Airtable and Resend for lead storage.

    // 2. Write to Airtable (if configured)
    const airtableToken = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN
    const airtableBase = process.env.AIRTABLE_BASE_ID
    const airtableTable = process.env.AIRTABLE_TABLE_NAME || 'SME / Film Pipeline'
    
    let airtableStatus = 'skipped'
    
    if (airtableToken && airtableBase) {
      try {
        const url = `https://api.airtable.com/v0/${airtableBase}/${encodeURIComponent(airtableTable)}`
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${airtableToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            records: [
              {
                fields: {
                  'Name': name,
                  'Arm': service.charAt(0).toUpperCase() + service.slice(1), // capitalize
                  'Contact channel': contactInfo.includes('@') ? 'Email' : 'WhatsApp',
                  'Discovery source': 'Website Form',
                  'Status': 'Identified',
                  'Notes': `Message: ${message}\nContact Info: ${contactInfo}\nSubmitted: ${timestamp}\nLocal Lead ID: ${leadId}`,
                }
              }
            ]
          }),
        })

        if (!response.ok) {
          const errText = await response.text()
          throw new Error(`Airtable error response: ${response.status} - ${errText}`)
        }
        airtableStatus = 'success'
      } catch (err: any) {
        console.error('Failed to save to Airtable:', err.message)
        airtableStatus = `failed: ${err.message}`
      }
    } else {
      console.warn('Airtable credentials missing. Skipping Airtable write.')
    }

    // 3. Send Notification Email via Resend (if configured)
    const resendKey = process.env.RESEND_API_KEY
    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'hello@dako.studio'
    
    let resendStatus = 'skipped'

    if (resendKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Dako Studios Intake <intake@dako.studio>',
            to: notificationEmail,
            subject: `New Lead: ${name} (${service.toUpperCase()})`,
            html: `
              <h2>New Lead Submitted via dako.studio</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Service:</strong> ${service.toUpperCase()}</p>
              <p><strong>Contact Info:</strong> ${contactInfo}</p>
              <p><strong>Message:</strong></p>
              <blockquote style="background: #f4f4f4; padding: 10px 15px; border-left: 3px solid #0066cc;">
                ${message.replace(/\n/g, '<br/>')}
              </blockquote>
              <hr/>
              <p style="font-size: 11px; color: #666;">
                Submitted at: ${timestamp}<br/>
                Local Lead ID: ${leadId}<br/>
                Airtable sync status: ${airtableStatus}
              </p>
            `,
          }),
        })

        if (!response.ok) {
          const errText = await response.text()
          throw new Error(`Resend error response: ${response.status} - ${errText}`)
        }
        resendStatus = 'success'
      } catch (err: any) {
        console.error('Failed to send email via Resend:', err.message)
        resendStatus = `failed: ${err.message}`
      }
    } else {
      console.warn('Resend key missing. Skipping notification email.')
    }

    // Fallback console log for backup visibility
    if (airtableStatus !== 'success' && resendStatus !== 'success') {
      console.log('Lead Intake (Console Backup):', {
        id: leadId,
        name,
        contactInfo,
        service,
        message,
        timestamp,
        airtableStatus,
        resendStatus
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Intake submitted successfully',
      leadId,
      sync: {
        airtable: airtableStatus,
        resend: resendStatus,
        local: 'success'
      }
    })
  } catch (error: any) {
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
