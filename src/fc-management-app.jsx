import React, { useState } from 'react';

export default function FCManagementApp() {
  const [fcs, setFcs] = useState([]);

  return React.createElement('div', { style: { padding: '20px' } },
    React.createElement('h1', { style: { color: '#7D1E1C' } }, 'Gestion FC'),
    React.createElement('p', null, 'OHM Energie x Groupe Venom'),
    React.createElement('p', null, 'App working!')
  );
}
