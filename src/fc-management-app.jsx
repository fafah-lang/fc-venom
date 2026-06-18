import React, { useState } from 'react';

export default function FCManagementApp() {
  const [vendeur, setVendeur] = useState('');
  const [email, setEmail] = useState('');
  const [client, setClient] = useState('');
  const [contrat, setContrat] = useState('');
  const [fcs, setFcs] = useState([]);

  const handleSubmit = () => {
    if (vendeur && email && client && contrat) {
      setFcs([...fcs, { id: Date.now(), vendeur, email, client, contrat, statut: 'En attente' }]);
      setVendeur('');
      setEmail('');
      setClient('');
      setContrat('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#7D1E1C' }}>Gestion Feuilles Clarification</h1>
      <p>OHM Energie x Groupe Venom</p>

      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Ajouter une FC</h2>
        <input type="text" placeholder="Vendeur" value={vendeur} onChange={(e) => setVendeur(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <input type="text" placeholder="Client" value={client} onChange={(e) => setClient(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <input type="text" placeholder="Numero Contrat" value={contrat} onChange={(e) => setContrat(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <button onClick={handleSubmit} style={{ backgroundColor: '#7D1E1C', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Ajouter</button>
      </div>

      <div>
        <h2>Feuilles Deposees</h2>
        {fcs.length === 0 ? (
          <p>Aucune feuille</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Vendeur</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Client</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Contrat</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {fcs.map((fc) => (
                <tr key={fc.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{fc.vendeur}</td>
                  <td style={{ padding: '10px' }}>{fc.client}</td>
                  <td style={{ padding: '10px' }}>{fc.contrat}</td>
                  <td style={{ padding: '10px' }}>{fc.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
