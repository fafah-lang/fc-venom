import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export default function FCManagementApp() {
  const [fcs, setFcs] = useState([]);
  const [formData, setFormData] = useState({
    vendeur: '',
    emailVendeur: '',
    client: '',
    contrat: '',
    fileName: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFC, setSelectedFC] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('fcs');
    if (saved) setFcs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('fcs', JSON.stringify(fcs));
  }, [fcs]);

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
    if (e.target.files[0]) {
      setFormData({ ...formData, fileName: e.target.files[0].name });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddFC = () => {
    if (!formData.vendeur || !formData.emailVendeur || !formData.client || !formData.contrat || !selectedFile) {
      alert('Tous les champs sont obligatoires!');
      return;
    }

    const newFC = {
      id: Date.now(),
      vendeur: formData.vendeur,
      emailVendeur: formData.emailVendeur,
      client: formData.client,
      contrat: formData.contrat,
      fileName: formData.fileName,
      statut: 'En attente',
      dateDépôt: new Date().toLocaleDateString('fr-FR'),
      dateConfirmation: null,
      historique: [
        {
          statut: 'En attente',
          date: new Date().toLocaleDateString('fr-FR'),
          modifiéPar: 'Système',
          emailEnvoyé: true,
          emailOHMEnvoyé: false
        }
      ]
    };

    setFcs([...fcs, newFC]);
    setFormData({ vendeur: '', emailVendeur: '', client: '', contrat: '', fileName: '' });
    setSelectedFile(null);

    console.log(`Email envoyé à ${formData.emailVendeur}: FC créée`);
  };

  const handleChangeStatus = (fcId, status) => {
    setFcs(fcs.map(fc => {
      if (fc.id === fcId) {
        const updated = {
          ...fc,
          statut: status,
          dateConfirmation: status === 'Confirmée' ? new Date().toLocaleDateString('fr-FR') : fc.dateConfirmation,
          historique: [
            ...fc.historique,
            {
              statut: status,
              date: new Date().toLocaleDateString('fr-FR'),
              modifiéPar: 'Agent Back-Office',
              emailEnvoyé: true,
              emailOHMEnvoyé: status === 'Annulée'
            }
          ]
        };

        console.log(`Email envoyé à ${fc.emailVendeur}: Statut changé en ${status}`);

        if (status === 'Annulée') {
          console.log(`Email envoyé à relation-partenaires@ohm-energie.com: Annulation de ${fc.contrat}`);
        }

        return updated;
      }
      return fc;
    }));
  };

  const exportToCSV = () => {
    const data = fcs.map(fc => ({
      'Vendeur': fc.vendeur,
      'Email': fc.emailVendeur,
      'Client': fc.client,
      'Contrat': fc.contrat,
      'Statut': fc.statut,
      'Date Dépôt': fc.dateDépôt,
      'Date Confirmation': fc.dateConfirmation || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'FC');
    XLSX.writeFile(wb, 'feuilles-clarification.xlsx');
  };

  const statusColors = {
    'En attente': '#fffbeb',
    'Confirmée': '#dcfce7',
    'Annulée': '#fee2e2',
    'FCC non reçue': '#fee2e2'
  };

  const statusEmojis = {
    'En attente': '⏳',
    'Confirmée': '✅',
    'Annulée': '❌',
    'FCC non reçue': '⚠️'
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ borderBottom: '2px solid #7D1E1C', paddingBottom: '15px', marginBottom: '30px' }}>
        <h1 style={{ color: '#7D1E1C', margin: '0 0 10px 0' }}>📋 Gestion des Feuilles de Clarification</h1>
        <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>OHM Énergie × Groupe Venom</p>
      </header>

      <section style={{
        backgroundColor: '#F9F6F4',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #e5d4cf'
      }}>
        <h2 style={{ fontSize: '18px', marginTop: '0', color: '#7D1E1C' }}>📝 Nouvelle Feuille de Clarification</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <input
            type="text"
            name="vendeur"
            placeholder="Nom du vendeur"
            value={formData.vendeur}
            onChange={handleInputChange}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
          />
          <input
            type="email"
            name="emailVendeur"
            placeholder="Email du vendeur"
            value={formData.emailVendeur}
            onChange={handleInputChange}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
          />
          <input
            type="text"
            name="client"
            placeholder="Nom du client"
            value={formData.client}
            onChange={handleInputChange}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
          />
          <input
            type="text"
            name="contrat"
            placeholder="Numéro de contrat"
            value={formData.contrat}
            onChange={handleInputChange}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Télécharger FC (PDF/Image):
          </label>
          <input
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
          />
          {selectedFile && <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>✓ {selectedFile.name}</p>}
        </div>

        <button
          onClick={handleAddFC}
          style={{
            backgroundColor: '#7D1E1C',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Déposer la FC
        </button>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ fontSize: '18px', margin: '0', color: '#7D1E1C' }}>📊 Suivi des Feuilles</h2>
          {fcs.length > 0 && (
            <button
              onClick={exportToCSV}
              style={{
                backgroundColor: '#C9A14A',
                color: 'white',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              📥 Exporter Excel
            </button>
          )}
        </div>

        {fcs.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '40px 20px' }}>Aucune feuille de clarification déposée</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9F6F4', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Vendeur</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Client</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Contrat</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Statut</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fcs.map((fc) => (
                  <tr key={fc.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{fc.vendeur}</td>
                    <td style={{ padding: '12px' }}>{fc.client}</td>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{fc.contrat}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        backgroundColor: statusColors[fc.statut],
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        {statusEmojis[fc.statut]} {fc.statut}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>{fc.dateDépôt}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedFC(fc)}
                        style={{
                          backgroundColor: '#7D1E1C',
                          color: 'white',
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedFC && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '1000'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: '0', color: '#7D1E1C' }}>Modifier le statut</h3>

            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#F9F6F4', borderRadius: '4px' }}>
              <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Vendeur:</strong> {selectedFC.vendeur}</p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Client:</strong> {selectedFC.client}</p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Contrat:</strong> {selectedFC.contrat}</p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Statut actuel:</strong> {selectedFC.statut}</p>
            </div>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '15px',
                fontSize: '14px'
              }}
            >
              <option value="">Sélectionner nouveau statut</option>
              <option value="Confirmée">✅ Confirmée</option>
              <option value="Annulée">❌ Annulée</option>
              <option value="FCC non reçue">⚠️ FCC non reçue</option>
            </select>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  if (newStatus) {
                    handleChangeStatus(selectedFC.id, newStatus);
                    setSelectedFC(null);
                    setNewStatus('');
                  }
                }}
                style={{
                  flex: '1',
                  backgroundColor: '#7D1E1C',
                  color: 'white',
                  padding: '10px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Confirmer
              </button>
              <button
                onClick={() => {
                  setSelectedFC(null);
                  setNewStatus('');
                }}
                style={{
                  flex: '1',
                  backgroundColor: '#ddd',
                  color: '#333',
                  padding: '10px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
