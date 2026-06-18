#!/bin/bash

# Script de setup pour FC Management App
# Exécute: bash setup-fc-venom.sh

cd ~/fc-venom

# Créer les fichiers src/
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

cat > src/index.css << 'EOF'
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #ffffff;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}

button {
  font-family: inherit;
}

input, select, textarea {
  font-family: inherit;
}
EOF

cat > src/App.js << 'EOF'
import React from 'react';
import FCManagementApp from './fc-management-app';
import './App.css';

function App() {
  return (
    <div className="App">
      <FCManagementApp />
    </div>
  );
}

export default App;
EOF

cat > src/App.css << 'EOF'
.App {
  min-height: 100vh;
  background: #ffffff;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOF

# Créer les fichiers API
cat > api/send-email.js << 'EOF'
const sgMail = require('@sendgrid/mail');

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { vendeurEmail, vendeur, client, contrat, statut, dateMaj } = req.body;

  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY not found');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const statusConfig = {
    'En attente': {
      emoji: '⏳',
      message: 'Votre feuille de clarification est en attente de confirmation',
      color: '#BA7517'
    },
    'Confirmée': {
      emoji: '✅',
      message: 'Votre feuille de clarification a été confirmée',
      color: '#0F6E56'
    },
    'Annulée': {
      emoji: '❌',
      message: 'Votre feuille de clarification a été annulée',
      color: '#991F1F'
    },
    'FCC non reçue': {
      emoji: '⚠️',
      message: 'La confirmation de feuille de clarification n\'a pas été reçue',
      color: '#A32D2D'
    }
  };

  const config = statusConfig[statut] || statusConfig['En attente'];

  const msg = {
    to: vendeurEmail,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@groupe-venom.fr',
    subject: `${config.emoji} FC ${contrat} - Statut: ${statut}`,
    html: `<p>Bonjour ${vendeur},</p><p>${config.message}</p><h3>Statut: ${statut}</h3><p>Contrat: ${contrat}</p><p>Client: ${client}</p><p>Mise à jour: ${dateMaj}</p>`
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email envoyé à ${vendeurEmail}`);
    return res.status(200).json({ success: true, message: `Email envoyé à ${vendeurEmail}` });
  } catch (error) {
    console.error('❌ Erreur SendGrid:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
EOF

cat > api/send-email-ohm.js << 'EOF'
const sgMail = require('@sendgrid/mail');

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { vendeur, emailVendeur, client, contrat, dateDépôt, dateAnnulation } = req.body;

  if (!process.env.SENDGRID_API_KEY) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'relation-partenaires@ohm-energie.com',
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@groupe-venom.fr',
    subject: `⚠️ Annulation FC - Contrat ${contrat} - Groupe Venom`,
    html: `<h2>Annulation de Feuille de Clarification</h2><p>Contrat: ${contrat}</p><p>Client: ${client}</p><p>Vendeur: ${vendeur}</p><p>Email vendeur: ${emailVendeur}</p><p>Date dépôt: ${dateDépôt}</p><p>Date annulation: ${dateAnnulation}</p><p>Action requise: Annuler ce contrat dans votre système OHM.</p>`
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email annulation envoyé à OHM - Contrat ${contrat}`);
    return res.status(200).json({ success: true, message: 'Email annulation envoyé à OHM' });
  } catch (error) {
    console.error('❌ Erreur OHM:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
EOF

echo "✅ Tous les fichiers ont été créés avec succès!"
echo ""
echo "Prochaines étapes:"
echo "1. cd ~/fc-venom"
echo "2. git init"
echo "3. git add ."
echo "4. git commit -m 'Initial FC Management app'"
echo "5. Créer un repo sur GitHub"
echo "6. git remote add origin https://github.com/USERNAME/fc-venom.git"
echo "7. git push -u origin main"
