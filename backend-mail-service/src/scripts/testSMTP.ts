#!/usr/bin/env node
/**
 * Script de test SMTP
 * Usage: npm run test:smtp [email]
 */

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Charger le .env depuis la racine du projet
dotenv.config({ path: path.join(__dirname, '../../.env') });

const testSMTP = async () => {
  console.log('\n🔍 Test de connexion SMTP...\n');
  console.log('Configuration:');
  console.log(`  Host: ${process.env.SMTP_HOST}`);
  console.log(`  Port: ${process.env.SMTP_PORT}`);
  console.log(`  Secure: ${process.env.SMTP_SECURE}`);
  console.log(`  User: ${process.env.SMTP_USER}`);
  console.log(`  Pass: ${'*'.repeat(process.env.SMTP_PASS?.length || 0)}\n`);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('⏳ Vérification de la connexion...');
    await transporter.verify();
    console.log('✅ Connexion SMTP réussie!\n');

    // Test d'envoi d'email
    const testEmail = process.argv[2] || process.env.SMTP_USER;
    
    if (testEmail) {
      console.log(`📧 Envoi d'un email de test à: ${testEmail}`);
      
      const info = await transporter.sendMail({
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: testEmail,
        subject: '✅ Test SMTP - Chift Mail Service',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0d9488;">✅ Test SMTP réussi!</h2>
            <p>Votre configuration SMTP fonctionne correctement.</p>
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              <strong>Configuration testée:</strong><br>
              Host: ${process.env.SMTP_HOST}<br>
              Port: ${process.env.SMTP_PORT}<br>
              Secure: ${process.env.SMTP_SECURE}<br>
              Date: ${new Date().toLocaleString('fr-FR')}
            </p>
          </div>
        `,
        text: 'Test SMTP réussi! Votre configuration SMTP fonctionne correctement.',
      });

      console.log(`✅ Email envoyé avec succès!`);
      console.log(`   Message ID: ${info.messageId}`);
      console.log(`   Response: ${info.response}\n`);
    }

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Erreur SMTP:', error.message);
    console.error('\n💡 Solutions possibles:');
    console.error('   1. Vérifiez que le serveur SMTP est accessible');
    console.error('   2. Vérifiez vos identifiants (SMTP_USER et SMTP_PASS)');
    console.error('   3. Essayez de changer SMTP_PORT (587 ou 465)');
    console.error('   4. Vérifiez SMTP_SECURE (false pour 587, true pour 465)');
    console.error('   5. Pour Gmail, utilisez un "App Password" au lieu du mot de passe principal');
    console.error('   6. Utilisez Mailtrap.io pour le développement (gratuit)\n');
    process.exit(1);
  }
};

testSMTP();
