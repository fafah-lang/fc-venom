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
