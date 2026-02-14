// Utility functions for managing funnel data in localStorage

export interface FunnelData {
  growthChallenge?: string;
  businessType?: string;
  primaryGoal?: string;
  revenue?: string;
  funnelStatus?: string;
  adBudget?: string;
  urgency?: string;
  timestamp?: string;
}

export const saveFunnelData = (key: keyof FunnelData, value: string) => {
  if (typeof window === 'undefined') return;

  const existingData = getFunnelData();
  const updatedData = {
    ...existingData,
    [key]: value,
    timestamp: new Date().toISOString()
  };

  localStorage.setItem('funnelData', JSON.stringify(updatedData));
};

export const getFunnelData = (): FunnelData => {
  if (typeof window === 'undefined') return {};

  const data = localStorage.getItem('funnelData');
  return data ? JSON.parse(data) : {};
};

export const clearFunnelData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('funnelData');
};

export const sendToGoogleSheets = async (formData: any, funnelData: FunnelData) => {
  // Send to our secure API route instead of directly to Google
  const payload = {
    ...funnelData,
    ...formData,
    submittedAt: new Date().toISOString()
  };

  try {
    const response = await fetch('/api/save-funnel-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending funnel data:', error);
    return { success: false, error };
  }
};
