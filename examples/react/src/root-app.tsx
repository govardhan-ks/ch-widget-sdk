import React from 'react';
import { usePlatform } from 'widget-sdk-react';

export function App() {
  const { context, theme, apiRequest } = usePlatform();

  const handleApiCall = async () => {
    try {
      const response = await apiRequest({
        url: '/api/users',
        method: 'POST',
        data: { userId: '123' }
      });
      console.log('API Response:', response);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  if (!context || !theme) return <div>Loading...</div>;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 16 }}>
      <h1>Widget Dashboard (React)</h1>
      <pre>Context: {JSON.stringify(context, null, 2)}</pre>
      <pre>Theme: {JSON.stringify(theme, null, 2)}</pre>
      <button onClick={handleApiCall}>Make API Call</button>
    </div>
  );
}


