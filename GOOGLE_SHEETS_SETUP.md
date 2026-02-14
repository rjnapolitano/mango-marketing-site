# Google Sheets Setup Guide

## Overview
All funnel responses are automatically saved to Google Sheets when a user completes the booking form. The data is sent securely through a Next.js API route, keeping your credentials safe.

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API** for your project:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### 2. Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Give it a name (e.g., "Mango Funnel Data")
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### 3. Get Your Service Account Credentials

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Choose "JSON" format
5. Download the JSON file (keep it safe!)

### 4. Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Mango Funnel Responses" (or whatever you prefer)
4. In the first row, add these column headers:
   ```
   Timestamp | Name | Email | Company | Company URL | Growth Challenge | Business Type | Primary Goal | Revenue | Funnel Status | Ad Budget | Urgency
   ```
5. Share the sheet with your service account email:
   - Click "Share" button
   - Add the service account email (found in the JSON file as `client_email`)
   - Give it "Editor" permissions

### 5. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in the values:

   - **GOOGLE_SERVICE_ACCOUNT_EMAIL**: Copy the `client_email` from your JSON file

   - **GOOGLE_PRIVATE_KEY**: Copy the `private_key` from your JSON file
     - Keep all the `\n` characters
     - Wrap it in double quotes
     - Example: `"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"`

   - **GOOGLE_SHEET_ID**: Get this from your Google Sheet URL
     - URL format: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
     - Copy just the SHEET_ID part

3. Save the file

### 6. Restart Your Dev Server

```bash
npm run dev
```

## Testing

1. Go through the funnel flow on your site
2. Answer all the questions
3. Submit the booking form
4. Check your Google Sheet - you should see a new row with all the data!

## Security Notes

- ✅ API keys are stored in `.env.local` which is NOT committed to git
- ✅ All API calls go through your Next.js backend (no client-side exposure)
- ✅ The service account only has access to the specific sheet you shared with it
- ✅ `.env.local` is already in your `.gitignore`

## Troubleshooting

**"Failed to save data" error:**
- Check that the service account email has Editor access to the sheet
- Verify all environment variables are set correctly
- Make sure the Google Sheets API is enabled in your Google Cloud project

**"Invalid credentials" error:**
- Check that the GOOGLE_PRIVATE_KEY includes all the `\n` characters
- Make sure the key is wrapped in double quotes
- Verify the GOOGLE_SERVICE_ACCOUNT_EMAIL matches the JSON file

**Data not appearing:**
- Check the browser console for errors
- Verify the GOOGLE_SHEET_ID is correct
- Make sure you're looking at "Sheet1" (or update the range in the API route)

## What Data is Collected

The system collects:
- **From the funnel:** Growth challenge, business type, primary goal, revenue, funnel status, ad budget, urgency
- **From the form:** Name, email, company name, company URL
- **Metadata:** Timestamp of submission

All data is stored securely and only accessible to you.
