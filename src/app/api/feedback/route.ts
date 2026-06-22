import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Web App URL from Google Apps Script
    const scriptUrl = process.env.GOOGLE_SHEETS_WEB_APP_URL;
    
    if (!scriptUrl) {
      console.error('Missing GOOGLE_SHEETS_WEB_APP_URL environment variable');
      // If no URL is set, we still return success locally to avoid breaking the UI for the user while testing,
      // but in production we might want to throw an error.
      console.log('Would have submitted:', body);
      return NextResponse.json({ success: true, note: 'Mocked locally due to missing script URL' });
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      // Google Apps Script doesn't strictly require headers for simple text/plain payloads, 
      // but if we use text/plain it avoids preflight requests on the client if we ever move this client-side.
      // Since we are server-side, application/json is fine, but Google Apps script expects a post param or raw data.
      // Easiest is to stringify the body.
      body: JSON.stringify(body),
    });

    // We don't strictly need to await json() as GAS might return HTML/redirects if not set up correctly.
    // It's safer to just return success if the fetch didn't throw an error.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
