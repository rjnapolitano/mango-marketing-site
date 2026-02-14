import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Set up Google Sheets API with service account
    // Your credentials will be stored in environment variables
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:L', // Adjust range as needed
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save data' },
      { status: 500 }
    );
  }
}
