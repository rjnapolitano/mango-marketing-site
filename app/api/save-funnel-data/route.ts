import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received funnel data:', data);

    // Debug environment variables
    console.log('Email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('Private key exists:', !!process.env.GOOGLE_PRIVATE_KEY);
    console.log('Private key starts with:', process.env.GOOGLE_PRIVATE_KEY?.substring(0, 50));

    // Set up Google Sheets API with service account
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    console.log('Private key after replace starts with:', privateKey?.substring(0, 50));

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
