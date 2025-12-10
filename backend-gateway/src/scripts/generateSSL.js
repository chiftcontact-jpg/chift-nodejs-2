const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sslDir = path.join(__dirname, '../../ssl');

// Créer le dossier SSL s'il n'existe pas
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir, { recursive: true });
}

const keyPath = path.join(sslDir, 'key.pem');
const certPath = path.join(sslDir, 'cert.pem');

console.log('🔐 Génération des certificats SSL auto-signés...');
console.log('');

try {
  // Générer une clé privée et un certificat auto-signé
  execSync(
    `openssl req -x509 -newkey rsa:4096 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/C=SN/ST=Dakar/L=Dakar/O=CHIFT/CN=localhost"`,
    { stdio: 'inherit' }
  );

  console.log('');
  console.log('✅ Certificats SSL générés avec succès!');
  console.log('');
  console.log('📁 Emplacement:');
  console.log(`   Clé privée: ${keyPath}`);
  console.log(`   Certificat: ${certPath}`);
  console.log('');
  console.log('⚠️  Note: Ces certificats sont auto-signés et destinés au développement uniquement.');
  console.log('   Pour la production, utilisez des certificats valides (Let\'s Encrypt, etc.)');
  console.log('');
} catch (error) {
  console.error('❌ Erreur lors de la génération des certificats:', error.message);
  console.log('');
  console.log('💡 Assurez-vous que OpenSSL est installé sur votre système.');
  console.log('   macOS: Déjà installé');
  console.log('   Linux: sudo apt-get install openssl');
  console.log('   Windows: Téléchargez depuis https://slproweb.com/products/Win32OpenSSL.html');
  process.exit(1);
}
