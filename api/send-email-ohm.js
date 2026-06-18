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
