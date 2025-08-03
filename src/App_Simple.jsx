/**
 * Simplified App Component for Debugging
 */

import { useState } from 'react';

function AppSimple() {
  const [message, setMessage] = useState('Spelling Bee Loading...');

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Spelling Bee Debug</h1>
      <p>{message}</p>
      <button onClick={() => setMessage('App is working!')}>
        Test Click
      </button>
    </div>
  );
}

export default AppSimple;