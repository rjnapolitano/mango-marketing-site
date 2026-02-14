import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received funnel data:', data);

    // Handle private key - decode from base64 if needed
    let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';

    // Check if it's base64 encoded (doesn't start with -----)
    if (!privateKey.startsWith('-----')) {
      // Decode from base64
      privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
    }

    // Aggressively strip all quotes and whitespace from start/end
    privateKey = privateKey.trim();
    while (privateKey.startsWith('"') || privateKey.startsWith("'")) {
      privateKey = privateKey.slice(1);
    }
    while (privateKey.endsWith('"') || privateKey.endsWith("'")) {
      privateKey = privateKey.slice(0, -1);
    }
    privateKey = privateKey.trim();

    // Replace literal \n with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');

    console.log('Private key ready, first 30 chars:', privateKey.substring(0, 30));

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Prepare the row data
    const values = [[
      data.submittedAt || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.company || '',
      data.companyUrl || '',
      data.growthChallenge || '',
      data.businessType || '',
      data.primaryGoal || '',
      data.revenue || '',
      data.funnelStatus || '',
      data.adBudget || '',
      data.urgency || '',
    ]];

    // Append to sheet
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:L', // Adjust range as needed
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    console.log('Successfully saved to Google Sheets:', result.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save data' },
      { status: 500 }
    );
  }
}
